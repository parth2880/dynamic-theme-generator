import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

// POST /api/projects/create-demo - Create a demo project for testing
export async function POST(request: NextRequest) {
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

        const { name = 'Demo Project', webhookUrl = 'https://webhook.site/your-unique-url' } = await request.json();

        // Generate API key
        const apiKey = crypto.randomBytes(32).toString('hex');

        const project = await prisma.project.create({
            data: {
                name,
                description: 'Demo website for testing theme pushing',
                webhookUrl,
                apiKey,
                platform: 'CUSTOM',
                userId: user.id,
            },
        });

        return NextResponse.json({
            project,
            message: 'Demo website created successfully!',
            webhookUrl: 'You can use https://webhook.site to test webhook delivery',
        }, { status: 201 });
    } catch (error) {
        console.error('Create demo project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
