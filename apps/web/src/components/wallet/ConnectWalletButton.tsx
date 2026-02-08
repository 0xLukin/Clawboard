'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useState } from 'react';
import { Wallet, LogOut, ChevronDown, Copy, Check } from 'lucide-react';

export function ConnectWalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });

    const [showDropdown, setShowDropdown] = useState(false);
    const [showWalletList, setShowWalletList] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    if (isConnected && address) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 
                     hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl 
                     transition-all duration-200 shadow-lg shadow-orange-500/25"
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>{formatAddress(address)}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl 
                          shadow-xl overflow-hidden z-50">
                        <div className="p-4 border-b border-zinc-700">
                            <p className="text-sm text-zinc-400 mb-1">余额</p>
                            <p className="text-lg font-bold text-white">
                                {balance ? `${(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} ${balance.symbol}` : '加载中...'}
                            </p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={copyAddress}
                                className="w-full flex items-center gap-2 px-3 py-2 text-zinc-300 hover:bg-zinc-800 
                           rounded-lg transition-colors text-left"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? '已复制!' : '复制地址'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    disconnect();
                                    setShowDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-zinc-800 
                           rounded-lg transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>断开连接</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowWalletList(!showWalletList)}
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 
                 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl 
                 transition-all duration-200 shadow-lg shadow-orange-500/25 disabled:opacity-50 
                 disabled:cursor-not-allowed"
            >
                <Wallet className="w-5 h-5" />
                {isPending ? '连接中...' : '连接钱包'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showWalletList ? 'rotate-180' : ''}`} />
            </button>

            {showWalletList && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-xl 
                      shadow-xl overflow-hidden z-50">
                    <div className="p-2">
                        <p className="px-3 py-2 text-xs text-zinc-500 uppercase tracking-wide">选择钱包</p>
                        {connectors.map((connector) => (
                            <button
                                key={connector.uid}
                                onClick={() => {
                                    connect({ connector });
                                    setShowWalletList(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-300 
                                 hover:bg-zinc-800 rounded-lg transition-colors text-left"
                            >
                                <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-4 h-4" />
                                </div>
                                <span>{connector.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

