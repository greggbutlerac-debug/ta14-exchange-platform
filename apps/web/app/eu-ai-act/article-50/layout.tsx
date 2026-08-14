import type {ReactNode} from 'react';
import Article50ReceiptBridge from './Article50ReceiptBridge';

export default function Article50Layout({children}:{children:ReactNode}){
 return <>{children}<Article50ReceiptBridge/></>;
}
