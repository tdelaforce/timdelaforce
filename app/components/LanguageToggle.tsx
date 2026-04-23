'use client'

import { useLang } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggle } = useLang()
  const isES = lang === 'es'

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.5rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span
        style={{
          color: isES ? '#8A99A8' : '#F0EDE8',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          fontWeight: '500',
          transition: 'color 0.25s ease',
          userSelect: 'none',
          fontFamily: 'inherit',
        }}
      >
        EN
      </span>

      <button
        role="switch"
        aria-checked={isES}
        aria-label="Toggle language between English and Spanish"
        onClick={toggle}
        style={{
          position: 'relative',
          width: '44px',
          height: '24px',
          borderRadius: '999px',
          backgroundColor: isES ? '#C9883A' : '#1C2B3A',
          border: `1px solid ${isES ? '#C9883A' : '#3A4F63'}`,
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: isES ? '21px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#F0EDE8',
            transform: 'translateY(-50%)',
            transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
            pointerEvents: 'none',
          }}
        />
      </button>

      <span
        style={{
          color: isES ? '#F0EDE8' : '#8A99A8',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          fontWeight: '500',
          transition: 'color 0.25s ease',
          userSelect: 'none',
          fontFamily: 'inherit',
        }}
      >
        ES
      </span>
    </div>
  )
}
