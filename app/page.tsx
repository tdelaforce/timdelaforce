'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import TheWord from './components/TheWord'
import { useLang } from './context/LanguageContext'
import type { Lang } from './context/LanguageContext'

const sections = ['About', 'Career', 'The Word', 'Plating'] as const
type Section = typeof sections[number]

const t: Record<Lang, {
  headline: string
  nav: Record<Section, string>
  about: {
    p1: string
    p2pre: string
    p2post: string
    p3pre: string
    p3post: string
    p4: string
    p5: string
  }
  career: {
    intro: string
    jobs: { title: string; company: string; url: string | null; period: string; description: string }[]
  }
  plating: string
}> = {
  en: {
    headline: 'Hi, my name is Timothy.',
    nav: {
      About: 'About',
      Career: 'Career',
      'The Word': 'The Word',
      Plating: 'Plating',
    },
    about: {
      p1: "I've spent my career in the middle of real operations, not managing them from a distance.",
      p2pre: "Right now I'm the General Manager of",
      p2post: ", where I oversee the full business — sales, production, maintenance, and everything in between.",
      p3pre: "Before that, I acquired",
      p3post: "alongside three equity partners and ran it as its operator. We exited in early 2026.",
      p4: "What I do well is figure out what's actually broken, not just what looks broken. I work from first principles — whether I'm rebuilding a customer outreach process, fixing a production bottleneck, or rethinking how a business presents itself. I've done sales, operations, marketing, and turnaround work.",
      p5: "I'm from South Africa, live in Houston, and I like solving difficult problems.",
    },
    career: {
      intro: "My career started at Hewlett Packard straight out of high school as a web developer. Since then it's moved through operations, co-founding businesses, acquiring them, and running them. The through line is getting into the work directly and figuring out what actually needs to change.",
      jobs: [
        {
          title: 'General Manager',
          company: 'Mirror Industries, a division of H&M Plating Co.',
          url: 'https://hmplating.com/',
          period: '2024 — Present',
          description: 'Mirror Industries is a hard chrome and industrial plating operation. As General Manager I oversee the full business: sales, customer relationships, production, maintenance, and wastewater treatment.',
        },
        {
          title: 'CEO',
          company: 'Mastin Labs',
          url: 'https://mastinlabs.com/',
          period: '2023 — 2026',
          description: 'Mastin Labs made presets and creative tools for photographers. I acquired the business alongside three equity partners and ran it as its operator. Managed everything: people, product, cash, marketing, and bank and shareholder relationships. We exited in early 2026.',
        },
        {
          title: 'Principal',
          company: 'Creator House Operating',
          url: null,
          period: '2021 — 2023',
          description: 'Creator House was a small search fund I co-founded with Mac Scherer to acquire and operate small businesses. We closed our first acquisition in January 2023, which became the Mastin Labs deal. We worked with our own money and private backers, with no artificial time constraints.',
        },
        {
          title: 'Operations Lead',
          company: 'Digital Wildcatters',
          url: 'https://collide.io/community',
          period: '2021 — 2022',
          description: 'Served as the operational right hand to the CEO. Focused on sales processes and video production studio operations.',
        },
        {
          title: 'Co-Founder & COO',
          company: 'Creator House Media',
          url: null,
          period: '2018 — 2021',
          description: 'Co-founded a video production company. Ran operations, finance, and creative direction. The company was acquired by Digital Wildcatters in 2021.',
        },
        {
          title: 'Profitability & IT Infrastructure Manager',
          company: 'Cor-Pro Systems',
          url: 'https://cor-pro.com/',
          period: '2020 — 2021',
          description: 'Oversaw profitability, inventory, purchasing, and IT infrastructure for an industrial coatings business.',
        },
        {
          title: 'Communications & Digital Strategy',
          company: 'The Work Lodge',
          url: 'https://worklodge.com/',
          period: '2016 — 2017',
          description: 'Managed social media, IT infrastructure, and web development for a coworking company in Houston.',
        },
        {
          title: 'Web Developer',
          company: 'Hewlett Packard Enterprise',
          url: 'https://www.hpe.com/us/en/home.html',
          period: '2013 — 2016',
          description: 'Built an internal training suite used across Sales, Marketing, and Call Center departments. Grew active users from under 1,000 to over 3,500. Led R&D on a new development platform and automated QA efforts that cut file parsing times by 50%.',
        },
      ],
    },
    plating: 'This is the Plating section.',
  },
  es: {
    headline: 'Hola, me llamo Timoteo.',
    nav: {
      About: 'Acerca de',
      Career: 'Carrera',
      'The Word': 'La Palabra',
      Plating: 'Chapado',
    },
    about: {
      p1: 'He pasado mi carrera en el centro de las operaciones reales, sin gestionarlas desde la distancia.',
      p2pre: 'Actualmente soy el Gerente General de',
      p2post: ', donde superviso el negocio completo: ventas, producción, mantenimiento y todo lo demás.',
      p3pre: 'Antes de eso, adquirí',
      p3post: 'junto a tres socios y lo dirigí como operador. Salimos a principios de 2026.',
      p4: 'Lo que hago bien es descubrir qué está realmente roto, no solo lo que parece roto. Trabajo desde principios básicos, ya sea reconstruyendo un proceso de contacto con clientes, resolviendo un cuello de botella en producción, o repensando cómo se presenta un negocio. He trabajado en ventas, operaciones, marketing y reestructuración de empresas.',
      p5: 'Soy de Sudáfrica, vivo en Houston y me gusta resolver problemas difíciles.',
    },
    career: {
      intro: 'Mi carrera comenzó en Hewlett Packard, directo desde la secundaria, como desarrollador web. Desde entonces ha pasado por operaciones, cofundación de empresas, adquisición y dirección de las mismas. El hilo conductor es involucrarme directamente en el trabajo y determinar qué es lo que realmente necesita cambiar.',
      jobs: [
        {
          title: 'Gerente General',
          company: 'Mirror Industries, a division of H&M Plating Co.',
          url: 'https://hmplating.com/',
          period: '2024 — Presente',
          description: 'Mirror Industries es una operación de cromado duro y chapado industrial. Como Gerente General superviso el negocio completo: ventas, relaciones con clientes, producción, mantenimiento y tratamiento de aguas residuales.',
        },
        {
          title: 'CEO',
          company: 'Mastin Labs',
          url: 'https://mastinlabs.com/',
          period: '2023 — 2026',
          description: 'Mastin Labs creaba presets y herramientas creativas para fotógrafos. Adquirí el negocio junto a tres socios y lo dirigí como operador. Gestioné todo: personas, producto, caja, marketing y relaciones bancarias y con accionistas. Salimos a principios de 2026.',
        },
        {
          title: 'Director',
          company: 'Creator House Operating',
          url: null,
          period: '2021 — 2023',
          description: 'Creator House fue un pequeño search fund que cofundé con Mac Scherer para adquirir y operar pequeñas empresas. Cerramos nuestra primera adquisición en enero de 2023, que se convirtió en el acuerdo de Mastin Labs. Trabajamos con nuestro propio dinero y patrocinadores privados, sin restricciones de tiempo artificiales.',
        },
        {
          title: 'Líder de Operaciones',
          company: 'Digital Wildcatters',
          url: 'https://collide.io/community',
          period: '2021 — 2022',
          description: 'Serví como mano derecha operativa del CEO. Me enfoqué en procesos de ventas y operaciones del estudio de producción de video.',
        },
        {
          title: 'Cofundador y COO',
          company: 'Creator House Media',
          url: null,
          period: '2018 — 2021',
          description: 'Cofundé una empresa de producción de video. Dirigí operaciones, finanzas y dirección creativa. La empresa fue adquirida por Digital Wildcatters en 2021.',
        },
        {
          title: 'Gerente de Rentabilidad e Infraestructura de TI',
          company: 'Cor-Pro Systems',
          url: 'https://cor-pro.com/',
          period: '2020 — 2021',
          description: 'Supervisé rentabilidad, inventario, compras e infraestructura de TI para un negocio de recubrimientos industriales.',
        },
        {
          title: 'Comunicaciones y Estrategia Digital',
          company: 'The Work Lodge',
          url: 'https://worklodge.com/',
          period: '2016 — 2017',
          description: 'Gestioné redes sociales, infraestructura de TI y desarrollo web para una empresa de coworking en Houston.',
        },
        {
          title: 'Desarrollador Web',
          company: 'Hewlett Packard Enterprise',
          url: 'https://www.hpe.com/us/en/home.html',
          period: '2013 — 2016',
          description: 'Construí una suite de capacitación interna utilizada en los departamentos de Ventas, Marketing y Centro de Llamadas. Aumenté los usuarios activos de menos de 1,000 a más de 3,500. Lideré la I+D de una nueva plataforma de desarrollo y automaticé esfuerzos de QA que redujeron los tiempos de análisis de archivos en un 50%.',
        },
      ],
    },
    plating: 'Esta es la sección de Chapado.',
  },
}

