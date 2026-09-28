const eras = [
  ["1989","CONNECTED BUILDING WORK BEGINS","Anto begins leading development and promotion of building connectivity and integration technologies."],
  ["1991","THE CdC ENGINE","His first product becomes a PC-based building integration platform and graphical interface, deployed through integrators and OEMs in Europe and the UK."],
  ["1990s–2000s","OPEN SYSTEMS + INTERNET PROTOCOLS","The building-controls conversation expands from isolated automation toward open networking, IP, web technologies and interoperable systems."],
  ["2000s","BUILCONN + CLASMA","Industry events and communities create a meeting place for the people pushing building automation, IT convergence, connectivity and open systems forward."],
  ["2010s","SMART GRID + IoT","The connectivity problem expands beyond the building as energy, cloud services, devices and Internet-scale systems begin to converge."],
  ["2020","MONDAY LIVE!","A weekly industry conversation emerges during the pandemic and continues as an open forum for the future of smarter buildings."],
  ["2020s","PADI.IO + C4SB / IBB","The work turns toward scalable interoperability, cloud-native systems, shared context and industry frameworks for smarter buildings."],
  ["NOW","CNS / CP + CONNECTION PROFILES","Anto and collaborators make the relationship itself explicit: provider, consumer, context and the reusable contract that describes a connection."]
];

const principles = [
  ["01","CONNECT BEFORE YOU CENTRALIZE","Independent systems do not need to become one monolith in order to work together."],
  ["02","MAKE RELATIONSHIPS EXPLICIT","Interoperability improves when the relationship between provider and consumer can be named, inspected and understood."],
  ["03","CONTEXT MATTERS","Moving bytes is not enough. Systems need enough shared meaning to understand what the information represents."],
  ["04","REUSE THE PATTERN","A repeatable connection model can replace endless one-off integration work."],
  ["05","KEEP SYSTEMS INDEPENDENT","Useful interoperability should allow systems to retain their own purpose, stewardship and boundaries."],
  ["06","BUILD THE COMMUNITY TOO","Technical change happens through people: publications, events, working groups, open conversations and repeated field experimentation."]
];

const work = [
  ["PADI.IO","A platform and continuing interoperability effort aimed at helping people manage the growing number of smart devices, systems and cloud services used in commercial buildings.","https://www.home.padi.io/"],
  ["CNS / CONNECTION PROFILES","A mechanism co-developed with Ian Wade for describing reusable relationships between providers and consumers so connections can be explicit rather than buried in custom integration.","https://www.home.padi.io/"],
  ["MONDAY LIVE!","A weekly open industry conversation bringing practitioners together around smarter buildings, interoperability, AI, data, operations and the future of the built environment.","https://www.mondaylive.org/"],
  ["AUTOMATEDBUILDINGS.COM","A long-running public writing and discussion surface where Anto has explored open systems, cloud-native buildings, interoperability, context and the changing architecture of connected buildings.","https://www.automatedbuildings.com/author/anto/"],
  ["C4SB / IBB PROJECT","Industry collaboration focused on the practices, frameworks and technical foundations needed for smarter, more interoperable buildings.","https://www.home.padi.io/"],
  ["BUILDING → CLOUD → ECOSYSTEM","A career-long progression from connecting equipment inside buildings to connecting independently governed systems, services, people and machines across a much larger digital environment.","https://www.home.padi.io/about"]
];

const sources = [
  ["Padi.io — About Anto + Team","https://www.home.padi.io/about"],
  ["Padi.io — Rethinking Interoperability","https://www.home.padi.io/"],
  ["AutomatedBuildings — Anto Budiardjo","https://www.automatedbuildings.com/author/anto/"],
  ["Monday Live!","https://www.mondaylive.org/"],
  ["The Missing Binding Layer","https://www.automatedbuildings.com/2026/03/the-missing-binding-layer/"]
];

