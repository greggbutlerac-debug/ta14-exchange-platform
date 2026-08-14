import type { ReactNode } from "react";
import LiveExchangeNetwork from "./LiveExchangeNetwork";

export default function ExchangeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div className="bg-[#02050a] text-white">
        <div className="mx-auto max-w-[1600px] px-5 pb-24 lg:px-10">
          <LiveExchangeNetwork />
        </div>
      </div>
    </>
  );
}
