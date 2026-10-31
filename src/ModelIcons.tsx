/* ChatGPT — interlocking hexagon icon */
import type { SVGProps } from 'react'

export function ChatGPTIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 2L16.928 6V14L10 18L3.072 14V6L10 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 5.5L14.33 8V13L10 15.5L5.67 13V8L10 5.5Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* DeepSeek — whale / wave glyph */
export function DeepSeekIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3 13C3 13 5 8 10 8C15 8 17 13 17 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 11C5 11 6.5 7 10 7C13.5 7 15 11 15 11"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      <ellipse cx="10" cy="13.5" rx="3.5" ry="2.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.25"/>
      <circle cx="10" cy="5" r="1.25" fill="currentColor"/>
    </svg>
  )
}

/* Gemini — four-point star */
export function GeminiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 2C10 2 11 7 14 10C11 13 10 18 10 18C10 18 9 13 6 10C9 7 10 2 10 2Z"
        fill="currentColor"
      />
      <path
        d="M2 10C2 10 7 9 10 6C13 9 18 10 18 10C18 10 13 11 10 14C7 11 2 10 2 10Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}

/* Claude — asterisk / burst */
export function ClaudeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <line x1="10" y1="2.5" x2="10" y2="17.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <line x1="2.5" y1="6.25" x2="17.5" y2="13.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <line x1="2.5" y1="13.75" x2="17.5" y2="6.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  )
}

/* Lovable — heart / pulse spark glyph */
export function LovableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10 16.5L3.8 10.3C2.2 8.7 2.2 6.1 3.8 4.5C5.4 2.9 8 2.9 9.6 4.5L10 4.9L10.4 4.5C12 2.9 14.6 2.9 16.2 4.5C17.8 6.1 17.8 8.7 16.2 10.3L10 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  )
}
