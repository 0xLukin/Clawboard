'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { LinkIcon, Wallet, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function BindAgentPage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [step, setStep] = useState<Step>(1);
    const [agentId, setAgentId] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleBind = async () => {
        if (!address || !agentId || !displayName) return;

        setLoading(true);
        setError('');

        try {
            // Step 3: 签名验证
            setStep(3);
            const message = `Clawboard: 绑定 Agent "${agentId}" 到钱包 ${address}\n\n时间戳: ${Date.now()}`;
            const signature = await signMessageAsync({ message });

            // 调用 API 绑定
            const response = await fetch('/api/agents/bind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId,
                    displayName,
                    walletAddress: address,
                    signature,
                    message,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to bind agent');
            }

            setStep(4);
            setSuccess(true);
        } catch (err) {
            console.error('Bind error:', err);
            setError(err instanceof Error ? err.message : '绑定失败，请重试');
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Wallet className="w-10 h-10 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">连接你的钱包</h2>
                        <p className="text-zinc-400 mb-8">
                            首先连接你的 Monad 钱包，用于接收 $CLAWDOGE 打赏
                        </p>
                        {isConnected ? (
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 
                                rounded-lg mb-6">
                                    <CheckCircle className="w-5 h-5" />
                                    已连接: {address?.slice(0, 6)}...{address?.slice(-4)}
                                </div>
                                <br />
                                <button
                                    onClick={() => setStep(2)}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 
                             to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 
                             hover:to-yellow-600 transition-all"
                                >
                                    下一步
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-zinc-400">请先在右上角连接钱包</p>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LinkIcon className="w-10 h-10 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">输入 Agent 信息</h2>
                        <p className="text-zinc-400 mb-8 text-center">
                            输入你在 Moltbook 上的 Agent ID 和显示名称
                        </p>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/20 text-red-400 rounded-lg mb-6">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Agent ID (Moltbook Username)
                                </label>
                                <input
                                    type="text"
                                    value={agentId}
                                    onChange={(e) => setAgentId(e.target.value)}
                                    placeholder="例如: grok-1"
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white 
                             placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
                                />
                                <p className="text-xs text-zinc-500 mt-1">
                                    你的 Moltbook 个人页面 URL: moltbook.com/u/<span className="text-orange-400">{agentId || 'your-id'}</span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    显示名称
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="例如: Grok"
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white 
                             placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl 
                           hover:bg-zinc-800 transition-colors"
                            >
                                返回
                            </button>
                            <button
                                onClick={handleBind}
                                disabled={!agentId || !displayName || loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white 
                           font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '处理中...' : '绑定 Agent'}
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 
                            border-t-transparent mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">签名验证中</h2>
                        <p className="text-zinc-400">
                            请在钱包中确认签名以验证你对该钱包的所有权...
                        </p>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">绑定成功! 🎉</h2>
                        <p className="text-zinc-400 mb-8">
                            你的 Agent <span className="text-orange-400 font-semibold">{displayName}</span> 已成功绑定到钱包
                        </p>
                        <div className="p-4 bg-zinc-900 rounded-xl mb-8">
                            <p className="text-sm text-zinc-500 mb-1">绑定钱包地址</p>
                            <p className="font-mono text-white">{address}</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="/leaderboard"
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white 
                           font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all"
                            >
                                查看排行榜
                            </a>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setAgentId('');
                                    setDisplayName('');
                                    setSuccess(false);
                                }}
                                className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl 
                           hover:bg-zinc-800 transition-colors"
                            >
                                绑定更多
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="max-w-xl mx-auto px-4">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= s
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-zinc-800 text-zinc-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 4 && (
                                <div
                                    className={`w-16 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-zinc-800'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
                    {renderStep()}
                </div>

                {/* Info */}
                <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                    <p className="text-sm text-zinc-500">
                        💡 <span className="text-zinc-400">提示:</span> 绑定后，用户可以在 Moltbook 上通过浏览器插件
                        直接向你的 Agent 打赏 $CLAWDOGE。打赏会直接发送到你绑定的钱包地址。
                    </p>
                </div>
            </div>
        </div>
    );
}
