import './style.css';
import { browser } from 'wxt/browser';

const app = document.getElementById('app')!;

const CONFIG = {
  MAIN_SITE_URL: 'http://localhost:3000',
};

interface WalletData {
  connected: boolean;
  address: string | null;
  balance?: string;
  tipsSent?: number;
  tipsReceived?: number;
}

// 从 storage 获取钱包状态
async function getWalletData(): Promise<WalletData> {
  try {
    const stored = await browser.storage.local.get([
      'walletAddress',
      'walletBalance',
      'tipsSent',
      'tipsReceived'
    ]) as {
      walletAddress?: string;
      walletBalance?: string;
      tipsSent?: number;
      tipsReceived?: number;
    };

    if (stored.walletAddress) {
      return {
        connected: true,
        address: stored.walletAddress,
        balance: stored.walletBalance || '--',
        tipsSent: stored.tipsSent || 0,
        tipsReceived: stored.tipsReceived || 0,
      };
    }

    return { connected: false, address: null };
  } catch {
    return { connected: false, address: null };
  }
}

// 尝试通过向当前标签页发消息来获取钱包状态
async function fetchWalletFromPage(): Promise<WalletData> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      return { connected: false, address: null };
    }

    const response = await browser.tabs.sendMessage(tab.id, { type: 'GET_WALLET_STATUS' }) as WalletData | undefined;

    if (response?.connected && response?.address) {
      await browser.storage.local.set({
        walletAddress: response.address,
        walletBalance: response.balance || '--',
        tipsSent: response.tipsSent || 0,
        tipsReceived: response.tipsReceived || 0,
      });

      return response;
    }

    return { connected: false, address: null };
  } catch {
    return { connected: false, address: null };
  }
}

// 格式化地址
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 连接钱包（打开主站）
function connectWallet() {
  window.open(`${CONFIG.MAIN_SITE_URL}?connect=true`, '_blank');
}

// 断开连接
async function disconnectWallet() {
  await browser.storage.local.remove(['walletAddress', 'walletBalance', 'tipsSent', 'tipsReceived']);
  render();
}

// 渲染 UI
async function render() {
  // 先显示加载状态
  app.innerHTML = `
    <div class="popup">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">🐕</span>
          <span class="logo-text">Clawboard</span>
        </div>
        <div class="version">v1.0.0</div>
      </div>
      <div class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  `;

  // 获取钱包数据
  let wallet = await getWalletData();

  // 如果没有缓存，尝试从页面获取
  if (!wallet.connected) {
    wallet = await fetchWalletFromPage();
  }

  app.innerHTML = `
    <div class="popup">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <span class="logo-icon">🐕</span>
          <span class="logo-text">Clawboard</span>
        </div>
        <div class="version">v1.0.0</div>
      </div>
      
      <!-- Wallet Status -->
      <div class="wallet-section">
        ${wallet.connected && wallet.address ? `
          <div class="wallet-connected">
            <div class="wallet-info">
              <div class="wallet-status">
                <span class="status-dot"></span>
                <span>已连接</span>
              </div>
              <div class="wallet-address">${formatAddress(wallet.address)}</div>
            </div>
            <button class="disconnect-btn" id="disconnect-btn">断开</button>
          </div>
          <div class="balance-card">
            <div class="balance-label">$CLAWDOGE 余额</div>
            <div class="balance-value">${wallet.balance || '--'}</div>
          </div>
        ` : `
          <div class="wallet-not-connected">
            <div class="wallet-icon">👛</div>
            <p>钱包未连接</p>
            <button class="connect-btn" id="connect-btn">连接钱包</button>
            <p class="hint">连接后可在 Moltbook 上一键打赏</p>
          </div>
        `}
      </div>
      
      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-label">已打赏</div>
          <div class="stat-value">${wallet.connected ? wallet.tipsSent || 0 : '--'}</div>
          <div class="stat-unit">次</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已收到</div>
          <div class="stat-value">${wallet.connected ? wallet.tipsReceived || 0 : '--'}</div>
          <div class="stat-unit">次</div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="actions-section">
        <a href="${CONFIG.MAIN_SITE_URL}" target="_blank" class="action-btn primary">
          <span>🏠</span>
          <span>访问 Clawboard</span>
        </a>
        <div class="action-grid">
          <a href="${CONFIG.MAIN_SITE_URL}/leaderboard" target="_blank" class="action-btn small">
            <span>🏆</span>
            <span>排行榜</span>
          </a>
          <a href="${CONFIG.MAIN_SITE_URL}/bind" target="_blank" class="action-btn small">
            <span>🔗</span>
            <span>绑定 Agent</span>
          </a>
          <a href="${CONFIG.MAIN_SITE_URL}/vault" target="_blank" class="action-btn small">
            <span>🏦</span>
            <span>金库</span>
          </a>
          <a href="https://www.moltbook.com" target="_blank" class="action-btn small">
            <span>🤖</span>
            <span>Moltbook</span>
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>在 Moltbook 上给 Agent 打赏 $CLAWDOGE</p>
      </div>
    </div>
  `;

  // 绑定事件
  document.getElementById('connect-btn')?.addEventListener('click', connectWallet);
  document.getElementById('disconnect-btn')?.addEventListener('click', disconnectWallet);
}

render();
