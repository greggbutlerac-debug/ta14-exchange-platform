"use client";

import { useMemo, useState } from "react";

const sources = [
  ["ダイキン工業 — 統合報告書2026 公開（2026年9月28日）", "https://www.daikin.com/press/2026/20260928"],
  ["ダイキン工業 — 戦略経営計画 FUSION30", "https://www.daikin.com/investor/management/strategy"],
  ["ダイキン工業 — 経営トップメッセージ", "https://www.daikin.com/corporate/overview/message"],
  ["ダイキンTIC — 技術戦略", "https://www.daikin.com/about/corporate/tic/technology"],
  ["ダイキンTIC — ソリューション事業の推進", "https://www.daikin.com/about/corporate/tic/technology/solution"],
  ["ダイキンTIC — 空気価値の創造", "https://www.daikin.com/about/corporate/tic/technology/air"],
  ["ダイキンTIC — オープンイノベーション", "https://www.daikin.com/about/corporate/tic/innovation"],
  ["ダイキン工業 — COP31 ジャパン・パビリオン発表", "https://www.daikin.com/press/2026/20260910"],
  ["ダイキン工業 — サステナビリティレポート2026", "https://www.daikin.com/sustainability/report"],
];

const chain = ["現実","記録","連続性","許容性","拘束","コミット","実行","結果"];

const signals = [
["01","建物全体","FUSION30では、従来の空調の枠を越え、建物全体の設備課題をライフサイクル全体で解決する方向性が示されています。"],
["02","空気質","公開戦略では、空気質管理、換気、センシング、より高いIAQ価値の創出が示されています。"],
["03","DX＋制御","DXシステム商品、システムレベル制御、BMS、遠隔監視、AI／IoT異常監視などが技術・ソリューションの方向性として示されています。"],
["04","共創","企業、大学、研究機関、スタートアップ等との社外共創を、技術開発を加速する仕組みとして明示しています。"]
];

const scenarios = [
{label:"CO₂上昇", evidence:"信頼できる在室空間のCO₂トレンドが地域の閾値を超えた。", action:"外気導入量を増やす。", authority:"誰が、どの地域ルールに基づき、どの期間この変更を承認できるのか？"},
{label:"センサードリフト", evidence:"センサーは接続されたままだが、連続性記録には未解決のドリフトがある。", action:"その測定値に基づいて換気を変更する。", authority:"接続とデータ取得だけで、この結果に必要な証拠は十分なのか？"},
{label:"遠隔最適化", evidence:"クラウドサービスが複数拠点に省エネ制御変更を提案した。", action:"設定値またはスケジュールを変更する。", authority:"この建物、この範囲、この瞬間に、サービスは実行権限を有しているのか？"},
{label:"冷媒イベント", evidence:"漏えい関連信号が検出され、機器IDと時系列とともに保存された。", action:"隔離、回収、整備、または運転復帰を行う。", authority:"各物理的結果を拘束する証拠、立場、適用権限は何か？"}
];

