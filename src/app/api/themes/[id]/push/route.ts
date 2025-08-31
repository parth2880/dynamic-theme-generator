import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { WebhookService } from '@/lib/webhook';

// POST /api/themes/[id]/push - Push theme to connected projects
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const user = await getCurrentUser(token);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { projectIds } = await request.json();

        // Verify theme exists and belongs to user
        const theme = await prisma.theme.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        let results: Array<{ success: boolean; error: string | null }>;

        if (projectIds && Array.isArray(projectIds)) {
            // Push to specific projects
            const settledResults = await Promise.allSettled(
                projectIds.map(projectId =>
                    WebhookService.pushThemeToProject(projectId, id)
                )
            );
            results = settledResults.map(r => ({
                success: r.status === 'fulfilled',
                error: r.status === 'rejected' ? r.reason : null,
            }));
        } else {
            // Push to all connected projects
            results = await WebhookService.pushThemeToAllProjects(id);
        }

        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;

        return NextResponse.json({
            message: `Theme updated on ${successCount}/${totalCount} websites`,
            results,
        });
    } catch (error) {
        console.error('Push theme error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
