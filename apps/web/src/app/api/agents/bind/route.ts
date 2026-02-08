import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { verifyMessage } from 'viem';

// 内存存储（开发模式用）
const mockAgents: Map<string, {
    agentId: string;
    walletAddress: string;
    displayName: string;
    avatarUrl?: string;
    balance: number;
    totalTips: number;
    totalReceived: number;
    createdAt: Date;
}> = new Map();

// POST /api/agents/bind - 绑定 Agent 钱包地址
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { agentId, displayName, walletAddress, avatarUrl, signature, message } = body;
    console.log('Request body:', { agentId, displayName, walletAddress, hasSignature: !!signature });

    // 验证必填字段
    if (!agentId || !walletAddress || !displayName) {
        return NextResponse.json(
            { success: false, error: 'Missing required fields' },
            { status: 400 }
        );
    }

    // 验证签名 (可选，用于验证钱包所有权)
    if (signature && message) {
        try {
            console.log('Verifying signature...');
            const isValid = await verifyMessage({
                address: walletAddress as `0x${string}`,
                message,
                signature: signature as `0x${string}`,
            });

            if (!isValid) {
                return NextResponse.json(
                    { success: false, error: 'Invalid signature' },
                    { status: 401 }
                );
            }
            console.log('Signature verified successfully');
        } catch (sigError) {
            console.error('Signature verification error:', sigError);
            return NextResponse.json(
                { success: false, error: 'Signature verification failed' },
                { status: 401 }
            );
        }
    }

    // 尝试使用 MongoDB
    try {
        console.log('Binding agent - connecting to DB...');
        await connectDB();
        console.log('DB connected successfully');

        // 检查 Agent 是否已存在
        const existingAgent = await Agent.findOne({ agentId });

        if (existingAgent) {
            existingAgent.walletAddress = walletAddress.toLowerCase();
            existingAgent.displayName = displayName;
            if (avatarUrl) existingAgent.avatarUrl = avatarUrl;
            await existingAgent.save();

            return NextResponse.json({
                success: true,
                data: existingAgent,
                message: 'Agent updated successfully',
            });
        }

        const newAgent = new Agent({
            agentId,
            walletAddress: walletAddress.toLowerCase(),
            displayName,
            avatarUrl,
            balance: 0,
            totalTips: 0,
            totalReceived: 0,
        });

        await newAgent.save();
        console.log('Agent saved successfully');

        return NextResponse.json({
            success: true,
            data: newAgent,
            message: 'Agent bound successfully',
        });
    } catch (dbError) {
        console.warn('MongoDB connection failed, using mock storage:', dbError);

        // 降级到内存存储
        const agentData = {
            agentId,
            walletAddress: walletAddress.toLowerCase(),
            displayName,
            avatarUrl,
            balance: 0,
            totalTips: 0,
            totalReceived: 0,
            createdAt: new Date(),
        };

        mockAgents.set(agentId, agentData);
        console.log('Agent saved to mock storage:', agentId);

        return NextResponse.json({
            success: true,
            data: agentData,
            message: 'Agent bound successfully (mock mode)',
        });
    }
}


