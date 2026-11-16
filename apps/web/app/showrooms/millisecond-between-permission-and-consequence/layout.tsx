import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Millisecond Between Permission and Consequence | TA-14 Exchange',
  description: 'Eight visual lessons, Samantha narration, four interactive execution-boundary cases, and five reproducible examinations of execution-time standing in autonomous buildings.',
  openGraph: {
    title: 'The Millisecond Between Permission and Consequence',
    description: 'The command was authorized. Then the world changed. Explore the TA-14 engineering examination of execution-time evidence, authority, and standing.',
    images: ['/The%20Millisecond_%20Permission%20to%20Consequence.png']
  }
};

export default function Layout({children}: {children: React.ReactNode}) {
  return children;
}
