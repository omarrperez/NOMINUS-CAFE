import React from 'react';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';

interface BimonetaryDisplayProps {
  amountBs: number;
  amountUsd: number;
  bcvRate?: number;
  layout?: 'stacked' | 'inline' | 'hero' | 'table-cell';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  align?: 'left' | 'right' | 'center';
  showRate?: boolean;
  rateLabel?: string;
  className?: string;
}

export const BimonetaryDisplay: React.FC<BimonetaryDisplayProps> = ({
  amountBs,
  amountUsd,
  bcvRate,
  layout = 'stacked',
  size = 'base',
  align = 'right',
  showRate = false,
  rateLabel = 'Tasa BCV',
  className = '',
}) => {
  const alignClass =
    align === 'left' ? 'text-left items-start' : align === 'center' ? 'text-center items-center' : 'text-right items-end';

  if (layout === 'hero') {
    return (
      <div className={`flex flex-col ${alignClass} font-mono-numbers ${className}`}>
        <div className="text-xl sm:text-2xl font-extrabold text-[#1A202C] tracking-tight">
          {formatCurrencyBs(amountBs)}
        </div>
        <div className="text-xs sm:text-sm font-bold text-[#2A6496] flex items-center gap-1.5 mt-0.5">
          <span>{formatCurrencyUsd(amountUsd)}</span>
          {showRate && bcvRate && (
            <span className="text-[10px] font-sans font-medium bg-white/80 px-1.5 py-0.2 rounded border border-[#CFE2F3] text-[#475569]">
              {rateLabel}: Bs. {bcvRate.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <div className={`inline-flex flex-wrap items-center gap-1.5 font-mono-numbers ${className}`}>
        <span className="font-bold text-[#1A202C]">{formatCurrencyBs(amountBs)}</span>
        <span className="text-[#A0AEC0] font-sans">/</span>
        <span className="font-semibold text-[#2A6496]">{formatCurrencyUsd(amountUsd)}</span>
        {showRate && bcvRate && (
          <span className="text-[10px] text-[#718096] font-sans">
            (@ Bs. {bcvRate.toFixed(2)})
          </span>
        )}
      </div>
    );
  }

  if (layout === 'table-cell') {
    return (
      <div className={`flex flex-col ${alignClass} font-mono-numbers leading-tight ${className}`}>
        <span className="font-bold text-[#1A202C] text-xs">
          {formatCurrencyBs(amountBs)}
        </span>
        <span className="text-[11px] font-semibold text-[#2A6496] mt-0.5">
          {formatCurrencyUsd(amountUsd)}
        </span>
        {showRate && bcvRate && (
          <span className="text-[9px] text-[#718096] font-sans mt-0.5">
            BCV: Bs. {bcvRate.toFixed(2)}
          </span>
        )}
      </div>
    );
  }

  // Default 'stacked'
  const primarySize =
    size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : size === 'xs' ? 'text-[11px]' : 'text-sm';
  const secondarySize =
    size === 'xl' ? 'text-sm' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`flex flex-col ${alignClass} font-mono-numbers ${className}`}>
      <div className={`font-bold text-[#1A202C] ${primarySize}`}>
        {formatCurrencyBs(amountBs)}
      </div>
      <div className={`font-semibold text-[#2A6496] ${secondarySize}`}>
        {formatCurrencyUsd(amountUsd)}
      </div>
      {showRate && bcvRate && (
        <div className="text-[10px] text-[#718096] font-sans mt-0.5">
          {rateLabel}: Bs. {bcvRate.toFixed(2)}
        </div>
      )}
    </div>
  );
};
