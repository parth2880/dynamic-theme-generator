import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/themes/[id] - Get specific theme
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const theme = await prisma.theme.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        });

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(theme);
    } catch (error) {
        console.error('Get theme error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/themes/[id] - Update theme
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { name, description, colors, radius, effects, isPublic } = await request.json();

        const theme = await prisma.theme.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        });

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        const updatedTheme = await prisma.theme.update({
            where: { id: params.id },
            data: {
                name: name || theme.name,
                description: description !== undefined ? description : theme.description,
                colors: colors ? JSON.stringify(colors) : theme.colors,
                radius: radius ? JSON.stringify(radius) : theme.radius,
                effects: effects ? JSON.stringify(effects) : theme.effects,
                isPublic: isPublic !== undefined ? isPublic : theme.isPublic,
            },
        });

        return NextResponse.json(updatedTheme);
    } catch (error) {
        console.error('Update theme error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/themes/[id] - Delete theme
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const theme = await prisma.theme.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        });

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        await prisma.theme.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Theme deleted successfully' });
    } catch (error) {
        console.error('Delete theme error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
