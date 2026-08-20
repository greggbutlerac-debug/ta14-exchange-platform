"use client";

import Link from "next/link";

export default function FieldOpsInstitutionNav() {
  return (
    <nav className="fieldOpsInstitutionNav" aria-label="TA-14 institutional navigation">
      <Link href="/academy" className="fieldOpsNavAcademy">
        <span>RETURN TO</span>
        <strong>TA-14 ACADEMY</strong>
      </Link>
      <Link href="/" className="fieldOpsNavExchange">
        <span>OPEN</span>
        <strong>TA-14 EXCHANGE</strong>
      </Link>
      <style>{`
        .fieldOpsInstitutionNav{
          position:fixed;
          top:14px;
          right:18px;
          z-index:120;
          display:flex;
          align-items:stretch;
          gap:8px;
          font-family:Inter,ui-sans-serif,system-ui,sans-serif;
        }
        .fieldOpsInstitutionNav a{
          min-width:142px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:8px 12px;
          border-radius:11px;
          text-decoration:none;
          backdrop-filter:blur(18px);
          box-shadow:0 12px 38px rgba(0,0,0,.32);
          transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
        }
        .fieldOpsInstitutionNav a:hover,
        .fieldOpsInstitutionNav a:focus-visible{
          transform:translateY(-2px);
          outline:none;
        }
        .fieldOpsInstitutionNav span{
          display:block;
          margin-bottom:2px;
          font-size:7px;
          font-weight:950;
          letter-spacing:.15em;
          opacity:.72;
        }
        .fieldOpsInstitutionNav strong{
          display:block;
          font-size:10px;
          font-weight:1000;
          letter-spacing:.07em;
          white-space:nowrap;
        }
        .fieldOpsNavAcademy{
          color:#bdf8ff;
          border:1px solid rgba(84,232,255,.42);
          background:linear-gradient(145deg,rgba(7,34,48,.94),rgba(3,15,25,.94));
        }
        .fieldOpsNavAcademy:hover,.fieldOpsNavAcademy:focus-visible{
          border-color:rgba(84,232,255,.78);
          box-shadow:0 12px 38px rgba(0,0,0,.32),0 0 28px rgba(84,232,255,.13);
        }
        .fieldOpsNavExchange{
          color:#c9ffdd;
          border:1px solid rgba(57,242,161,.38);
          background:linear-gradient(145deg,rgba(7,40,31,.94),rgba(3,17,18,.94));
        }
        .fieldOpsNavExchange:hover,.fieldOpsNavExchange:focus-visible{
          border-color:rgba(57,242,161,.75);
          box-shadow:0 12px 38px rgba(0,0,0,.32),0 0 28px rgba(57,242,161,.12);
        }
        @media(max-width:760px){
          .fieldOpsInstitutionNav{
            top:auto;
            right:10px;
            bottom:10px;
            left:10px;
            justify-content:center;
          }
          .fieldOpsInstitutionNav a{min-width:0;flex:1;max-width:220px;padding:9px 10px}
          .fieldOpsInstitutionNav strong{font-size:9px}
        }
        @media(prefers-reduced-motion:reduce){.fieldOpsInstitutionNav a{transition:none}}
      `}</style>
    </nav>
  );
}
