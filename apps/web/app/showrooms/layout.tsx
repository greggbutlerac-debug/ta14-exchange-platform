import type { ReactNode } from 'react';
import ShowroomReviewChallenge from './ShowroomReviewChallenge';

export default function ShowroomsLayout({children}:{children:ReactNode}){
 return <>{children}<ShowroomReviewChallenge /></>;
}
