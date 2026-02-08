'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';

// Mock 数据
const MOCK_CLAWDOGE_BALANCE = 12580.50;

// 这个组件用于将钱包状态同步到浏览器插件
export function WalletSyncBridge() {
    const { address, isConnected } = useAccount();

    useEffect(() => {
        // 向插件发送钱包状态
        const syncToExtension = () => {
            window.postMessage({
                type: 'CLAWBOARD_WALLET_SYNC',
                data: {
                    connected: isConnected,
                    address: address || null,
                    // Mock 数据
                    balance: isConnected ? MOCK_CLAWDOGE_BALANCE.toLocaleString() : '0',
                    tipsSent: isConnected ? 23 : 0,
                    tipsReceived: isConnected ? 156 : 0,
                }
            }, '*');
        };

        // 立即同步一次
        syncToExtension();

        // 每2秒同步一次
        const interval = setInterval(syncToExtension, 2000);

        return () => clearInterval(interval);
    }, [address, isConnected]);

    // 这个组件不渲染任何内容
    return null;
}
