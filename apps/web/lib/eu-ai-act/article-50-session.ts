export const ARTICLE50_SESSION_EVENT='ta14:article50-assessment';

export type Article50AssessmentSession={
 actorRole:string;
 contentTypes:string[];
 obligationIds:string[];
 evidenceRequired:string[];
 evidenceDeclared:string[];
 assessmentState:string;
 evidencePercent:number;
 updatedAt:string;
};

const KEY='ta14.eu.article50.assessment.v1';

export function publishArticle50Assessment(session:Article50AssessmentSession){
 if(typeof window==='undefined')return;
 try{window.sessionStorage.setItem(KEY,JSON.stringify(session))}catch{}
 window.dispatchEvent(new CustomEvent<Article50AssessmentSession>(ARTICLE50_SESSION_EVENT,{detail:session}));
}

export function readArticle50Assessment():Article50AssessmentSession|null{
 if(typeof window==='undefined')return null;
 try{const raw=window.sessionStorage.getItem(KEY);return raw?JSON.parse(raw) as Article50AssessmentSession:null}catch{return null}
}
