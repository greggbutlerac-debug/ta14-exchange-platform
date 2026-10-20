// Local report consistency checks. These are not a signature or audit attestation.
export function validateExaminationReport(report) {
 const issues=[];
 if(!report||typeof report!=='object'||Array.isArray(report))return {valid:false,issues:['Invalid report']};
 if(report.schema!=='ta14-governed-air-report-v0.1')issues.push('Unexpected schema');
 if(report.disposition!=='HOLD'||report.execution_authorized!==false)issues.push('Unauthorized disposition or execution flag');
 if(!report.case_id||typeof report.case_id!=='string')issues.push('Missing case identifier');
 if(!Array.isArray(report.eight_anchor_trace)||report.eight_anchor_trace.length!==8)issues.push('Eight-anchor trace incomplete');
 else {
  const expected=['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'];
  if(report.eight_anchor_trace.some((x,i)=>x?.anchor!==expected[i]))issues.push('Eight-anchor order mismatch');
 }
 if(!Array.isArray(report.outstanding_requirements)||report.outstanding_requirements.length!==11)issues.push('Requirement review incomplete');
 else if(report.outstanding_requirements.some(x=>x.established!==false))issues.push('Unexpected established requirement');
 if(report.classification!=='HYPOTHETICAL SIMULATION — NOT AN EXECUTION AUTHORIZATION')issues.push('Missing simulation classification');
 return {valid:issues.length===0,issues};
}
