import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
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

        const projects = await prisma.project.findMany({
            where: { userId: user.id },
            include: {
                themes: {
                    include: { theme: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project
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

        const { name, description, webhookUrl, platform = 'CUSTOM' } = await request.json();

        // Validate input
        if (!name || !webhookUrl) {
            return NextResponse.json(
                { error: 'Name and webhook URL are required' },
                { status: 400 }
            );
        }

        // Validate webhook URL
        try {
            new URL(webhookUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid webhook URL' },
                { status: 400 }
            );
        }

        // Generate API key
        const apiKey = crypto.randomBytes(32).toString('hex');

        const project = await prisma.project.create({
            data: {
                name,
                description,
                webhookUrl,
                apiKey,
                platform,
                userId: user.id,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
