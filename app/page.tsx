'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

const sections = ['About', 'Career', 'Biblical Understanding', 'Plating'] as const
type Section = typeof sections[number]

const placeholderContent: Record<Section, React.ReactNode> = {
  About: (
    <div>
      <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
        I've spent my career in the middle of real operations, not managing them from a distance.
      </p>
      <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
        Right now I'm the General Manager of{' '}
        <a href="https://hmplating.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9883A', textDecoration: 'none' }}>
          Mirror Industries, a division of H&M Plating Co.
        </a>
        , where I oversee the full business — sales, production, maintenance, and everything in between.
      </p>
      <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
        Before that, I acquired{' '}
        <a href="https://mastinlabs.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9883A', textDecoration: 'none' }}>
          Mastin Labs
        </a>{' '}
        alongside three equity partners and ran it as its operator. We exited in early 2026.
      </p>
      <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
        What I do well is figure out what's actually broken, not just what looks broken. I work from first principles — whether I'm rebuilding a customer outreach process, fixing a production bottleneck, or rethinking how a business presents itself. I've done sales, operations, marketing, and turnaround work.
      </p>
      <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem' }}>
        I'm from South Africa, live in Houston, and I like solving difficult problems.
      </p>
    </div>
  ),
  Career: 'This is the Career section.',
  'Biblical Understanding': 'This is the Biblical Understanding section.',
  Plating: 'This is the Plating section.',
}

export default function Home() {
  const [active, setActive] = useState<Section | null>(null)

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' as const }}
          >
            <h1 style={styles.headline}>Hi, my name is Timothy.</h1>
            <div style={styles.buttonGroup}>
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActive(section)}
                  style={styles.button}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C9883A')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {section}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.layout}
          >
            <div style={styles.sidebar}>
              <h2
                style={{ ...styles.sidebarName, cursor: 'pointer' }}
                onClick={() => setActive(null)}
              >
                Timothy
              </h2>
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActive(section)}
                  style={{
                    ...styles.sidebarButton,
                    color: active === section ? '#C9883A' : '#F0EDE8',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9883A')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = active === section ? '#C9883A' : '#F0EDE8')}
                >
                  {section}
                </button>
              ))}
            </div>
            <div style={styles.content}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={styles.contentHeadline}>{active}</h2>
                <div style={styles.contentText}>{placeholderContent[active]}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0F1923',
    color: '#F0EDE8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
  },
  headline: {
    fontSize: '2.5rem',
    fontWeight: '300',
    marginBottom: '2.5rem',
    color: '#F0EDE8',
    letterSpacing: '0.02em',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.75rem',
    border: '1px solid #C9883A',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#F0EDE8',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    letterSpacing: '0.05em',
  },
  layout: {
    display: 'flex',
    width: '100vw',
    minHeight: '100vh',
  },
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    backgroundColor: '#1C2B3A',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sidebarName: {
    fontSize: '1.25rem',
    fontWeight: '400',
    color: '#F0EDE8',
    marginBottom: '1.5rem',
    letterSpacing: '0.05em',
  },
  sidebarButton: {
    background: 'none',
    border: 'none',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0.4rem 0',
    transition: 'color 0.2s ease',
    letterSpacing: '0.03em',
  },
  content: {
    flex: 1,
    padding: '4rem',
    display: 'flex',
    alignItems: 'flex-start',
  },
  contentHeadline: {
    fontSize: '2rem',
    fontWeight: '300',
    marginBottom: '1.5rem',
    color: '#F0EDE8',
  },
  contentText: {
    color: '#8A99A8',
    lineHeight: '1.7',
    fontSize: '1rem',
  },
}