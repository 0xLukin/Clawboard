// Clawboard Extension - Content Script for Main Site
// 在主站上运行，用于同步钱包状态到插件

import { browser } from 'wxt/browser';

interface WalletSyncData {
    connected: boolean;
    address: string | null;
    balance?: string;
    tipsSent?: number;
    tipsReceived?: number;
}

export default defineContentScript({
    matches: ['http://localhost:3000/*', 'https://clawboard.xyz/*'],
    runAt: 'document_idle',

    async main() {
        console.log('🐕 Clawboard extension loaded on main site, listening for wallet sync...');

        // 监听来自页面的 postMessage（主站 WalletSyncBridge 组件发送）
        window.addEventListener('message', async (event) => {
            if (event.source !== window) return;

            if (event.data?.type === 'CLAWBOARD_WALLET_SYNC') {
                const data: WalletSyncData = event.data.data;

                if (data.connected && data.address) {
                    await browser.storage.local.set({
                        walletAddress: data.address,
                        walletBalance: data.balance || '--',
                        tipsSent: data.tipsSent || 0,
                        tipsReceived: data.tipsReceived || 0,
                    });
                    console.log('🔗 Wallet synced from page:', data.address, 'Balance:', data.balance);
                } else {
                    // 钱包断开
                    const stored = await browser.storage.local.get(['walletAddress']) as { walletAddress?: string };
                    if (stored.walletAddress) {
                        await browser.storage.local.remove(['walletAddress', 'walletBalance', 'tipsSent', 'tipsReceived']);
                        console.log('🔓 Wallet disconnected, cleared storage');
                    }
                }
            }
        });

        // 监听来自 Popup 的消息请求
        browser.runtime.onMessage.addListener((message: { type: string }, _sender, sendResponse) => {
            if (message.type === 'GET_WALLET_STATUS') {
                browser.storage.local.get(['walletAddress', 'walletBalance', 'tipsSent', 'tipsReceived']).then((stored) => {
                    const data = stored as {
                        walletAddress?: string;
                        walletBalance?: string;
                        tipsSent?: number;
                        tipsReceived?: number;
                    };
                    sendResponse({
                        connected: !!data.walletAddress,
                        address: data.walletAddress || null,
                        balance: data.walletBalance || '--',
                        tipsSent: data.tipsSent || 0,
                        tipsReceived: data.tipsReceived || 0,
                    });
                });
                return true; // 保持消息通道打开
            }
            return false;
        });

        // 通知页面扩展已准备好
        window.postMessage({ type: 'CLAWBOARD_EXT_READY' }, '*');
    },
});
