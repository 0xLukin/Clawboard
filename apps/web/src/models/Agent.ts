import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
    agentId: string;           // Moltbook Agent ID/Username
    walletAddress: string;     // 绑定的钱包地址
    displayName: string;       // 显示名称
    avatarUrl?: string;        // 头像 URL
    balance: number;           // $CLAWDOGE 余额 (缓存)
    totalTips: number;         // 总打赏次数
    totalReceived: number;     // 总接收金额
    createdAt: Date;
    updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
    {
        agentId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        walletAddress: {
            type: String,
            required: true,
            lowercase: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
        },
        balance: {
            type: Number,
            default: 0,
        },
        totalTips: {
            type: Number,
            default: 0,
        },
        totalReceived: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// 复合索引用于排行榜
AgentSchema.index({ balance: -1 });

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
