import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-sky-900 text-sky-100 px-4 py-2 text-xs text-center flex items-center justify-center gap-2 font-sans tracking-wide">
      <Info className="w-4 h-4 shrink-0 text-sky-300" />
      <span>
        <strong>Academic prototype for evaluation</strong> — illustrative data only. Prices and availability are not live or guaranteed. No payment or confirmed booking is provided.
      </span>
    </div>
  );
};
