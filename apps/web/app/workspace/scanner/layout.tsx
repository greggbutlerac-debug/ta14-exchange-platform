import type {ReactNode} from 'react';
import ScannerExchangeRecorder from './ScannerExchangeRecorder';

export default function ScannerLayout({children}:{children:ReactNode}){
  return <>{children}<ScannerExchangeRecorder/></>;
}
