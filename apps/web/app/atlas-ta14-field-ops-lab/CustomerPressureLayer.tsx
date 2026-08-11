"use client";
import {useEffect,useMemo,useState} from "react";

type Challenge={q:string;answers:string[];correct:number;why:string};
type StepBank=Record<number,Challenge[]>;

const STEP_CHALLENGES:StepBank={
 1:[
  {q:"So what are you going to do first?",answers:["Start checking refrigerant pressures.","I’m going to establish what the system is doing now, document the condition, and work through it in order.","Tell you what needs replacing.","Open everything up and see what looks bad."],correct:1,why:"Set expectations without diagnosing or selling before evidence exists."},
  {q:"The last company said it needs refrigerant. Do you think they’re right?",answers:["Probably.","No, they were wrong.","I can’t fairly confirm that yet. I need to establish today’s system condition first.","I’ll know once I put gauges on it."],correct:2,why:"Do not inherit another person’s conclusion or jump straight to refrigerant contact."},
 ],
 2:[
  {q:"Is my filter too dirty, or is that normal?",answers:["Yes, that filter is definitely the whole problem.","It has visible loading. I’ll document it and evaluate how it relates to airflow before I call it the cause.","No, filters never affect much.","You need the most expensive filter available."],correct:1,why:"Describe observable condition without turning one observation into the whole diagnosis."},
  {q:"Can I pull the filter out while you’re checking it?",answers:["Sure, go ahead.","Please leave it in place for the moment so I can document the condition before anything changes.","Throw it away now.","Only if you buy a new one from me."],correct:1,why:"Preserve the baseline before altering the system condition."},
 ],
 3:[
  {q:"What’s that wheel thing in there?",answers:["That’s the compressor.","That’s part of the indoor blower assembly. It moves air through the system, and its condition matters to airflow.","That controls refrigerant pressure.","It doesn’t really matter."],correct:1,why:"Educate clearly and accurately without overselling the observation."},
  {q:"Is that dirt on the blower why my house isn’t cooling?",answers:["Absolutely. That is definitely the cause.","It may affect airflow, but I still need the rest of the measurements before I can say what the supported determination is.","No, blower condition never matters.","You need a new system."],correct:1,why:"Explain relevance while preserving diagnostic discipline."},
 ],
 4:[
  {q:"What’s that wire for? Can I move it so you can see better?",answers:["Sure, just move it carefully.","Please don’t touch any electrical wires or components. Stay back while I verify the electrical condition safely.","It’s only low voltage, so it’s fine.","Go ahead if the unit isn’t running."],correct:1,why:"Protect the homeowner from energized or potentially energized components."},
  {q:"Is the power off now? Can I come closer?",answers:["Yes, the switch is off so everything is safe.","Please stay clear until I personally verify the electrical state. A switch position alone is not proof of absence of voltage.","Come closer, but don’t touch anything.","It should be safe enough."],correct:1,why:"Verification, not assumption, governs electrical safety."},
 ],
 5:[
  {q:"So the thermostat could be causing all this?",answers:["Yes, definitely.","It’s one part of the control sequence I’m verifying. I don’t want to call it the cause until the rest of the evidence supports that.","Thermostats almost never fail.","You should replace it anyway."],correct:1,why:"Keep the customer informed without converting a test point into a determination."},
  {q:"Can I change the thermostat while you’re checking?",answers:["Sure.","Please leave the setting where it is for now so the operating condition stays consistent while I test it.","Turn it way down so the system works harder.","Cycle it on and off a few times."],correct:1,why:"Protect continuity of the operating condition during testing."},
 ],
 6:[
  {q:"That stuff on the coil—is that mold?",answers:["Yes, that’s mold.","It looks dangerous.","I can document what I see and explain the HVAC condition, but I should not identify mold unless I’m qualified to make that determination.","No, coils cannot have microbial growth."],correct:2,why:"Stay inside qualification and claim boundaries."},
  {q:"Can I touch that part of the coil to see how dirty it is?",answers:["Yes, just be careful.","Please don’t reach into the equipment. Let me document and inspect it safely.","Only touch the copper part.","It’s fine if the thermostat is off."],correct:1,why:"The homeowner should not be exposed to sharp, electrical, mechanical, or contaminated equipment surfaces."},
 ],
 7:[
  {q:"Are you ready to tell me what’s wrong now?",answers:["Yes, I already knew a while ago.","I’m finishing the indoor evidence package now. I’ll explain what the measurements support before we move to the outdoor equipment.","It’s low on refrigerant.","We should talk replacement first."],correct:1,why:"Close the indoor sequence before moving downstream."},
 ],
 8:[
  {q:"Why did we have to do all that inside before coming out here?",answers:["We didn’t really have to.","Because the outdoor equipment only makes sense in the context of the indoor airflow, temperatures, controls, and operating condition we already established.","It’s just company policy.","So I can charge more diagnostic time."],correct:1,why:"Teach the homeowner why sequence matters."},
 ],
 9:[
  {q:"This outdoor coil looks dirty. Does that mean I’m low on refrigerant?",answers:["Yes, usually.","No. Coil condition affects heat rejection, so I need trustworthy airflow before refrigerant behavior can be interpreted correctly.","Probably both.","We can add refrigerant and clean it later."],correct:1,why:"Do not interpret charge under compromised condenser airflow."},
 ],
 10:[
  {q:"Can I stand right here and watch you check the capacitor?",answers:["Sure, come closer.","You can watch from a safe distance, but please stay clear of the electrical compartment while I’m testing it.","Touch the cabinet so you can feel if it’s energized.","It’s safe once I pull the disconnect."],correct:1,why:"Keep the homeowner engaged without compromising electrical safety."},
 ],
 11:[
  {q:"Those amp numbers look high. Does that mean the compressor is bad?",answers:["Yes, high amps always mean a bad compressor.","They’re one piece of evidence. I need to compare them with operating conditions and the equipment information before I make that determination.","No, amps never matter.","We should replace it now just in case."],correct:1,why:"Operating measurements require context before diagnosis."},
 ],
 12:[
  {q:"Why are you cleaning that before checking the refrigerant?",answers:["Because I always clean every unit.","Because heat rejection has to be in a trustworthy condition before refrigerant measurements can be interpreted responsibly.","It makes the gauges read lower.","It’s optional, but I like doing it first."],correct:1,why:"Restore governing operating conditions before downstream interpretation."},
 ],
 13:[
  {q:"Now can you tell if it needs refrigerant?",answers:["Yes, any low pressure means add refrigerant.","Now I can evaluate refrigerant-side evidence in the context of the airflow, temperatures, equipment identity, and metering information we already established.","I knew from the beginning.","We should add some first and see what happens."],correct:1,why:"Refrigerant interpretation is earned by the prior evidence chain."},
  {q:"Can I hold the hose while you connect it?",answers:["Sure.","No, please stay clear of the refrigerant service area. I’ll handle the equipment and connections safely.","Only the blue hose is safe to touch.","Yes, as long as you wear gloves."],correct:1,why:"Keep the homeowner away from refrigerant service connections and pressurized equipment."},
 ],
 14:[
  {q:"So what did you actually change compared with when you arrived?",answers:["Everything should be fine now.","Let me show you the before-and-after record so you can see what changed, what was verified, and what remains unchanged.","You don’t need the details.","The important thing is that the system is running."],correct:1,why:"Close with a post-intervention record, not reassurance alone."},
  {q:"Is there anything I should touch or adjust after you leave?",answers:["Open panels if you hear a noise.","Use the normal homeowner controls we discussed, but don’t enter electrical, refrigerant, or internal equipment areas. Call for service if something changes.","Adjust the refrigerant valves if it gets warm.","Reset breakers repeatedly if it stops."],correct:1,why:"Leave the homeowner with a safe operating boundary."},
 ],
};

