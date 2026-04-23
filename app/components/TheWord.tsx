'use client'

import { useState } from 'react'
import SalvationDiagram from './SalvationDiagram'
import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'

const diagrams: Record<Lang, {
  id: string
  title: string
  verse: string
  verseText: string
  description: string
}[]> = {
  en: [
    {
      id: 'salvation',
      title: 'Salvation',
      verse: 'Ephesians 2:8-9',
      verseText: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: not of works, lest any man should boast.',
      description: 'A full biblical picture of salvation — from the condition every person is born into, through justification, sanctification, and glorification. Traces the thread from Genesis to Revelation.',
    },
  ],
  es: [
    {
      id: 'salvation',
      title: 'Salvación',
      verse: 'Efesios 2:8-9',
      verseText: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.',
      description: 'Un panorama bíblico completo de la salvación, desde la condición en que nace toda persona, pasando por la justificación, la santificación y la glorificación. Sigue el hilo desde el Génesis hasta el Apocalipsis.',
    },
  ],
}

const emptyLabel: Record<Lang, string> = {
  en: 'Select a diagram to explore',
  es: 'Selecciona un diagrama para explorar',
}

export default function TheWord() {
  const [selected, setSelected] = useState<string | null>(null)
  const { lang } = useLang()

  const currentDiagrams = diagrams[lang]
  const selectedDiagram = currentDiagrams.find(d => d.id === selected)

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100%', gap: '2rem' }}>

      {/* Card List */}
      <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentDiagrams.map(diagram => (
          <div
            key={diagram.id}
            onClick={() => setSelected(diagram.id)}
            style={{
              backgroundColor: selected === diagram.id ? '#1C2B3A' : '#162230',
              border: `1px solid ${selected === diagram.id ? '#C9883A' : '#1C2B3A'}`,
              borderRadius: '8px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <h3 style={{ color: '#F0EDE8', fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              {diagram.title}
            </h3>
            <p style={{ color: '#C9883A', fontSize: '0.75rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
              {diagram.verse}
            </p>
            <p style={{ color: '#8A99A8', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              &ldquo;{diagram.verseText}&rdquo;
            </p>
            <p style={{ color: '#8A99A8', fontSize: '0.8rem', lineHeight: '1.6' }}>
              {diagram.description}
            </p>
          </div>
        ))}
      </div>

      {/* Diagram Pane */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedDiagram ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '80vh',
          }}>
            {selectedDiagram.id === 'salvation' && <SalvationDiagram />}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#8A99A8',
            fontSize: '0.9rem',
            fontStyle: 'italic',
          }}>
            {emptyLabel[lang]}
          </div>
        )}
      </div>

    </div>
  )
}
