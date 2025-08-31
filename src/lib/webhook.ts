import { prisma } from './prisma';
import crypto from 'crypto';

export interface ThemeData {
    colors: Record<string, string>;
    radius: Record<string, number>;
    effects: Record<string, boolean>;
}

export interface WebhookPayload {
    theme: ThemeData;
    themeId: string;
    themeName: string;
    timestamp: string;
    signature?: string;
}

export class WebhookService {
    static async pushThemeToProject(projectId: string, themeId: string) {
        try {
            // Get project and theme data
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            if (!project || !project.isActive) {
                throw new Error('Project not found or inactive');
            }

            const theme = await prisma.theme.findUnique({
                where: { id: themeId },
            });

            if (!theme) {
                throw new Error('Theme not found');
            }

            const themeData: ThemeData = {
                colors: JSON.parse(theme.colors),
                radius: JSON.parse(theme.radius),
                effects: JSON.parse(theme.effects),
            };

            // Create webhook payload (without signature)
            const payloadWithoutSignature = {
                theme: themeData,
                themeId: theme.id,
                themeName: theme.name,
                timestamp: new Date().toISOString(),
            };

            // Create final payload with signature
            const payload: WebhookPayload = {
                ...payloadWithoutSignature,
                signature: project.apiKey ? this.generateSignature(payloadWithoutSignature, project.apiKey) : undefined,
            };

            // Send webhook
            const response = await this.sendWebhook(project.webhookUrl, payload);

            // Log webhook attempt
            await prisma.webhookLog.create({
                data: {
                    projectId: project.id,
                    status: response?.success ? 'SUCCESS' : 'FAILED',
                    response: JSON.stringify(response),
                    error: response?.error || null,
                },
            });

            return response;
        } catch (error) {
            console.error('Webhook push failed:', error);

            // Log failed attempt
            await prisma.webhookLog.create({
                data: {
                    projectId,
                    status: 'FAILED',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            });

            throw error;
        }
    }

    private static async sendWebhook(url: string, payload: WebhookPayload, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Sending webhook to ${url}, attempt ${attempt}:`, payload);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Theme-Pusher/1.0',
                    },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                });

                const responseText = await response.text();
                console.log(`Webhook response (${response.status}):`, responseText);

                let responseData;

                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = { text: responseText };
                }

                if (response.ok) {
                    return {
                        success: true,
                        status: response.status,
                        data: responseData,
                    };
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
                }
            } catch (error) {
                console.error(`Webhook attempt ${attempt} failed:`, error);

                if (attempt === retries) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Request failed',
                        attempt,
                    };
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    private static generateSignature(payload: Omit<WebhookPayload, 'signature'>, apiKey: string): string {
        const data = JSON.stringify(payload);
        return crypto.createHmac('sha256', apiKey).update(data).digest('hex');
    }

    static async pushThemeToAllProjects(themeId: string) {
        const projects = await prisma.project.findMany({
            where: { isActive: true },
        });

        const results = await Promise.allSettled(
            projects.map(project => this.pushThemeToProject(project.id, themeId))
        );

        return results.map((result, index) => ({
            project: projects[index],
            success: result.status === 'fulfilled',
            error: result.status === 'rejected' ? result.reason : null,
        }));
    }
}
