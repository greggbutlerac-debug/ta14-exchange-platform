"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ModelState = "baseline"|"evidence-gap"|"authority-loss"|"continuity-break"|"changed";

const states: Record<ModelState,{label:string;result:string;detail:string;path:string[]}> = {
  baseline:{label:"PRESENT CONSTITUTIONAL STATE SUPPORTED",result:"ADMISSIBLE",detail:"Admitted evidence, valid authority, continuity, constraints, and current operating conditions support a bounded present-state constitutional admissibility determination.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","EXAMINE CONSEQUENCE","ADMISSIBLE"]},
  "evidence-gap":{label:"ADMITTED EVIDENCE INSUFFICIENT",result:"ESCALATED",detail:"A material evidence gap cannot be silently converted into affirmative permission. The unresolved state remains visible.",path:["EVIDENCE GAP","STATE UNRESOLVED","NO SILENT ASSUMPTION","ESCALATED"]},
  "authority-loss":{label:"VALID AUTHORITY NOT ESTABLISHED",result:"DENIED",detail:"The v1.0 declaration does not authorize consequential execution in the absence of valid authority and current constitutional admissibility.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","AUTHORITY FAILURE","DENIED"]},
  "continuity-break":{label:"CONTINUITY NOT ESTABLISHED",result:"DENIED",detail:"Prior constitutional state does not automatically carry forward when material continuity cannot be established.",path:["PRIOR STATE","CONTINUITY BREAK","PRESENT STATE FAILS","DENIED"]},
  changed:{label:"MATERIAL CONDITIONS CHANGED",result:"RECOMPUTE PRESENT STATE",detail:"The registered declaration recomputes admissibility when material changes affect present constitutional state. A prior determination is not permanent permission.",path:["PRIOR DETERMINATION","MATERIAL CHANGE","RECOMPUTE STATE","NEW DETERMINATION"]}
};
