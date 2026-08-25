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
      <Link
        href="/start-free"
        aria-label="Start TA-14 free for 60 days"
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 64,
          padding: '10px 16px',
          border: '1px solid rgba(103,222,255,.72)',
          borderRadius: 16,
          background: 'linear-gradient(135deg,rgba(5,35,52,.98),rgba(4,14,24,.98))',
          boxShadow: '0 18px 50px rgba(0,0,0,.42),0 0 32px rgba(74,198,240,.2)',
          color: '#eefaff',
          textDecoration: 'none',
          backdropFilter: 'blur(18px)',
        }}
      >
        <span style={{
          width: 40,
          height: 40,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 11,
          background: 'linear-gradient(135deg,#8aeaff,#62e6ae)',
          color: '#031018',
          fontWeight: 950,
          fontSize: 16,
        }}>60</span>
        <span>
          <small style={{display:'block',color:'#79dfff',fontSize:8,fontWeight:900,letterSpacing:'.14em'}}>NO CREDIT CARD · NO CONTRACT</small>
          <strong style={{display:'block',marginTop:3,fontSize:13,letterSpacing:'.04em'}}>START 60 DAYS FREE →</strong>
          <small style={{display:'block',marginTop:3,color:'#8fa8b8',fontSize:8}}>Then $19 / $49 / $99 monthly if you continue</small>
        </span>
      </Link>
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
