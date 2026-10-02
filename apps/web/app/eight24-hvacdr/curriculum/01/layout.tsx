'use client';

import {usePathname} from 'next/navigation';
import {LessonVisualSamantha} from './LessonVisualSamantha';
import {lessonVisuals} from './lessonVisuals';

export default function Module01Layout({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const match=pathname.match(/\/curriculum\/01\/lesson\/(\d{2})(?:\/|$)/);
  const visual=match?lessonVisuals[match[1]]:undefined;
  if(!visual)return <>{children}</>;
  return <><div style={{background:'#001326',padding:'24px 20px 0'}}><div style={{maxWidth:1120,margin:'auto'}}><LessonVisualSamantha visual={visual}/></div></div>{children}</>;
}
