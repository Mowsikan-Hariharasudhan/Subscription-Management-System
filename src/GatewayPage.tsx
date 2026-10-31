import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatGPTIcon, DeepSeekIcon, GeminiIcon, ClaudeIcon, LovableIcon } from './ModelIcons'
import './gateway.css'

/* ------------------------------------------------------------------ */
/*  Model definitions                                                   */
/* ------------------------------------------------------------------ */
export type ModelId = 'chatgpt' | 'deepseek' | 'gemini' | 'claude' | 'lovable'

export interface Model {
  id: ModelId
  name: string
  provider: string
  route: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  iconColor: string
  tagline?: string
}

export const MODELS: Model[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    route: '/chatgpt/login',
    Icon: ChatGPTIcon,
    iconColor: '#10a37f',
    tagline: 'High-Contrast Swiss Grid Edition',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek AI',
    route: '/deepseek/login',
    Icon: DeepSeekIcon,
    iconColor: '#4460F1',
    tagline: 'Ultra-Dense Quantitative Terminal',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    route: '/gemini/login',
    Icon: GeminiIcon,
    iconColor: '#1a73e8',
    tagline: 'Kinetic Structural Brutalist Edition',
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    route: '/claude/login',
    Icon: ClaudeIcon,
    iconColor: '#d97706',
    tagline: 'Editorial Corporate Monochrome',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    provider: 'Lovable AI',
    route: '/lovable/login',
    Icon: LovableIcon,
    iconColor: '#ec4899',
    tagline: 'Rapid Full-Stack Cloud Edition',
  },
]

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7H11.5M7.5 3.5L11.5 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function GatewayPage() {
  const [selected, setSelected] = useState<ModelId>('deepseek')
  const navigate = useNavigate()

  const selectedModel = MODELS.find(m => m.id === selected)

  function handleSelect(id: ModelId) {
    setSelected(id)
    localStorage.setItem('bl.provider', id)
  }

  function handleContinue() {
    if (!selectedModel) return
    navigate(selectedModel.route)
  }

  function handleKeyDown(e: React.KeyboardEvent, id: ModelId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(id)
    }
  }

  return (
    <main className="gateway-root">
      {/* Brand */}
      <header className="gateway-brand" aria-label="Brightloop">
        <div className="gateway-brand-mark" aria-hidden="true">
          <span>B</span>
        </div>
        <div className="gateway-brand-name">
          <h1>Brightloop</h1>
          <span>Subscription Operations</span>
        </div>
      </header>

      {/* Card */}
      <div className="gateway-card" role="main">
        <h2 className="gateway-heading">Choose your experience</h2>
        <p className="gateway-subtitle">
          Select an AI-powered interface to explore Brightloop.
        </p>

        {/* Models Grid */}
        <div
          className="gateway-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          role="radiogroup"
          aria-label="AI model selection"
        >
          {MODELS.map(model => {
            const isSelected = selected === model.id
            return (
              <div
                key={model.id}
                className={`model-card${isSelected ? ' selected' : ''}`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(model.id)}
                onKeyDown={e => handleKeyDown(e, model.id)}
                aria-label={`${model.name} by ${model.provider}`}
              >
                <div className="model-card-header">
                  <div className="model-card-icon" aria-hidden="true">
                    <model.Icon
                      width={20}
                      height={20}
                      style={{ color: isSelected ? 'var(--accent)' : model.iconColor }}
                    />
                  </div>
                  <div className="model-card-select-dot" aria-hidden="true" />
                </div>

                <div className="model-card-body">
                  <div className="flex items-center justify-between">
                    <div className="model-card-name">{model.name}</div>
                    {isSelected && (
                      <span className="text-[9px] font-mono px-1 py-0.5 bg-[var(--accent)] text-white rounded">ACTIVE</span>
                    )}
                  </div>
                  <div className="model-card-provider">{model.provider}</div>
                  <div className="text-[11px] text-[var(--ink-60)] mt-0.5 leading-snug">{model.tagline}</div>
                  <div className="model-card-route mono">{model.route}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="gateway-divider" role="separator" />

        <div className="gateway-cta">
          <div>
            <p className="gateway-cta-note font-medium text-[var(--ink)]">
              {selectedModel ? `Opening ${selectedModel.name} — ${selectedModel.provider}` : 'Select an AI interface'}
            </p>
            <p className="text-xs text-[var(--ink-40)]">Each model delivers an independently isolated architecture.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-2 text-sm border border-[var(--line-strong)] text-[var(--ink)] rounded bg-white hover:bg-[var(--surface-2)] transition-colors"
            >
              Unified Login Gate →
            </button>
            <button
              className="gateway-cta-btn"
              onClick={handleContinue}
              aria-label={`Open ${selectedModel?.name} experience`}
            >
              Launch Interface
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <footer className="gateway-footer">
        <p>Brightloop · Subscription Operations · Multi-Model Architecture</p>
      </footer>
    </main>
  )
}
