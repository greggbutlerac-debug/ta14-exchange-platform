import type {ReactNode} from 'react';
import Article50GovernanceLayer from './Article50GovernanceLayer';

export default function Article50Layout({children}:{children:ReactNode}){
  return <>
    <div style={{maxWidth:1220,width:'min(1220px,calc(100% - 36px))',margin:'0 auto',paddingTop:22}}>
      <Article50GovernanceLayer/>
    </div>
    {children}
  </>;
}
