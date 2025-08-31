import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/themes - List user's themes
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

        const themes = await prisma.theme.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(themes);
    } catch (error) {
        console.error('Get themes error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/themes - Create new theme
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

        const { name, description, colors, radius, effects, isPublic = false } = await request.json();

        // Validate input
        if (!name || !colors || !radius || !effects) {
            return NextResponse.json(
                { error: 'Name, colors, radius, and effects are required' },
                { status: 400 }
            );
        }

        const theme = await prisma.theme.create({
            data: {
                name,
                description,
                colors: JSON.stringify(colors),
                radius: JSON.stringify(radius),
                effects: JSON.stringify(effects),
                isPublic,
                userId: user.id,
            },
        });

        return NextResponse.json(theme, { status: 201 });
    } catch (error) {
        console.error('Create theme error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
