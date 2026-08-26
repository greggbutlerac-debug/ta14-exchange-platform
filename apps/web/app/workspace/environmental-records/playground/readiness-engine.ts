export type ReadinessState = 'NOT_YET_GOVERNED' | 'PARTIALLY_GOVERNABLE' | 'READY_FOR_ADMISSIBILITY_REVIEW' | 'ADMISSIBLE_FOR_DECLARED_INTERPRETATION' | 'INSUFFICIENT_OR_INCONCLUSIVE';
export type ReadinessFinding = { id:string; label:string; status:'ESTABLISHED'|'PARTIAL'|'MISSING'|'CONFLICT'|'NOT_APPLICABLE'; detail:string; evidence:string[] };
export type ReadinessReport = { engine:'TA14-EGRI'; engineVersion:'1.2.1'; state:ReadinessState; score:number; inspectionObject:string; proposition:string; supportedNow:string[]; prohibitedInferences:string[]; missingBeforeStrongerReliance:string[]; nextAdmissibleSteps:string[]; findings:ReadinessFinding[]; eriEligible:boolean; generatedAt:string };

function has(text:string, pattern:RegExp){return pattern.test(text)}
function snippets(text:string, pattern:RegExp){return text.split(/\n+/).map(x=>x.trim()).filter(Boolean).filter(x=>pattern.test(x)).slice(0,4)}
function absent(text:string, subject:string){
 const esc=subject.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return new RegExp(`(?:no|not|without|missing|unknown|unavailable|not attached|not supplied|not provided|not recorded|not included|not identified|does not identify|does not include|does not state|is not stated|is not attached|was not supplied|were not recorded)[^\\n.]{0,90}${esc}|${esc}[^\\n.]{0,90}(?:missing|unknown|unavailable|not attached|not supplied|not provided|not recorded|not included|not identified|not stated|not established)`,`i`).test(text);
}