export default function AntoBudiardjoShowroom(){return <main className="page">
<style>{`
*{box-sizing:border-box}.page{margin:0;background:#f2efe7;color:#152229;font-family:Arial,Helvetica,sans-serif}.shell{width:min(1180px,92vw);margin:auto}
.nav{position:sticky;top:0;z-index:20;background:rgba(8,20,27,.97);border-bottom:1px solid #29434d;color:#fff}.nav .shell{height:62px;display:flex;align-items:center;justify-content:space-between}.brand{font-size:11px;font-weight:900;letter-spacing:.13em}.nav a{color:#c9dadd;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.1em;margin-left:18px}.nav a:first-child{color:#7adbd9}
.hero{background:radial-gradient(circle at 82% 18%,#174653 0,transparent 28%),#0b1b22;color:#f7f3ea;padding:82px 0 72px}.heroGrid{display:grid;grid-template-columns:1.08fr .92fr;gap:64px;align-items:center}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.17em;color:#69aaa8;margin:0 0 18px}.hero .eyebrow,.dark .eyebrow{color:#79c6c2}.hero h1{font:clamp(56px,7vw,96px)/.9 Georgia,serif;letter-spacing:-.055em;margin:0 0 26px}.hero h1 em{display:block;color:#e0bc69;font-weight:400}.lede{max-width:720px;font:20px/1.62 Georgia,serif;color:#d5e0e1}.statusRow{display:flex;flex-wrap:wrap;gap:8px;margin-top:27px}.statusRow span{padding:8px 10px;border:1px solid #51707a;color:#b9d0d4;font-size:9px;font-weight:900;letter-spacing:.12em}
.profilePortrait{width:100%;height:auto;display:block}.portraitOnly{margin:0;padding:0;background:transparent;border:0;align-self:center}
.section{padding:78px 0}.section h2{font:clamp(40px,5vw,66px)/1.02 Georgia,serif;letter-spacing:-.04em;margin:0 0 22px;max-width:980px}.intro{max-width:900px;font:18px/1.7 Georgia,serif;color:#4e5f64}.dark{background:#132930;color:#f3f5f2}.dark .intro{color:#bdcdd0}
.through{background:#dce8e5;padding:68px 0}.through h2{font:clamp(36px,5vw,60px)/1.08 Georgia,serif;letter-spacing:-.035em;margin:0;max-width:1040px}.through p{max-width:880px;font:18px/1.7 Georgia,serif;color:#40575d}
.timeline{margin-top:44px}.timeline article{display:grid;grid-template-columns:130px 28px 1fr;gap:22px;padding:0 0 34px}.yr{font-weight:950;color:#a37a2a;letter-spacing:.08em}.line{position:relative;border-left:1px solid #7d969b}.line i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e0bc69;left:-5px;top:3px}.timeline h3{font:28px Georgia,serif;margin:0 0 8px}.timeline p{margin:0;color:#526166;line-height:1.65;max-width:780px}
.principles{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#42616a;margin-top:38px}.principles article{background:#132930;padding:28px;min-height:225px}.principles span{color:#e0bc69;font-size:10px;font-weight:900;letter-spacing:.13em}.principles h3{font:24px/1.15 Georgia,serif;margin:16px 0}.principles p{font-size:13px;line-height:1.7;color:#bacacc}
.work{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:38px}.work a{display:block;background:#fff;border:1px solid #d7d2c6;padding:28px;text-decoration:none;color:#18323a}.work a:hover{border-color:#477e82;transform:translateY(-2px)}.work small{color:#39777a;font-weight:950;letter-spacing:.12em}.work h3{font:28px Georgia,serif;margin:12px 0}.work p{font-size:13px;line-height:1.7;color:#536166}.work strong{font-size:10px;letter-spacing:.1em;color:#9a7429}
.quote{background:#0b1b22;color:#fff;padding:76px 0}.quote blockquote{margin:0;max-width:1040px;font:clamp(36px,5vw,62px)/1.08 Georgia,serif;letter-spacing:-.035em}.quote blockquote em{color:#e0bc69}.quote p{max-width:820px;color:#b8cacc;line-height:1.7;margin-top:26px}
.arcLine{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:34px}.arcLine b{padding:12px 14px;border:1px solid #617d84;font-size:10px;letter-spacing:.1em}.arcLine i{color:#e0bc69;font-style:normal}
.sources{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:34px}.sources a{display:block;padding:20px;background:#fff;border:1px solid #d7d2c6;color:#18323a;text-decoration:none;font-size:12px;font-weight:850}.sources a:hover{border-color:#477e82}.footer{background:#08151b;color:#8ca0a5;padding:36px 0;font-size:10px;letter-spacing:.09em;line-height:1.7}
@media(max-width:850px){.heroGrid,.principles,.work,.sources{grid-template-columns:1fr}.heroGrid{gap:34px}.nav .links{display:none}.hero{padding:56px 0}.section{padding:58px 0}}@media(max-width:600px){.timeline article{grid-template-columns:90px 18px 1fr}}
`}</style>

<nav className="nav"><div className="shell"><div className="brand">ANTO BUDIARDJO · PUBLIC PROFILE SHOWROOM</div><div className="links"><a href="/">TA-14 EXCHANGE</a><a href="#story">STORY</a><a href="#work">WORK</a><a href="#record">RECORD</a></div></div></nav>

<header className="hero"><div className="shell heroGrid"><div>
<p className="eyebrow">ANTO BUDIARDJO · PADI.IO · MONDAY LIVE! · CONNECTED BUILDINGS</p>
<h1>Making connectivity <em>explicit.</em></h1>
<p className="lede">Since 1989, Anto Budiardjo has worked on a persistent problem underneath connected buildings: how independently designed technologies can discover one another, exchange useful information and form relationships that people and machines can actually understand. From the CdC Engine to Padi.io, Monday Live! and Connection Profiles, the tools have changed. The through-line has not.</p>
<div className="statusRow"><span>PUBLIC PROFILE</span><span>OPEN FOR CORRECTION</span><span>NO ENDORSEMENT IMPLIED</span></div>
</div><aside className="portraitOnly" aria-label="Anto Budiardjo portrait"><img className="profilePortrait" src="/anto-budiardjo-final.jpg" alt="Anto Budiardjo" /></aside></div></header>

<section className="through"><div className="shell"><p className="eyebrow">THE THROUGH-LINE</p><h2>Buildings keep adding systems. Anto keeps asking how those systems can work together without turning every connection into another custom project.</h2><p>His career tracks the evolution of the connected-building problem itself: PC-based integration, open systems, Internet protocols, smart grids, IoT, cloud services, semantic context and now reusable Connection Profiles.</p></div></section>

<section id="story" className="section"><div className="shell"><p className="eyebrow">THE STORY</p><h2>More than three decades of connected-building work.</h2><p className="intro">Padi.io's public biography dates Anto's work in building connectivity and integration to 1989. The timeline below follows that work as the industry moved from connecting equipment to connecting whole ecosystems.</p><div className="timeline">{eras.map(([y,t,d])=><article key={y}><div className="yr">{y}</div><div className="line"><i/></div><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section>

<section className="section dark"><div className="shell"><p className="eyebrow">THE OPERATING PHILOSOPHY</p><h2>Interoperability is not merely getting the data through.</h2><p className="intro">Across generations of technology, Anto's work keeps returning to the structure around the connection: identity, context, roles, relationships, reuse and the communities required to make open systems practical.</p><div className="principles">{principles.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

<section id="work" className="section"><div className="shell"><p className="eyebrow">SYSTEMS + COMMUNITIES</p><h2>The work is technical — and deeply social.</h2><p className="intro">Anto's public record is not one product. It is a long sequence of platforms, industry conversations, events, collaborations and architectural ideas aimed at making connected buildings easier to understand and easier to connect.</p><div className="work">{work.map(([n,d,u],i)=><a href={u} target="_blank" rel="noreferrer" key={n}><small>{String(i+1).padStart(2,"0")}</small><h3>{n}</h3><p>{d}</p><strong>EXPLORE ↗</strong></a>)}</div></div></section>

<section className="quote"><div className="shell"><p className="eyebrow">THE CURRENT ARC</p><blockquote>The connection itself becomes something that can be <em>named, understood and reused.</em></blockquote><p>That is the progression visible in Anto's current CNS/CP and Connection Profile work: not simply another integration tool, but an attempt to make the relationship between independently designed systems explicit.</p><div className="arcLine"><b>DEVICE</b><i>→</i><b>SYSTEM</b><i>→</i><b>NETWORK</b><i>→</i><b>WEB</b><i>→</i><b>CLOUD</b><i>→</i><b>CONTEXT</b><i>→</i><b>CONNECTION PROFILE</b></div></div></section>

<section className="section"><div className="shell"><p className="eyebrow">PADI.IO + CNS / CP</p><h2>From integrating systems to describing relationships.</h2><p className="intro">Padi.io describes the modern building as an environment filled with devices, applications, analytics, gateways, dashboards and cloud services. Its newer interoperability direction uses Connection Profiles to describe reusable provider-consumer relationships. Anto and longtime collaborator Ian Wade are identified by Padi.io as co-inventors of the CNS/CP mechanism — a continuation of work they began together in 1989.</p></div></section>

<section className="section dark"><div className="shell"><p className="eyebrow">MONDAY LIVE! + THE PUBLIC CONVERSATION</p><h2>The architecture evolves in public.</h2><p className="intro">A defining feature of Anto's career is that the technical work has repeatedly been accompanied by an industry conversation. Monday Live!, AutomatedBuildings.com, C4SB and related collaborations create places where owners, engineers, vendors, integrators and technologists can challenge assumptions and develop the next layer together.</p></div></section>

<section id="record" className="section"><div className="shell"><p className="eyebrow">PUBLIC WORK SURFACE</p><h2>Follow Anto's work through the record.</h2><p className="intro">These sources lead directly to Anto's biography, Padi.io, his public writing and the communities surrounding the work. This showroom is assembled as a public profile and remains open for correction.</p><div className="sources">{sources.map(([n,u])=><a key={u} href={u} target="_blank" rel="noreferrer">{n} ↗</a>)}</div></div></section>

<section className="section"><div className="shell"><p className="eyebrow">ANTO BUDIARDJO</p><h2>The vocabulary changed. The problem kept getting bigger.</h2><p className="intro">From a PC-based building integration engine in the early 1990s to today's cloud-connected systems and Connection Profiles, Anto's work follows one expanding question: how do we make increasingly complex building technologies work together in ways that remain understandable, reusable and useful?</p></div></section>

<footer className="footer"><div className="shell">PUBLIC PROFILE SHOWROOM · ASSEMBLED FROM PUBLIC SOURCES AND DIRECT COLLABORATION RECORDS · OPEN FOR CORRECTION · NO ENDORSEMENT IMPLIED</div></footer>
</main>}