const POS=[{l:"5%",t:"18%"},{l:"58%",t:"16%"},{l:"7%",t:"56%"},{l:"55%",t:"54%"},{l:"31%",t:"8%"},{l:"32%",t:"65%"}];

function readCurrentStep(){const text=document.querySelector<HTMLElement>(".eyebrow")?.innerText||"";const m=text.match(/FIELD NODE\s+(\d+)/i);return m?Number(m[1]):1}

export default function CustomerPressureLayer(){const[ch,setCh]=useState<Challenge|null>(null),[time,setTime]=useState(0),[comm,setComm]=useState(1000),[feedback,setFeedback]=useState(""),[pos,setPos]=useState(POS[0]),[step,setStep]=useState(1);
 useEffect(()=>{const id=window.setInterval(()=>setStep(readCurrentStep()),350);setStep(readCurrentStep());return()=>clearInterval(id)},[]);
 const bank=useMemo(()=>STEP_CHALLENGES[step]||STEP_CHALLENGES[1],[step]);
 useEffect(()=>{let next:number|undefined;const schedule=(first=false)=>{next=window.setTimeout(()=>{setPos(POS[Math.floor(Math.random()*POS.length)]);setCh(bank[Math.floor(Math.random()*bank.length)]);setTime(8);setFeedback("")},first?4200:11000+Math.random()*7000)};schedule(true);const listener=()=>schedule(false);window.addEventListener("ta14-customer-next",listener);return()=>{if(next)clearTimeout(next);window.removeEventListener("ta14-customer-next",listener)}},[bank]);
 useEffect(()=>{if(!ch)return;const id=window.setInterval(()=>setTime(s=>{if(s<=1){clearInterval(id);setComm(v=>Math.max(0,v-125));setFeedback("MISSED HOMEOWNER RESPONSE • -125");setTimeout(()=>{setCh(null);setFeedback("");window.dispatchEvent(new Event("ta14-customer-next"))},850);return 0}return s-1}),1000);return()=>clearInterval(id)},[ch]);
 function answer(i:number){if(!ch)return;const ok=i===ch.correct;setComm(v=>Math.max(0,v+(ok?175:-125)));setFeedback(ok?`PROFESSIONAL RESPONSE • +175 — ${ch.why}`:`COMMUNICATION / SEQUENCE ERROR • -125 — ${ch.why}`);setTimeout(()=>{setCh(null);setFeedback("");window.dispatchEvent(new Event("ta14-customer-next"))},1200)}
 return <><div className="commScore"><small>HOMEOWNER CARE</small><b>{comm}</b></div>{ch&&<section className="customerChallenge" style={{left:pos.l,top:pos.t}}><div className="customerFace">👤</div><div className="customerBody"><div className="customerMeta"><span>HOMEOWNER // STEP {String(step).padStart(2,"0")} INTERRUPT</span><b>{time}s</b></div><h3>“{ch.q}”</h3><div className="customerAnswers">{ch.answers.map((a,i)=><button key={a} onClick={()=>answer(i)}>{a}</button>)}</div><small>Answer the question that belongs to this moment. Keep the homeowner informed, safe, and inside the service boundary.</small></div></section>}{feedback&&<div className="commFeedback">{feedback}</div>}<style jsx global>{`
.commScore{position:fixed;z-index:140;right:24px;top:105px;padding:9px 12px;border:1px solid #6ee6ff66;border-radius:12px;background:#06111cf0;box-shadow:0 0 28px #4adfff22}.commScore small{display:block;color:#6f8b9a;font-size:7px;letter-spacing:.15em}.commScore b{color:#7affb5;font:900 15px ui-monospace}.customerChallenge{position:fixed;z-index:200;width:min(540px,calc(100vw - 30px));display:flex;gap:12px;padding:14px;border:1px solid #73e7ff99;border-radius:18px;background:linear-gradient(145deg,#071625fa,#0a1018f7);box-shadow:0 22px 70px #000c,0 0 42px #49dfff30;backdrop-filter:blur(18px);animation:customerIn .24s ease-out}.customerFace{width:54px;height:54px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,#dbefff,#78a7bd 52%,#213746 70%);font-size:28px;box-shadow:0 0 24px #6deaff33}.customerBody{flex:1}.customerMeta{display:flex;justify-content:space-between;gap:10px;align-items:center}.customerMeta span{color:#63eaff;font-size:8px;font-weight:1000;letter-spacing:.14em}.customerMeta b{color:#7affb5;font:900 18px ui-monospace;text-shadow:0 0 12px #62ff9c88}.customerChallenge h3{margin:7px 0 10px;font:700 19px Georgia,serif;color:#f5fbff}.customerAnswers{display:grid;grid-template-columns:1fr 1fr;gap:7px}.customerAnswers button{min-height:50px;padding:9px;border:1px solid #2a596b;background:#07121c;color:#d8eaf1;text-align:left;border-radius:9px;font-size:10px;line-height:1.35;cursor:pointer}.customerAnswers button:hover{border-color:#6effb1;background:#0a2a20;color:#fff}.customerChallenge small{display:block;margin-top:8px;color:#7c98a6;font-size:8px;line-height:1.4}.commFeedback{position:fixed;z-index:220;left:50%;top:20%;transform:translateX(-50%);max-width:760px;padding:13px 18px;border:1px solid #6effb1;border-radius:999px;background:#071712f5;color:#caffdd;font-size:10px;font-weight:1000;box-shadow:0 0 36px #58ff9f33}@keyframes customerIn{from{opacity:0;transform:scale(.88) translateY(18px)}to{opacity:1;transform:none}}@media(max-width:720px){.customerChallenge{left:15px!important;top:auto!important;bottom:18px}.customerAnswers{grid-template-columns:1fr}.commScore{display:none}}
`}</style></>}