export function examineEnvironmentalReadiness(input:{text:string;inspectionObject:string;proposition:string;recordClass:string}):ReadinessReport{
 const text=input.text.trim(), lower=text.toLowerCase(); const findings:ReadinessFinding[]=[];
 const add=(id:string,label:string,status:ReadinessFinding['status'],detail:string,pattern?:RegExp)=>findings.push({id,label,status,detail,evidence:pattern?snippets(text,pattern):[]});

 const sourceIdentity=has(lower,/(record id|device id|device:|sensor id|instrument id|laboratory|technician|facility:|building:|site:|manufacturer|serial)/i);
 add('source_identity','Source identity',sourceIdentity?'ESTABLISHED':'MISSING',sourceIdentity?'The submitted package contains identifiable source, facility, device, or record identity.':'Reliable source or record identity is not established.',/(record id|device id|sensor id|instrument id|laboratory|technician|facility:|building:|site:|serial)/i);

 const timeBoundary=has(lower,/(\b20\d{2}[-\/]\d{1,2}[-\/]\d{1,2}\b|\b\d{1,2}:\d{2}\b|monitoring period|timestamp|from .* to|through)/i);
 add('time_boundary','Time boundary',timeBoundary?'ESTABLISHED':'MISSING',timeBoundary?'A temporal observation boundary is present.':'A sufficiently clear temporal boundary is not established.',/(20\d{2}|\d{1,2}:\d{2}|monitoring period|timestamp)/i);

 const location=has(lower,/(room|zone|building|facility|site|address|location|floor|mechanical room|occupied zone)/i);
 add('location','Location / spatial attribution',location?'ESTABLISHED':'MISSING',location?'A monitored place, zone, or spatial context is identifiable.':'A sufficiently clear spatial boundary is not established.',/(room|zone|building|facility|site|address|location|floor)/i);

 const calibrationMention=has(lower,/(calibrat|certificate|traceable|nist|verification date|sensor validation)/i);
 const calibrationAbsent=absent(lower,'calibrat')||absent(lower,'certificate')||has(lower,/(calibration certificate.{0,50}(not attached|missing|unavailable|not supplied)|current calibration.{0,50}(not|unknown|missing))/i);
 add('calibration','Calibration / instrument standing',calibrationAbsent?'MISSING':calibrationMention?'ESTABLISHED':'MISSING',calibrationAbsent?'Calibration or instrument standing is explicitly absent, unavailable, or not established by the submitted package.':calibrationMention?'Calibration or instrument-verification evidence is affirmatively present.':'Calibration or instrument standing is not established.',/(calibrat|certificate|traceable|nist|sensor validation)/i);

 const rawAbsent=has(lower,/(raw (sensor )?data.{0,70}(not supplied|not provided|unavailable|missing)|underlying.{0,50}(not supplied|not provided|unavailable)|sampling frequency.{0,60}(not stated|unknown)|aggregation method.{0,60}(unknown|not stated)|unknown whether.{0,80}(instantaneous|average|maximum|minimum))/i);
 const explicitZeroMissing=has(lower,/(missing (observations|samples|readings|intervals?)\s*:\s*0\b|data gaps?\s*:\s*0\b|dropouts?\s*:\s*0\b)/i);
 const explicitNoGap=has(lower,/(no (communication )?interruption|no missing interval|no data gap|no dropout|missing observations\s*:\s*0|recorded native observations\s*:\s*\d+[\s\S]{0,80}expected native observations\s*:\s*\d+)/i);
 const gapSignal=has(lower,/(missing interval|data gap|gap detected|interruption|offline|dropout|loss of data|no data)/i);
 const gap=gapSignal&&!explicitZeroMissing&&!explicitNoGap;
 const continuityPositive=has(lower,/(continuous raw|continuous record|complete period|sampling interval:\s*\d|sample interval:\s*\d|uptime(?: during declared boundary)?\s*:\s*\d|monitoring uptime[^\n]*100%|missing observations\s*:\s*0)/i);
 add('continuity','Chronology / continuity',gap||rawAbsent?'PARTIAL':continuityPositive?'ESTABLISHED':'MISSING',gap?'The package declares a continuity interruption or missing interval.':rawAbsent?'Reported chronology exists, but native sampling continuity or underlying observations are not established.':continuityPositive?'Affirmative continuity or sampling evidence is present.':'Native continuity and coverage are not established.',/(continuous|sampling|sample interval|uptime|missing interval|missing observations|gap|raw data|aggregation)/i);

 const provenancePositive=has(lower,/(sha-?256|cryptographic hash|digitally signed|chain of custody:\s*(established|complete)|provenance id|record version:\s*[a-z0-9])/i);
 const provenanceAbsent=absent(lower,'chain of custody')||absent(lower,'cryptographic')||absent(lower,'record version')||has(lower,/(no chain-of-custody|no cryptographic|no record version|version identifier.{0,50}(not provided|missing))/i);
 add('provenance','Provenance / version identity',provenanceAbsent?'MISSING':provenancePositive?'ESTABLISHED':'MISSING',provenanceAbsent?'Record integrity, custody, or version identity is explicitly absent or not established.':provenancePositive?'Affirmative provenance, integrity, custody, or version evidence is present.':'Provenance and version identity are not established.',/(chain of custody|provenance|hash|sha-?256|signed|signature|record version|version identifier)/i);

 const thresholdAbsent=has(lower,/(threshold source.{0,70}(not identified|unknown|missing)|does not identify the threshold|threshold.{0,50}not disclosed|acceptable.{0,80}(source unknown|basis unknown))/i);
 const thresholdPositive=has(lower,/(threshold source:\s*\S|reference standard:\s*\S|ashrae\s*\d|epa\s+[^\n]+|who\s+[^\n]+|osha\s+[^\n]+|declared limit:\s*\d|guideline:\s*\d)/i);
 add('threshold_source','Threshold / reference source',thresholdAbsent?'MISSING':thresholdPositive?'ESTABLISHED':'MISSING',thresholdAbsent?'The package uses or reports a classification without establishing its threshold or reference source.':thresholdPositive?'A declared threshold or reference source is affirmatively identified.':'The governing threshold or reference source is not established.',/(threshold|reference standard|ashrae|epa|who|osha|acceptable|guideline)/i);

 const objectText=input.inspectionObject.trim();
 const objectLower=objectText.toLowerCase();
 const objectIdentity=objectText.length>=20;
 const objectSpatial=has(objectLower,/(room|zone|building|facility|site|address|floor|mechanical room|occupied zone|duct|air handler|ahu|coil|water loop|tank|parcel|soil|surface water|groundwater)/i);
 const objectTemporal=has(objectLower,/(\b20\d{2}[-\/]\d{1,2}[-\/]\d{1,2}\b|\b\d{1,2}:\d{2}\b|from .* to|through|during|period|interval|at time|between)/i);
 const objectMediumOrSystem=has(objectLower,/(air|atmospher|water|soil|land|moisture|pressure|temperature|humidity|pm2\.?5|particulate|co2|voc|radon|hvac|ahu|air handler|duct|room|zone|building|equipment|system|surface|groundwater)/i);
 const objectCondition=has(objectLower,/(condition|concentration|level|reading|relationship|differential|state|exposure|event|excursion|performance|operation|quality|contamination|temperature|humidity|pressure|pm2\.?5|particulate|co2|voc|radon|moisture)/i);
 const objectDimensions=[objectSpatial,objectTemporal,objectMediumOrSystem,objectCondition].filter(Boolean).length;
 const objectStatus:ReadinessFinding['status']=!objectIdentity?'MISSING':objectDimensions>=3?'ESTABLISHED':objectDimensions>=2?'PARTIAL':'MISSING';
 const missingObjectDimensions=[!objectSpatial?'spatial boundary':'',!objectTemporal?'temporal boundary':'',!objectMediumOrSystem?'environmental medium or governed system':'',!objectCondition?'condition or state under examination':''].filter(Boolean);
 const objectDetail=objectStatus==='ESTABLISHED'?'The declared environmental object is bounded across sufficient spatial, temporal, system/medium, and condition dimensions for this readiness review.':objectStatus==='PARTIAL'?`The declared object is only partially bounded. Still unresolved: ${missingObjectDimensions.join(', ')}.`:'The environmental object is not defined with enough precision to establish what the submitted evidence actually attaches to.';
 add('object_localization','Environmental object definition',objectStatus,objectDetail);

 const propositionBound=input.proposition.trim().length>=20;
 add('proposition','Bounded proposition',propositionBound?'ESTABLISHED':'MISSING',propositionBound?'A bounded interpretation question has been declared.':'The proposition or interpretation question is too weakly bounded.');
 const conflict=has(lower,/(conflicting (records|readings|evidence)|contradictory (records|readings|evidence)|sensor disagreement|measurements disagree)/i);
 add('conflict','Conflicting evidence',conflict?'CONFLICT':'NOT_APPLICABLE',conflict?'The package declares conflicting evidence requiring resolution or explicit bounding.':'No explicit evidentiary conflict is declared.',/(conflicting|contradictory|sensor disagreement|measurements disagree)/i);
 const authorityAbsent=has(lower,/(no intervention authority|authority.{0,50}(not identified|unknown|missing)|intervention authority.{0,50}(not identified|not established))/i);
 const authorityPositive=has(lower,/(authorized by:\s*\S|approved by:\s*\S|responsible party:\s*\S|owner authorization:\s*\S|engineer of record:\s*\S|permit:\s*\S)/i);
 add('authority','Authority / reliance boundary',authorityAbsent?'MISSING':authorityPositive?'ESTABLISHED':'MISSING',authorityAbsent?'Authority for consequential intervention is explicitly absent or not established.':authorityPositive?'An affirmative authority or responsibility boundary is present.':'Authority for consequential reliance is not established.',/(authorized by|authority|approved by|responsible party|owner authorization|engineer of record|permit)/i);

 const material=findings.filter(f=>f.status!=='NOT_APPLICABLE');
 const weights:Record<string,number>={source_identity:1,time_boundary:1,location:1,calibration:1.5,continuity:1.5,provenance:1.5,threshold_source:1,object_localization:1.5,proposition:1,authority:1.5,conflict:1.5};
 let earned=0,total=0; for(const f of material){const w=weights[f.id]||1;total+=w;if(f.status==='ESTABLISHED')earned+=w;else if(f.status==='PARTIAL')earned+=w*.4;}
 const score=Math.max(0,Math.min(100,Math.round((earned/(total||1))*100)));
 const missing=material.filter(f=>f.status==='MISSING').length, partial=material.filter(f=>f.status==='PARTIAL').length, conflicts=material.filter(f=>f.status==='CONFLICT').length;
 const criticalWeak=['calibration','continuity','provenance','threshold_source','authority','object_localization'].filter(id=>{const s=findings.find(f=>f.id===id)?.status;return s==='MISSING'||s==='PARTIAL'}).length;
 let state:ReadinessState='NOT_YET_GOVERNED';
 if(!text||text.length<40)state='INSUFFICIENT_OR_INCONCLUSIVE';
 else if(objectStatus!=='ESTABLISHED')state='NOT_YET_GOVERNED';
 else if(conflicts>0||criticalWeak>=4||missing>=6)state='NOT_YET_GOVERNED';
 else if(criticalWeak>=2||missing>=3||partial>=2)state='PARTIALLY_GOVERNABLE';
 else if(missing>=1||partial>=1)state='READY_FOR_ADMISSIBILITY_REVIEW';
 else state='ADMISSIBLE_FOR_DECLARED_INTERPRETATION';
 const criticalIds=['source_identity','time_boundary','location','calibration','continuity','provenance','threshold_source','object_localization','proposition'];
 const eriEligible=criticalIds.every(id=>findings.find(f=>f.id===id)?.status==='ESTABLISHED')&&!findings.some(f=>f.status==='CONFLICT')&&state==='ADMISSIBLE_FOR_DECLARED_INTERPRETATION';
 const missingBeforeStrongerReliance=findings.filter(f=>['MISSING','PARTIAL','CONFLICT'].includes(f.status)).map(f=>`${f.label}: ${f.detail}`);
 const supportedNow=[sourceIdentity?'The package contains identifiable environmental source or record information.':'The package can be preserved as submitted material, but source identity is not established.',timeBoundary?'The material contains observations tied to a detectable time context.':'The material does not establish a reliable time-bounded observation period.',location?'The material contains spatial or facility context relevant to bounded environmental interpretation.':'The material does not establish a reliable location-specific observation boundary.',objectStatus==='ESTABLISHED'?'The evidence has a sufficiently bounded declared environmental object for this readiness review.':'The evidence-object relationship is not yet sufficiently bounded for stronger consequential reliance.'];
 const prohibitedInferences=['Do not convert environmental observations into a medical diagnosis or health outcome.','Do not convert a reported classification or threshold comparison into causal attribution without separate evidence.','Do not treat missing, declared-only, or unparsed evidence as if it were inspected.','Do not treat interpretation readiness as authority to execute a consequential intervention.'];
 if(objectStatus!=='ESTABLISHED')prohibitedInferences.push('Do not attach the submitted evidence to a broader, different, or insufficiently defined environmental object. A valid evidence chain cannot cure an incorrect object boundary.');
 if(gap||rawAbsent)prohibitedInferences.push('Do not make an unrestricted whole-period claim when native sampling continuity or aggregation behavior is not established.');
 if(thresholdAbsent)prohibitedInferences.push('Do not treat the record’s ACCEPTABLE classification as independently supported when its threshold source is undisclosed.');
 if(conflict)prohibitedInferences.push('Do not select one conflicting source as authoritative without a declared resolution rule or bounded rationale.');
 const nextAdmissibleSteps=missingBeforeStrongerReliance.length?missingBeforeStrongerReliance.slice(0,6).map(x=>`Resolve ${x}`):['Submit the admitted evidence package to ERI for bounded interpretation.'];
 return {engine:'TA14-EGRI',engineVersion:'1.2.1',state,score,inspectionObject:objectText,proposition:input.proposition.trim(),supportedNow,prohibitedInferences,missingBeforeStrongerReliance,nextAdmissibleSteps,findings,eriEligible,generatedAt:new Date().toISOString()};
}
