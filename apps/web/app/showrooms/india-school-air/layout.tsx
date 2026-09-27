import type {Metadata} from 'next';

export const metadata:Metadata={
 title:'India School Air · Measurement to Consequence | TA-14 Exchange',
 description:'Independent interactive TA-14 examination of the boundary between occupied-classroom air measurements, applicable authority, execution and verified outcome in India.',
 alternates:{canonical:'/showrooms/india-school-air'},
 openGraph:{
  title:'India School Air · The Sensor Sees It. Who May Act?',
  description:'An interactive public examination of what must be established before a classroom air-quality signal becomes an authorized consequence.',
  url:'https://www.ta14exchange.com/showrooms/india-school-air',
  type:'website'
 }
};

export default function Layout({children}:{children:React.ReactNode}){return children}
