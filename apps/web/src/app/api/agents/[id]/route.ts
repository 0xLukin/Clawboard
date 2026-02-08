import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';

// GET /api/agents/[id] - 获取单个 Agent 信息
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const agent = await Agent.findOne({ agentId: id }).lean();

        if (!agent) {
            return NextResponse.json(
                { success: false, error: 'Agent not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: agent,
        });
    } catch (error) {
        console.error('Error fetching agent:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch agent' },
            { status: 500 }
        );
    }
}
