'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import AtlasFrontDoor from './atlas-front-door/page';

export default function HomePage() {
  const [worldGrid, setWorldGrid] = useState<Element | null>(null);

  useEffect(() => {
    const grid = document.querySelector('.worldGrid');
    setWorldGrid(grid);

    const heading = document.querySelector('.worldDeck .sectionHeading.compact small');
    if (heading) heading.textContent = 'ONE INSTITUTION · FIVE GOVERNED WORLDS';
  }, []);

  return (
    <>
      <AtlasFrontDoor />

      <section
        aria-label="TA-14 Governance Showcase"
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '0 auto',
          padding: '0 clamp(18px,4vw,54px) 58px',
          maxWidth: 1500,
        }}
      >
        <Link
          href="/governance-showcase"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px,280px) 1fr auto',
            gap: 30,
            alignItems: 'center',
            minHeight: 260,
            padding: '34px clamp(24px,4vw,58px)',
            border: '1px solid rgba(117,209,255,.62)',
            background:
              'radial-gradient(circle at 12% 20%,rgba(54,178,255,.2),transparent 30%),radial-gradient(circle at 84% 18%,rgba(176,121,255,.15),transparent 28%),linear-gradient(135deg,rgba(4,19,35,.99),rgba(4,12,27,.99) 52%,rgba(12,8,30,.99))',
            boxShadow:
              'inset 0 0 90px rgba(48,171,255,.08),0 26px 70px rgba(0,0,0,.38),0 0 48px rgba(74,172,255,.12)',
            color: '#f4fbff',
            textDecoration: 'none',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 132,
                height: 132,
                margin: '0 auto 14px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(120,214,255,.86)',
                background:
                  'radial-gradient(circle at 34% 26%,#ffffff,#91dcff 8%,#205e8c 34%,#07182a 66%,#030812 100%)',
                boxShadow: '0 0 48px rgba(74,190,255,.44),inset 0 0 32px rgba(255,255,255,.08)',
                fontFamily: 'Georgia,serif',
                fontSize: 25,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: '-.04em',
              }}
            >
              AIGR
            </div>
            <small style={{ color: '#83d6ff', letterSpacing: '.18em', fontWeight: 900 }}>
              PUBLIC INSTITUTIONAL RECORD
            </small>
          </div>

          <div>
            <small style={{ color: '#8fdcff', letterSpacing: '.18em', fontWeight: 900 }}>
              REGISTERED GOVERNANCES · FOUNDING DEMONSTRATIONS · EVIDENCE · CHRONOLOGY
            </small>
            <h2
              style={{
                margin: '10px 0 12px',
                fontFamily: 'Georgia,serif',
                fontSize: 'clamp(36px,4vw,64px)',
                lineHeight: .94,
                color: '#f5fbff',
              }}
            >
              GOVERNANCE SHOWCASE
            </h2>
            <p style={{ margin: 0, maxWidth: 820, color: '#bdcfe1', lineHeight: 1.7, fontSize: 14 }}>
              Explore governance architectures as living institutional records. See permanent Registry identity,
              declared boundaries, demonstrations, governed artifacts, evidence, architecture relationships,
              version progression, and public chronology as each governance builds a record over time.
            </p>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 20 }}>
              {[
                'REGISTERED IDENTITY',
                'FOUNDING DEMONSTRATIONS',
                'GOVERNED ARTIFACTS',
                'EVIDENCE',
                'VERSION HISTORY',
                'PUBLIC CHRONOLOGY',
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    padding: '7px 9px',
                    border: '1px solid rgba(115,207,255,.22)',
                    color: '#9ddcff',
                    fontSize: 7,
                    letterSpacing: '.1em',
                    fontWeight: 900,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <strong
            style={{
              minWidth: 220,
              padding: '20px 22px',
              border: '1px solid rgba(123,216,255,.76)',
              background: 'linear-gradient(180deg,rgba(33,147,204,.3),rgba(3,16,30,.96))',
              color: '#e2f7ff',
              textAlign: 'center',
              fontSize: 10,
              letterSpacing: '.13em',
              boxShadow: '0 0 30px rgba(63,180,238,.12)',
            }}
          >
            EXPLORE THE GOVERNANCE SHOWCASE →
          </strong>
        </Link>
      </section>

      {worldGrid
        ? createPortal(
            <Link
              href="/eu-ai-act"
              className="euFlagshipWorld"
              aria-label="Enter EU AI Act World"
              style={{
                gridColumn: '1 / -1',
                minHeight: 350,
                marginTop: 44,
                padding: '48px clamp(24px,5vw,72px)',
                border: '1px solid rgba(105,158,255,.78)',
                background:
                  'radial-gradient(circle at 50% 0%,rgba(47,93,184,.38),transparent 44%),linear-gradient(135deg,rgba(5,18,42,.99),rgba(8,24,55,.97) 52%,rgba(4,12,29,.99))',
                boxShadow:
                  'inset 0 0 80px rgba(69,126,255,.14),0 28px 80px rgba(0,0,0,.38),0 0 44px rgba(69,126,255,.19)',
                color: '#eef5ff',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'visible',
                display: 'grid',
                gridTemplateColumns: 'minmax(120px,220px) 1fr auto',
                gap: 32,
                alignItems: 'center',
              }}
            >
              <div className="euFlagshipBridge" aria-hidden="true"><span>INSTITUTIONAL WORLDS 01–04</span><i/><b>FLAGSHIP COMMERCIAL GOVERNANCE WORLD</b></div>
              <div style={{ textAlign: 'center' }}>
                <div className="euFlagshipOrb" style={{
                    width: 126,
                    height: 126,
                    margin: '0 auto 14px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid rgba(130,177,255,.88)',
                    background:'radial-gradient(circle at 34% 26%,#fff,#76a8ff 8%,#173c82 42%,#030a18 76%)',
                    boxShadow: '0 0 44px rgba(86,142,255,.62)',
                    fontFamily: 'Georgia,serif',
                    fontSize: 36,
                    fontWeight: 900,
                  }}>EU</div>
                <small style={{ color: '#8dbbff', letterSpacing: '.16em', fontWeight: 900 }}>GOVERNED WORLD 05</small>
              </div>

              <div>
                <small style={{ color: '#8dbbff', letterSpacing: '.18em', fontWeight: 900 }}>LAW · REGULATION · EVIDENCE · READINESS</small>
                <h2 style={{margin: '10px 0 12px',fontFamily: 'Georgia,serif',fontSize: 'clamp(34px,4vw,58px)',lineHeight: .95,color: '#f4f8ff'}}>EU AI ACT WORLD</h2>
                <p style={{ margin: 0, maxWidth: 760, color: '#b9c9df', lineHeight: 1.65, fontSize: 13 }}>
                  Enter the governed law world through the EU AI Act. Classify systems, map applicable requirements,
                  build evidence, preserve readiness and obligations, then move into the Law Library, current law,
                  proposed law, Academy pathways, regulatory analysis, and future jurisdictional instruments.
                </p>
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 20 }}>
                  {['EU AI ACT','LAW LIBRARY','CURRENT LAW','PROPOSED LAW','LAW ACADEMY','REGULATORY EVIDENCE'].map(item => (
                    <span key={item} style={{padding: '7px 9px',border: '1px solid rgba(128,170,242,.24)',color: '#a9c8fa',fontSize: 7,letterSpacing: '.1em',fontWeight: 900}}>{item}</span>
                  ))}
                </div>
              </div>

              <strong className="euFlagshipCta" style={{minWidth: 190,padding: '18px 20px',border: '1px solid rgba(126,172,255,.72)',background: 'linear-gradient(180deg,rgba(62,111,205,.32),rgba(5,15,34,.94))',color: '#dbe8ff',textAlign: 'center',fontSize: 10,letterSpacing: '.12em'}}>
                ENTER EU AI ACT WORLD →
              </strong>
            </Link>,
            worldGrid,
          )
        : null}
    </>
  );
}