export default function DaikinIndustriesShowroom() {
  const [scenario,setScenario] = useState(0);
  const [decision,setDecision] = useState<"ALLOW"|"HOLD"|"DENY"|"ESCALATE"|null>(null);
  const current = useMemo(()=>scenarios[scenario], [scenario]);

  return <main className="page" lang="ja">
    <style>{`
      *{box-sizing:border-box}.page{margin:0;background:#f4f6f7;color:#10242d;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",Arial,sans-serif}.en{display:block;margin-top:6px;font:10px/1.5 Arial,sans-serif;letter-spacing:.06em;color:#89a7b4}.shell{width:min(1180px,92vw);margin:auto}
      .nav{position:sticky;top:0;z-index:20;background:rgba(2,21,31,.97);border-bottom:1px solid #17465d;color:#fff}.nav .shell{height:62px;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{font-size:10px;font-weight:950;letter-spacing:.15em}.links{display:flex}.nav a{color:#b8d8e6;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.12em;margin-left:18px}.nav a:first-child{color:#5bd4ff}
      .hero{background:radial-gradient(circle at 82% 16%,#07547a 0,transparent 28%),linear-gradient(135deg,#021923,#053247 58%,#06212e);color:#fff;padding:86px 0 72px}.heroGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:54px;align-items:center}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.17em;color:#58d6ff;margin:0 0 17px}.jp{color:#b8d9e5;font-size:11px;font-weight:800;letter-spacing:.12em}.hero h1{font:clamp(58px,8vw,104px)/.88 Georgia,serif;letter-spacing:-.06em;margin:14px 0 27px}.hero h1 em{display:block;color:#91e3ff;font-weight:400}.lede{max-width:760px;font:20px/1.6 Georgia,serif;color:#d7e8ee}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:26px}.status span{padding:8px 10px;border:1px solid #4f7a8c;font-size:9px;font-weight:900;letter-spacing:.11em;color:#d8edf5}.today{border:1px solid #38718a;background:#061c27;padding:27px;box-shadow:0 20px 60px rgba(0,0,0,.25)}.today small{color:#69d8ff;font-size:9px;font-weight:950;letter-spacing:.15em}.today h2{font:34px/1.05 Georgia,serif;margin:14px 0}.today p{color:#b9d0d9;font-size:13px;line-height:1.7}.today strong{display:block;color:#fff;margin-top:17px;font-size:13px}
      .section{padding:78px 0}.section h2{font:clamp(40px,5vw,68px)/1.02 Georgia,serif;letter-spacing:-.045em;margin:0 0 22px;max-width:960px}.intro{max-width:900px;font:18px/1.7 Georgia,serif;color:#50636b}.signals{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:38px}.signal{background:#fff;border:1px solid #d6e1e5;border-top:4px solid #0b769c;padding:25px;min-height:280px}.signal small{color:#0b769c;font-size:9px;font-weight:950;letter-spacing:.13em}.signal h3{font:26px/1.1 Georgia,serif;margin:14px 0}.signal p{color:#586970;font-size:13px;line-height:1.7}
      .dark{background:#071b24;color:#f5fbfd}.dark .intro{color:#b6cbd3}.seam{display:grid;grid-template-columns:1fr 72px 1fr;gap:14px;align-items:stretch;margin-top:38px}.panel{padding:30px;border:1px solid #265063;background:#0b2632}.panel small{font-size:9px;font-weight:950;letter-spacing:.13em;color:#63d8ff}.panel h3{font:30px Georgia,serif;margin:12px 0}.panel p{font-size:13px;line-height:1.7;color:#bfd0d6}.arrow{display:flex;align-items:center;justify-content:center;font-size:34px;color:#71dcff}.rule{margin-top:24px;padding:26px;border-left:5px solid #64d9ff;background:#0f3140;font:18px/1.6 Georgia,serif}.rule strong{color:#fff}
      .chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin-top:34px}.chain span{padding:15px 8px;text-align:center;background:#fff;border:1px solid #d6e1e5;font-size:10px;font-weight:900}.chain span:nth-child(6){border-color:#0b769c;box-shadow:inset 0 -4px #0b769c}
      .exam{margin-top:36px;border:1px solid #c7d8df;background:#fff;padding:30px}.scenarioTabs{display:flex;flex-wrap:wrap;gap:8px}.scenarioTabs button,.actions button{cursor:pointer;border:1px solid #a8c0ca;background:#fff;color:#17313b;padding:11px 14px;font-size:9px;font-weight:950;letter-spacing:.1em}.scenarioTabs button.on{background:#062837;color:#fff;border-color:#062837}.examGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px}.examCard{padding:22px;background:#edf4f6;border-left:4px solid #0b769c}.examCard small{font-size:9px;font-weight:950;letter-spacing:.12em;color:#0b769c}.examCard h3{font:28px Georgia,serif;margin:10px 0}.examCard p{font-size:13px;line-height:1.7;color:#53666d}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:19px}.actions button.on{background:#062837;color:#fff;border-color:#062837}.receipt{margin-top:15px;background:#061d28;color:#c7dce4;padding:20px;border-left:5px solid #62d8ff;font-size:13px;line-height:1.65}.receipt strong{color:#fff}
      .todayBand{background:#dff4fb;padding:70px 0}.todayBand h2{max-width:980px}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}.three article{background:#fff;border:1px solid #c9dce4;padding:28px}.three small{font-size:9px;font-weight:950;color:#0a759a;letter-spacing:.13em}.three h3{font:27px Georgia,serif}.three p{font-size:13px;line-height:1.7;color:#52666e}
      .boundary{margin-top:30px;padding:26px;border:1px solid #c7d7dd;background:#fff;color:#42585f;line-height:1.7;font-size:13px}.boundary strong{color:#16303a}
      .sources{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-top:32px}.sources a{display:block;padding:19px;background:#fff;border:1px solid #d3dfe3;text-decoration:none;color:#16313c;font-size:12px;font-weight:850}.sources a:hover{border-color:#0b769c;transform:translateY(-2px)}.footer{background:#03141c;color:#849da7;padding:38px 0;font-size:10px;letter-spacing:.09em;line-height:1.7}
      @media(max-width:900px){.heroGrid,.signals,.three,.examGrid,.seam{grid-template-columns:1fr}.signals{gap:14px}.chain{grid-template-columns:repeat(4,1fr)}.arrow{transform:rotate(90deg);min-height:46px}.links{display:none}}
      @media(max-width:540px){.chain{grid-template-columns:repeat(2,1fr)}.hero{padding:56px 0}.section{padding:58px 0}}
    `}</style>

    <nav className="nav"><div className="shell"><div className="brand">ダイキン工業 · 公開戦略ショールーム</div><div className="links"><a href="/">TA-14 EXCHANGE</a><a href="#fusion">FUSION30</a><a href="#seam">境界</a><a href="#exam">検証</a><a href="#record">記録</a></div></div></nav>

    <header className="hero"><div className="shell heroGrid">
      <div><p className="eyebrow">ダイキン工業 · FUSION30 · 空気 · 建物 · 結果</p><h1>空気を極める。<em>結果を統治する。</em></h1><p className="lede">ダイキンは、機器単体から、センシング、制御、エネルギー管理、室内空気価値、DX、サービスを含む建物全体・ライフサイクル型ソリューションへと公開戦略を広げています。TA-14は、その能力が物理的現実を変え得るときに現れる境界を検証します。</p><a href="/showrooms/daikin-industries/en" style={{display:"inline-block",marginTop:24,padding:"13px 18px",background:"#62d8ff",color:"#06202c",textDecoration:"none",fontWeight:950,fontSize:12}}>英語版を読む →</a><div className="status"><span>独立した公開検証</span><span>訂正を歓迎</span><span>提携・推奨を意味しません</span></div></div>
      <aside className="today"><small>2026年9月28日 · 本日</small><h2>ダイキンが記録を公開しました。</h2><p>ダイキン工業は「統合報告書2026」と「サステナビリティレポート2026」を公開し、FUSION30、収益性、サステナビリティの重点課題、ステークホルダーとの対話を現在の公開記録に置きました。</p><strong>これにより、本日の戦略は推測ではなく、検証可能な公開記録となります。</strong></aside>
    </div></header>

    <section id="fusion" className="section"><div className="shell"><p className="eyebrow">ダイキンが目指しているもの</p><h2>FUSION30は、空調機器の枠を越え、建物全体のライフサイクル・ソリューションへと境界を広げています。</h2><p className="intro">公開戦略は、コンプレッサー性能や機器効率の向上だけに限定されません。ダイキンは、建物全体のライフサイクル・ソリューション、システムレベル制御、応用技術、DXシステム商品、空気質管理、センシング、社外共創を示しています。</p><div className="signals">{signals.map(s=><article className="signal" key={s[0]}><small>{s[0]} · {s[1]}</small><h3>{s[1]}</h3><p>{s[2]}</p></article>)}</div></div></section>

    <section id="seam" className="section dark"><div className="shell"><p className="eyebrow">ダイキン × TA-14 の境界面</p><h2>能力は拡大している。権限はなお確立されなければならない。</h2><p className="intro">建物は、より多くを感知し、接続し、最適化できるようになります。しかし、それだけでは特定の物理的結果に伴う統治上の問いには答えられません。</p><div className="seam"><article className="panel"><small>ダイキン · 能力面</small><h3>観測する。分析する。最適化する。制御する。</h3><p>空気質センシング、BMS統合、遠隔監視、エネルギー管理、システムレベル制御、診断、AI／IoT異常監視、ライフサイクルサービスにより、建物システムの能力は高まります。</p></article><div className="arrow">→</div><article className="panel"><small>TA-14 · 結果面</small><h3>これは「今」、現実になってよいのか？</h3><p>提案された結果について、コミットと実行の前に、十分な <strong>許容可能な証拠</strong>、<strong>適用可能な権限</strong>、<strong>確立された立場</strong>を確立します。</p></article></div><div className="rule"><strong>監視は証拠ではない。証拠は権限ではない。権限は実行ではない。</strong><br/>接続されたインテリジェントな建物が技術的に行動可能であっても、その結果が承認されているとは限りません。</div></div></section>

    <section className="section"><div className="shell"><p className="eyebrow">TA-14 · 8段階の連鎖</p><h2>ダイキンによって可能になる結果を、同じ可視化された経路で検証する。</h2><p className="intro">機器ブランドが許容性を決めるのではありません。経路が決めます。</p><div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div></div></section>

    <section id="exam" className="section todayBand"><div className="shell"><p className="eyebrow">インタラクティブ建物結果検証</p><h2>信号を変える。境界は変えない。</h2><div className="exam"><div className="scenarioTabs">{scenarios.map((s,i)=><button type="button" key={s.label} className={scenario===i?"on":""} onClick={()=>{setScenario(i);setDecision(null)}}>{s.label}</button>)}</div><div className="examGrid"><article className="examCard"><small>観測 / 提案</small><h3>{current.evidence}</h3><p><strong>提案された結果：</strong> {current.action}</p></article><article className="examCard"><small>権限の問い</small><h3>接続だけでは、この問いに答えられない。</h3><p>{current.authority}</p></article></div><div className="actions"><button type="button" className={decision==="ALLOW"?"on":""} onClick={()=>setDecision("ALLOW")}>ALLOW</button><button type="button" className={decision==="HOLD"?"on":""} onClick={()=>setDecision("HOLD")}>HOLD</button><button type="button" className={decision==="ESCALATE"?"on":""} onClick={()=>setDecision("ESCALATE")}>ESCALATE</button></div>{decision&&<div className="receipt">{decision==="ALLOW"?<><strong>ALLOW が選択されました。</strong> コミット時点で、この特定の結果に対して証拠・権限・立場が十分だった理由を示す保存記録が必要です。</>:decision==="HOLD"?<><strong>HOLD が選択されました。</strong> 観測と提案を保存し、不足している条件が確立されるまで能力を実行へ変換しません。</>:<><strong>ESCALATE が選択されました。</strong> システムに許可を推論させず、未解決の権限・証拠・立場の問いを責任ある地域の意思決定者へ送ります。</>}</div>}</div></div></section>

    <section className="section"><div className="shell"><p className="eyebrow">なぜFUSION30に関係するのか</p><h2>ダイキンがソリューション提供者へ進むほど、結果の境界は重要になります。</h2><div className="three"><article><small>01 · ライフサイクル</small><h3>一度コミッショニングされた ≠ 永久に許可された。</h3><p>建物条件、センサー、在室者、スケジュール、設備、地域の権限は変化します。ライフサイクル型サービスには、永続的に継承された許可ではなく、明示的な再検証が有効です。</p></article><article><small>02 · 規模</small><h3>遠隔能力は結果を拡大する。</h3><p>クラウド接続された制御は、一つの提案を多数の拠点へ展開できます。各実行境界で、地域の権限と立場が検証可能であるべきです。</p></article><article><small>03 · 空気価値</small><h3>健康な空気という目的にも、境界づけられた行動が必要。</h3><p>有効なIAQ証拠は結果を支持できますが、それだけで自動的に結果を承認するものではありません。観測から結果までの経路が保存されることで、証拠の価値は高まります。</p></article></div><div className="boundary"><strong>独立検証の境界。</strong> 本ショールームは、ダイキンの公開企業資料を用いてアーキテクチャ上の境界を検証するものです。ダイキン工業、その子会社、役員、技術者、広報担当者、パートナー、顧客がTA-14を採用、推奨、または正式に評価したことを示唆するものではありません。ダイキンに関する記述への訂正を歓迎します。</div></div></section>

    <section className="section"><div className="shell"><p className="eyebrow">ダイキンから想定される質問</p><h2>技術検証が始まる前に、境界の問いに答える。</h2><div className="three">
<article><small>01 · 既存システム</small><h3>BMSや制御ロジックを置き換えるのか？</h3><p>いいえ。TA-14はセンシング、BMS、最適化、上位制御、機器ロジックを置き換えません。提案された結果が実行へコミットされる直前のガバナンス境界を検証します。</p></article>
<article><small>02 · 権限</small><h3>権限はどこから来るのか？</h3><p>TA-14が宣言して作るものではありません。所有者、運用者、契約、法令、安全規則、委任された役割など、その結果に適用される実際の統治源から確立します。</p></article>
<article><small>03 · 証拠</small><h3>証拠が劣化した場合は？</h3><p>観測記録は保存したまま、結果をHOLD、DENY、またはESCALATEできます。証拠を保存することと、劣化した証拠を実行に十分だと扱うことを分離します。</p></article>
<article><small>04 · クラウド</small><h3>権限は接続境界を越えられるか？</h3><p>権限の文脈は越えることができます。しかし実行権限は自動継承されません。受信側で、その結果に対する地域の権限と立場を確立します。</p></article>
<article><small>05 · 記録</small><h3>TA-14は何を保存するのか？</h3><p>現実から記録、連続性、許容性、拘束、コミット、実行、結果まで、なぜその時点でその判定が可能だったのかを追跡できる経路を保存します。</p></article>
<article><small>06 · 最初の検証</small><h3>ダイキン × TA-14の最初の検証は？</h3><p>一つの限定された結果を選び、関係者、証拠、接続経路、権限条件を固定します。その上で条件を変更し、どこでALLOWがHOLD、DENY、ESCALATEへ変わるかを確認します。</p></article>
<article><small>07 · 統合負荷</small><h3>既存製品への大規模な変更が必要か？</h3><p>最初の検証では必要ありません。既存の信号、制御提案、権限情報、実行点を境界オブジェクトとして扱い、現在のシステムを置き換えずに検証できます。</p></article><article><small>08 · 安全</small><h3>既存の安全インターロックと競合しないか？</h3><p>競合させるべきではありません。機器保護や生命安全など既存の強制的な安全機能は、その適用範囲を明示した上で保持します。TA-14はそれらを迂回する権限を生成しません。</p></article><article><small>09 · 通信障害</small><h3>クラウドや権限サービスが利用できない場合は？</h3><p>実行に必要な証拠・権限・立場を確立できない場合、推測で許可を作りません。対象となる結果は、事前に定めた安全な状態、HOLD、または地域の権限者へのESCALATEへ移行します。</p></article><article><small>10 · 責任境界</small><h3>誰が最終的な結果に責任を持つのか？</h3><p>TA-14は責任主体を自動的に決めません。誰がどの権限で何を承認し、どのシステムが何を実行したかを結果まで追跡可能にすることを目的とします。</p></article><article><small>11 · 性能</small><h3>リアルタイム制御に遅延を加えるのか？</h3><p>すべての制御ループをTA-14へ通すという前提ではありません。どの結果に統治境界が必要かを事前に分類し、時間制約のある安全・制御機能と権限確認が必要な結果を分離できます。</p></article><article><small>12 · 開始条件</small><h3>ダイキンから最初に何が必要か？</h3><p>製品採用や機密情報ではありません。まず一つの実際のユースケースについて、提案される結果、現在の証拠、実行点、権限主体、接続境界を共同で定義できれば、限定検証を開始できます。</p></article></div></div></section><section className="dark"><div className="shell"><p className="eyebrow">次の一歩</p><h2>ダイキン × TA-14 限定技術検証を提案する。</h2><p>製品採用や提携を前提とせず、一つの実際の結果を選び、証拠・権限・接続・実行境界を固定して検証できます。公開資料だけでは答えられない境界を、ダイキン側の技術条件で試すための入口です。</p><a href="mailto:gregbutlerac@gmail.com?subject=Daikin%20%C3%97%20TA-14%20Bounded%20Technical%20Examination" style={{display:"inline-block",marginTop:22,padding:"14px 20px",background:"#62d8ff",color:"#06202c",textDecoration:"none",fontWeight:950}}>限定技術検証を提案する →</a></div></section><section id="record" className="section dark"><div className="shell"><p className="eyebrow">公開一次資料記録</p><h2>ダイキン自身が公開した戦略をたどる。</h2><p className="intro">この検証は、2026年9月28日に公開された資料を含む、ダイキンの一次資料に意図的に基づいています。</p><div className="sources">{sources.map(s=><a key={s[1]} href={s[1]} target="_blank" rel="noreferrer">{s[0]} ↗</a>)}</div></div></section>

    <footer className="footer"><div className="shell">ダイキン工業 · 公開戦略ショールーム · 一次資料に基づく検証 · 訂正を歓迎 · 推奨を意味しません · TA-14 EXCHANGE<br/><br/><a href="/showrooms/daikin-industries/en" style={{color:"#62d8ff",fontWeight:900}}>英語版を読む →</a></div></footer>
  </main>;
}