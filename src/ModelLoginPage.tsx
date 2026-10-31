/**
 * ModelLoginPage.tsx
 *
 * A single reusable placeholder component that renders each model's
 * independent login page stub. Each of the four routes renders this
 * with different props — they are isolated entry points, not a shared UI.
 *
 * Architecture note (per spec §5):
 * The four application experiences will be developed independently.
 * These placeholders establish the routing structure and navigation
 * entry points without coupling the implementations.
 */

import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import './placeholder.css'

interface ModelLoginPageProps {
  modelName: string
  provider: string
  route: string
  icon: ReactNode
  accentColor: string
  description: string
}

function BackArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M10 6.5H3M6 3.5L3 6.5L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M7 4.5V7L8.5 8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

export default function ModelLoginPage({
  modelName,
  provider,
  route,
  icon,
  accentColor,
  description,
}: ModelLoginPageProps) {
  return (
    <main className="placeholder-root">
      <div className="placeholder-card">
        {/* Model badge */}
        <div className="placeholder-badge">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: accentColor,
              flexShrink: 0,
            }}
          />
          <span>Independent application</span>
        </div>

        {/* Icon */}
        <div
          className="placeholder-icon-wrap"
          style={{ color: accentColor }}
          aria-hidden="true"
        >
          {icon}
        </div>

        {/* Name */}
        <div>
          <div className="placeholder-model-name">{modelName}</div>
          <div className="placeholder-model-provider">{provider}</div>
        </div>

        {/* Description */}
        <p className="placeholder-description">{description}</p>

        {/* Coming soon indicator */}
        <div className="placeholder-coming-soon">
          <ClockIcon />
          <span>Application under development</span>
        </div>

        {/* Route hint */}
        <span className="placeholder-route-hint mono">{route}</span>

        {/* Back to gateway */}
        <Link to="/" className="placeholder-back-btn">
          <BackArrow />
          Back to model selection
        </Link>
      </div>
    </main>
  )
}

