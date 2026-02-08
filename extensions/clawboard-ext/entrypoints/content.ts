// Clawboard Extension - Content Script
// 简化版：点击打赏按钮后跳转到主站进行打赏

const CONFIG = {
  MAIN_SITE_URL: 'http://localhost:3000',
  API_BASE_URL: 'http://localhost:3000/api',
};

interface Agent {
  agentId: string;
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
  balance: number;
}

// Mock data for demo
const MOCK_AGENTS: Record<string, Agent> = {
  'grok-1': {
    agentId: 'grok-1',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'Grok',
    balance: 125000,
  },
  'claude': {
    agentId: 'claude',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    displayName: 'Claude',
    balance: 98500,
  },
  'aipapa': {
    agentId: 'aipapa',
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    displayName: 'AI爸爸',
    balance: 75200,
  },
};

async function fetchAgentInfo(agentId: string): Promise<Agent | null> {
  if (MOCK_AGENTS[agentId]) {
    return MOCK_AGENTS[agentId];
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/agents/${agentId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default defineContentScript({
  matches: ['https://www.moltbook.com/*', 'https://moltbook.com/*'],
  runAt: 'document_idle',

  async main() {
    console.log('🐕 Clawboard extension loaded on Moltbook!');

    const url = window.location.href;
    const match = url.match(/moltbook\.com\/u\/([^\/\?]+)/);

    if (match && match[1]) {
      await injectAgentPageButton(match[1]);
    }

    observeDOM();
  },
});

async function injectAgentPageButton(agentId: string) {
  console.log(`🔍 Detecting agent: ${agentId}`);

  const agent = await fetchAgentInfo(agentId);
  const headerArea = document.querySelector('h1, [class*="username"], [class*="display-name"]');

  if (!headerArea) {
    setTimeout(() => injectAgentPageButton(agentId), 1000);
    return;
  }

  if (document.getElementById('clawboard-tip-btn')) return;

  const tipButton = createTipButton(agentId, agent);
  headerArea.parentElement?.appendChild(tipButton);
}

function createTipButton(agentId: string, agent: Agent | null): HTMLElement {
  const container = document.createElement('div');
  container.id = 'clawboard-tip-btn';

  // 构建跳转 URL
  const tipUrl = `${CONFIG.MAIN_SITE_URL}/tip?agentId=${encodeURIComponent(agentId)}${agent ? `&name=${encodeURIComponent(agent.displayName)}` : ''}`;

  container.innerHTML = `
    <style>
      #clawboard-tip-btn { 
        display: inline-block;
        margin-left: 8px;
        vertical-align: middle;
      }
      .clawboard-btn {
        display: inline-flex; 
        align-items: center; 
        gap: 6px;
        padding: 6px 14px;
        background: #1a1a1b;
        border: 1px solid #343536;
        border-radius: 20px;
        color: #d7dadc;
        font-weight: 500; 
        font-size: 12px;
        cursor: pointer; 
        transition: all 0.15s ease;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .clawboard-btn:hover { 
        background: #272729;
        border-color: #ff4500;
        color: #ff4500;
      }
      .clawboard-btn:active {
        transform: scale(0.98);
      }
      .clawboard-icon {
        font-size: 14px;
        line-height: 1;
      }
      .clawboard-text {
        color: inherit;
      }
      .clawboard-balance {
        display: inline-flex;
        align-items: center;
        padding: 2px 6px;
        background: rgba(255, 69, 0, 0.15);
        border-radius: 10px;
        font-size: 10px;
        color: #ff4500;
        font-weight: 600;
      }
    </style>
    <a href="${tipUrl}" target="_blank" class="clawboard-btn">
      <span class="clawboard-icon">🐕</span>
      <span class="clawboard-text">Tip</span>
      ${agent && agent.balance > 0 ? `<span class="clawboard-balance">${formatNumber(agent.balance)}</span>` : ''}
    </a>
  `;

  return container;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

function observeDOM() {
  const observer = new MutationObserver(() => { });
  observer.observe(document.body, { childList: true, subtree: true });
}
