import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';

// GET /api/agents - 获取 Agent 列表（排行榜）
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // 构建查询条件
        const query = search
            ? {
                $or: [
                    { agentId: { $regex: search, $options: 'i' } },
                    { displayName: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        // 获取总数
        const total = await Agent.countDocuments(query);

        // 获取排行榜（按余额降序）
        const agents = await Agent.find(query)
            .sort({ balance: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                agents,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch agents' },
            { status: 500 }
        );
    }
}
