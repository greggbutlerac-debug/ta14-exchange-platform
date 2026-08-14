import type {ReactNode} from 'react';
import ExchangeForkRecorder from './ExchangeForkRecorder';

export default function BuildLayout({children}:{children:ReactNode}){
  return <>{children}<ExchangeForkRecorder/></>;
}
