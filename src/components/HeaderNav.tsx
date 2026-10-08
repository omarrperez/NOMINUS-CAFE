import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { CoffeeMarketPrice } from '../types';
import {
  DollarSign,
  RefreshCw,
  ShieldCheck,
  Landmark,
  Users,
  FileSignature,
  Scale,
  GitCommit,
  BookOpenCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bcvRate: number;
  setBcvRate: (rate: number) => void;
  vaultAvailableUsd: number;
  vaultAvailableBs: number;
  coffeeMarket: CoffeeMarketPrice;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  bcvRate,
  setBcvRate,
  vaultAvailableUsd,
  vaultAvailableBs,
  coffeeMarket,
}) => {
  const [isEditingBcv, setIsEditingBcv] = React.useState(false);
  const [tempBcv, setTempBcv] = React.useState(bcvRate.toFixed(2));

  const navItems = [
    {
      id: 'vault',
      label: 'Bóveda Cambiaria',
      icon: Landmark,
      pastelActiveBg: 'bg-[#EEF8F1] text-[#1E6637] border-[#CBEAD2]',
      pastelBadge: 'bg-[#CBEAD2] text-[#1E6637]',
      accentColor: 'text-[#1E6637]',
    },
    {
      id: 'producers',
      label: 'Padrón Cafetalero',
      icon: Users,
      pastelActiveBg: 'bg-[#FEF9E7] text-[#7C5B00] border-[#FBE6A2]',
      pastelBadge: 'bg-[#FBE6A2] text-[#7C5B00]',
      accentColor: 'text-[#7C5B00]',
    },
    {
      id: 'advances',
      label: 'Anticipos y Contratos',
      icon: FileSignature,
      pastelActiveBg: 'bg-[#FDF0F2] text-[#962842] border-[#FACCD5]',
      pastelBadge: 'bg-[#FACCD5] text-[#962842]',
      accentColor: 'text-[#962842]',
    },
    {
      id: 'harvest',
      label: 'Recepción y Zafra',
      icon: Scale,
      pastelActiveBg: 'bg-[#EBF3FA] text-[#1E4E79] border-[#CFE2F3]',
      pastelBadge: 'bg-[#CFE2F3] text-[#1E4E79]',
      accentColor: 'text-[#1E4E79]',
    },
    {
      id: 'traceability',
      label: 'Cash-Trail & Bancos',
      icon: GitCommit,
      pastelActiveBg: 'bg-[#F4F0FA] text-[#4D337F] border-[#DFD5F5]',
      pastelBadge: 'bg-[#DFD5F5] text-[#4D337F]',
      accentColor: 'text-[#4D337F]',
    },
    {
      id: 'accounting',
      label: 'Contabilidad VEN-NIF',
      icon: BookOpenCheck,
      pastelActiveBg: 'bg-[#EEF8F1] text-[#164E63] border-[#A5F3FC]',
      pastelBadge: 'bg-[#BAE6FD] text-[#0369A1]',
      accentColor: 'text-[#0369A1]',
    },
  ];

  const handleBcvSave = () => {
    const val = parseFloat(tempBcv);
    if (!isNaN(val) && val > 0) {
      setBcvRate(val);
      setIsEditingBcv(false);
    }
  };

  return (
    <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      {/* Top Banner Bar - Soft Pastel Slate with Anti-Fatigue Contrast */}
      <div className="bg-[#2D3748] text-[#EDF2F7] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide text-[#FBE6A2] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FBE6A2]" />
            NOMINUS CAFÉ
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/90 truncate">{COMPANY_INFO.name}</span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="text-white/75 hidden sm:inline">RIF: {COMPANY_INFO.rif}</span>
          <span className="text-white/30 hidden md:inline">·</span>
          <span className="text-white/75 hidden md:inline">{COMPANY_INFO.activeCropCycle}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono-numbers">
          {/* BCV Rate Indicator */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
            <span className="text-[#FBE6A2]">Tasa BCV:</span>
            {isEditingBcv ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.01"
                  value={tempBcv}
                  onChange={(e) => setTempBcv(e.target.value)}
                  className="w-16 px-1 py-0.5 text-slate-900 bg-white rounded text-xs font-mono font-bold"
                />
                <button
                  onClick={handleBcvSave}
                  className="text-xs bg-[#E07A5F] text-white px-1.5 py-0.5 rounded hover:bg-[#d66b50]"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingBcv(true)}
                className="font-bold text-white hover:text-[#FBE6A2] transition-colors flex items-center gap-1 cursor-pointer"
                title="Haga clic para actualizar la tasa oficial BCV"
              >
                Bs. {bcvRate.toFixed(2)} / USD
                <RefreshCw className="w-3 h-3 text-white/60 hover:rotate-180 transition-transform" />
              </button>
            )}
          </div>

          {/* Coffee Market Benchmark */}
          <div className="hidden lg:flex items-center gap-2 text-white/80">
            <span>ICE Arabica: <strong className="text-white">{coffeeMarket.nyCPriceCentsLb}¢/lb</strong></span>
            <span>· Dif. Vzla: <strong className="text-[#CBEAD2]">+{coffeeMarket.venezuelaPremiumUsd} USD/Q</strong></span>
            <span>· Base: <strong className="text-[#FBE6A2]">${coffeeMarket.suggestedBasePriceUsd} USD/Q</strong></span>
          </div>

          <div className="flex items-center gap-1 text-[#CBEAD2] bg-[#1E6637]/30 px-2 py-0.5 rounded text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SENIAT / SUDEBAN Compliant</span>
            <span className="sm:hidden">SENIAT</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D3748] to-[#1A202C] flex items-center justify-center text-[#FEF9E7] font-bold text-lg shadow-xs">
              N
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#1A202C]">
                Nominus Café
              </span>
              <p className="text-[11px] text-[#4A5568] font-medium -mt-1 hidden lg:block">
                Control Cambiario & Anticipos Agrícolas (VEN-NIF)
              </p>
            </div>
          </div>

          {/* Nav Links Zone with Clear Icons and Soft Pastel States */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1.5 scrollbar-thin">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold whitespace-nowrap rounded-lg border transition-all duration-150 cursor-pointer ${
                    isActive
                      ? `${item.pastelActiveBg} shadow-xs font-bold`
                      : 'border-transparent text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.accentColor : 'text-[#718096]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Vault Summary with Soft Pastel Card (Bimonetary) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <div className="bg-[#EEF8F1] border border-[#CBEAD2] px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-[#1E6637] block font-semibold uppercase tracking-wider">
                Bóveda en Divisas Libre (VEN-NIF)
              </span>
              <div className="flex flex-col items-end font-mono-numbers leading-tight">
                <span className="text-sm font-bold text-[#1E6637]">
                  Bs. {vaultAvailableBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] font-semibold text-[#277843] flex items-center gap-0.5">
                  <DollarSign className="w-3 h-3 text-[#E07A5F]" />
                  {vaultAvailableUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
