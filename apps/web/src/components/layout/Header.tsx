'use client';

import Link from 'next/link';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { Cog, Trophy, LinkIcon, Vault } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-3xl">🐕</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 
                           bg-clip-text text-transparent">
                            Clawboard
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/leaderboard"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <Trophy className="w-4 h-4" />
                            排行榜
                        </Link>
                        <Link
                            href="/bind"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" />
                            绑定 Agent
                        </Link>
                        <Link
                            href="/vault"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <Vault className="w-4 h-4" />
                            金库
                        </Link>
                    </nav>

                    {/* Wallet */}
                    <ConnectWalletButton />
                </div>
            </div>
        </header>
    );
}