export default function Home() {
  const [active, setActive] = useState<Section | null>(null)
  const { lang } = useLang()
  const tx = t[lang]

  const placeholderContent: Record<Section, React.ReactNode> = {
    About: (
      <div>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
          {tx.about.p1}
        </p>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
          {tx.about.p2pre}{' '}
          <a href="https://hmplating.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9883A', textDecoration: 'none' }}>
            Mirror Industries, a division of H&M Plating Co.
          </a>
          {tx.about.p2post}
        </p>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
          {tx.about.p3pre}{' '}
          <a href="https://mastinlabs.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9883A', textDecoration: 'none' }}>
            Mastin Labs
          </a>{' '}
          {tx.about.p3post}
        </p>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
          {tx.about.p4}
        </p>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem' }}>
          {tx.about.p5}
        </p>
      </div>
    ),
    Career: (
      <div>
        <p style={{ color: '#8A99A8', lineHeight: '1.8', fontSize: '1rem', marginBottom: '2.5rem' }}>
          {tx.career.intro}
        </p>
        {tx.career.jobs.map((job) => (
          <div key={job.title + job.company} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1C2B3A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
              <span style={{ color: '#F0EDE8', fontSize: '1rem', fontWeight: '500' }}>{job.title}</span>
              <span style={{ color: '#8A99A8', fontSize: '0.85rem' }}>{job.period}</span>
            </div>
            {job.url ? (
              <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: '#C9883A', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                {job.company}
              </a>
            ) : (
              <span style={{ color: '#C9883A', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>{job.company}</span>
            )}
            <p style={{ color: '#8A99A8', fontSize: '0.95rem', lineHeight: '1.7' }}>{job.description}</p>
          </div>
        ))}
      </div>
    ),
    'The Word': <TheWord />,
    Plating: tx.plating,
  }

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
            <h1 style={styles.headline}>{tx.headline}</h1>
            <div style={styles.buttonGroup}>
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActive(section)}
                  style={styles.button}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C9883A')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {tx.nav[section]}
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
                  {tx.nav[section]}
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
                <h2 style={styles.contentHeadline}>{tx.nav[active]}</h2>
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
