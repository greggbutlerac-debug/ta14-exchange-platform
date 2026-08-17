"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AcademyTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const academyHome = pathname === "/academy";

  return (
    <>
      {academyHome && (
        <section className="academyArcadeLaunch" aria-label="TA-14 Academy HVAC live training">
          <div className="academyArcadeCopy">
            <small>TA-14 ACADEMY // LIVE HVAC TRAINING</small>
            <h2>Learn the route. Run the route. Prove the outcome.</h2>
            <p>
              The TA-14 HVAC training world is live. Learn every 7 In / 7 Out step on its own
              Exchange page, then enter the Field Ops Arcade and prove the complete service sequence.
            </p>
          </div>
          <div className="academyArcadeActions">
            <Link className="academyArcadePrimary" href="/atlas-14-step-field-ops-lab">
              <span>LIVE FIELD OPS ARCADE</span>
              <strong>ENTER THE TA-14 14-STEP / 7 IN, 7 OUT CHALLENGE</strong>
              <i>START ARCADE →</i>
            </Link>
            <Link href="/exchange/hvac/14-step/1">
              <span>STEP-BY-STEP LEARNING</span>
              <strong>LEARN THE 14 STEPS FIRST</strong>
              <i>OPEN STEP 01 →</i>
            </Link>
            <Link href="/academy/hvac">
              <span>HVAC ACADEMY WORLD</span>
              <strong>OPEN THE COMPLETE HVAC ACADEMY</strong>
              <i>ENTER HVAC →</i>
            </Link>
            <Link href="/atlas-608-refrigerant-ops-lab/campaign">
              <span>EPA 608 READINESS</span>
              <strong>ENTER THE REFRIGERANT OPS ARCADE</strong>
              <i>ENTER EPA 608 →</i>
            </Link>
          </div>
        </section>
      )}

      {children}

      {!academyHome && (
        <aside className="academyHvacDoor" aria-label="Open TA-14 Academy HVAC world">
          <Link href="/academy/hvac" aria-label="Open HVAC Academy">
            <span className="academyHvacMark">HVAC</span>
            <span className="academyHvacArrow">→</span>
          </Link>
        </aside>
      )}

      <style>{`
        .academyArcadeLaunch{position:relative;z-index:98;width:min(1500px,calc(100% - 48px));margin:24px auto 0;padding:28px;border:1px solid rgba(84,232,255,.38);border-radius:24px;color:#eefaff;background:radial-gradient(circle at 8% 0,rgba(84,232,255,.14),transparent 34%),radial-gradient(circle at 92% 90%,rgba(57,242,161,.09),transparent 32%),linear-gradient(145deg,rgba(6,22,34,.97),rgba(3,11,19,.97));box-shadow:0 24px 80px rgba(0,0,0,.3);font-family:Inter,ui-sans-serif,system-ui,sans-serif}.academyArcadeCopy small{display:block;color:#5bf0b0;font-size:.65rem;font-weight:950;letter-spacing:.15em}.academyArcadeCopy h2{max-width:1000px;margin:8px 0;color:#fff;font-size:clamp(2rem,4vw,3.6rem);line-height:1;letter-spacing:-.05em}.academyArcadeCopy p{max-width:950px;margin:0;color:#91a9ba;font-size:.9rem;line-height:1.65}.academyArcadeActions{display:grid;grid-template-columns:1.35fr 1fr 1fr 1fr;gap:12px;margin-top:24px}.academyArcadeActions a{min-height:150px;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border:1px solid rgba(57,242,161,.22);border-radius:17px;color:#eefaff;background:rgba(6,25,31,.8);text-decoration:none;transition:170ms ease}.academyArcadeActions a:hover,.academyArcadeActions a:focus-visible{transform:translateY(-3px);border-color:rgba(84,232,255,.55);outline:none}.academyArcadeActions .academyArcadePrimary{border-color:rgba(84,232,255,.62);background:linear-gradient(145deg,rgba(24,119,148,.34),rgba(7,30,43,.9));box-shadow:0 16px 48px rgba(48,214,255,.08)}.academyArcadeActions span{color:#62efb2;font-size:.61rem;font-weight:950;letter-spacing:.12em}.academyArcadePrimary span,.academyArcadePrimary i{color:#58eaff}.academyArcadeActions strong{display:block;margin-top:9px;font-size:1.02rem;line-height:1.2}.academyArcadeActions i{display:block;margin-top:18px;color:#62efb2;font-size:.66rem;font-style:normal;font-weight:950;letter-spacing:.08em}
        .academyHvacDoor{position:fixed;left:18px;top:50%;z-index:96;transform:translateY(-50%)}.academyHvacDoor a{width:76px;min-height:176px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:18px;padding:18px 10px 14px;border:1px solid rgba(61,233,255,.54);border-radius:17px;color:#effcff;background:radial-gradient(circle at 50% 0,rgba(76,255,157,.14),transparent 36%),linear-gradient(180deg,rgba(4,22,34,.97),rgba(3,13,22,.98));box-shadow:0 22px 70px rgba(0,0,0,.5),0 0 32px rgba(47,220,255,.14);text-decoration:none;transition:170ms ease}.academyHvacDoor a:hover{transform:translateX(3px)}.academyHvacMark{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.82rem;font-weight:950;letter-spacing:.2em}.academyHvacArrow{width:36px;height:36px;display:grid;place-items:center;border:1px solid rgba(73,255,155,.54);border-radius:50%;color:#69ffad;background:rgba(13,80,51,.28);font-weight:950}
        @media(max-width:1100px){.academyArcadeActions{grid-template-columns:1fr 1fr}}@media(max-width:720px){.academyArcadeLaunch{width:calc(100% - 24px);padding:20px}.academyArcadeActions{grid-template-columns:1fr}.academyArcadeActions a{min-height:118px}.academyHvacDoor{left:10px;top:auto;bottom:12px;transform:none}.academyHvacDoor a{width:auto;min-height:48px;flex-direction:row;padding:7px 8px 7px 14px}.academyHvacMark{writing-mode:horizontal-tb;transform:none;font-size:.72rem}.academyHvacArrow{width:34px;height:34px}}@media(prefers-reduced-motion:reduce){.academyArcadeActions a,.academyHvacDoor a{transition:none}}
      `}</style>
    </>
  );
}
