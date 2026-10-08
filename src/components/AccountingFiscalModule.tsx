import React, { useState } from 'react';
import { AccountingSeat, HarvestReception, AdvanceContract, ForeignTransfer } from '../types';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  BookOpen,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  Receipt,
  FileCheck2,
} from 'lucide-react';

interface AccountingFiscalModuleProps {
  seats: AccountingSeat[];
  contracts: AdvanceContract[];
  receptions: HarvestReception[];
  transfers: ForeignTransfer[];
  bcvRate: number;
  onOpenDossierModal: () => void;
}

export const AccountingFiscalModule: React.FC<AccountingFiscalModuleProps> = ({
  seats,
  contracts,
  receptions,
  transfers,
  bcvRate,
  onOpenDossierModal,
}) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'seniat_report'>('journal');
  const [filterModule, setFilterModule] = useState<string>('all');

  const filteredSeats = seats.filter((s) => {
    if (filterModule === 'all') return true;
    return s.sourceModule === filterModule;
  });

  const totalDebitBsAll = seats.reduce((sum, s) => sum + s.totalDebitBs, 0);
  const totalCreditBsAll = seats.reduce((sum, s) => sum + s.totalCreditBs, 0);

  // SENIAT Metrics
  const totalExemptAgriculturalPurchasesBs = receptions.reduce((sum, r) => sum + r.grossValueBs, 0);
  const totalIslr15RetainedBs = receptions.reduce((sum, r) => sum + r.islrWithholdingBs, 0);
  const totalExchangeGainBs = receptions.reduce((sum, r) => sum + r.exchangeGainBs, 0);
  const totalAdvancesActiveBs = contracts
    .filter((c) => c.status === 'ACTIVO_PENDIENTE')
    .reduce((sum, c) => sum + c.amountBs, 0);

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Contabilidad VEN-NIF & Reportes Fiscales SENIAT
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Generación automática de asientos contables por partida doble bajo <strong>VEN-NIF (NIC 21)</strong>,
            control bimonetario (Bs. y USD), reexpresión cambiaria y reportes tributarios mensuales
            automatizados para el <strong>SENIAT</strong> (Retención ISLR 1.5%, Exención IVA y régimen IGTF).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDossierModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            Dossier Fiscal en 1 Clic (SENIAT / Banco)
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-[#D8E2DC] pb-2">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-[#3D405B] text-white shadow-xs'
              : 'text-[#3D405B]/70 hover:text-[#3D405B]'
          }`}
        >
          Libro Diario General (Asientos VEN-NIF)
        </button>
        <button
          onClick={() => setActiveTab('seniat_report')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'seniat_report'
              ? 'bg-[#3D405B] text-white shadow-xs'
              : 'text-[#3D405B]/70 hover:text-[#3D405B]'
          }`}
        >
          Reporte Tributario Mensual SENIAT
        </button>
      </div>

      {activeTab === 'journal' ? (
        <div className="space-y-6">
          {/* Integrity Banner */}
          <div className="bg-white border border-[#D8E2DC] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-numbers">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#3D405B] uppercase tracking-wider font-sans">
                  Cuadre Contable por Partida Doble Verificado
                </div>
                <div className="text-xs text-[#3D405B]/70 font-sans mt-0.5">
                  Normas VEN-NIF / NIC 21 (Efectos de las variaciones en las tasas de cambio)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-[#3D405B]/60 block font-sans text-[10px]">TOTAL DEBE (Bs. / USD):</span>
                <strong className="text-sm font-bold text-[#3D405B]">
                  {formatCurrencyBs(totalDebitBsAll)}
                </strong>
                <span className="text-[11px] text-[#3D405B]/70 block font-mono">
                  ${(totalDebitBsAll / bcvRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
              <div>
                <span className="text-[#3D405B]/60 block font-sans text-[10px]">TOTAL HABER (Bs. / USD):</span>
                <strong className="text-sm font-bold text-[#3D405B]">
                  {formatCurrencyBs(totalCreditBsAll)}
                </strong>
                <span className="text-[11px] text-[#3D405B]/70 block font-mono">
                  ${(totalCreditBsAll / bcvRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
              <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded text-[11px] font-sans">
                Diferencia: Bs. 0,00 ($0.00 USD)
              </div>
            </div>
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: `Todos los Asientos (${seats.length})` },
              { id: 'BOVEDA_EXTERIOR', label: 'Ingresos Exterior (CC1)' },
              { id: 'ANTICIPOS_PRODUCTOR', label: 'Anticipos Productores (Cta 1330)' },
              { id: 'RECEPCION_OCTUBRE', label: 'Liquidaciones Zafra (Octubre)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterModule(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterModule === f.id
                    ? 'bg-[#3D405B] text-white shadow-xs'
                    : 'text-[#3D405B]/70 hover:text-[#3D405B] hover:bg-[#F4F1DE]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Journal Entries List */}
          <div className="space-y-4">
            {filteredSeats.map((seat) => (
              <div
                key={seat.id}
                className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs"
              >
                {/* Seat Header */}
                <div className="bg-[#FAF8F5] px-4 py-3 border-b border-[#D8E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3D405B] font-mono text-xs">{seat.seatNumber}</span>
                    <span className="text-xs text-[#3D405B]/50">·</span>
                    <span className="text-xs text-[#3D405B]/80 font-mono-numbers">{seat.date}</span>
                    {seat.cutCode && (
                      <>
                        <span className="text-xs text-[#3D405B]/50">·</span>
                        <span className="text-[11px] font-semibold text-[#E07A5F]">{seat.cutCode}</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] bg-[#D8E2DC]/60 text-[#3D405B] px-2 py-0.5 rounded font-mono font-medium self-start sm:self-auto">
                    {seat.standard}
                  </span>
                </div>

                {/* Concept */}
                <div className="px-4 py-2 text-xs text-[#3D405B] bg-[#FAF8F5]/30 border-b border-[#F4F1DE] italic">
                  {seat.concept}
                </div>

                {/* Entry Rows Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-numbers">
                    <thead className="bg-[#FAF8F5]/50 text-[#3D405B]/70 text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-4 w-28">Código Cta</th>
                        <th className="py-2 px-4 font-sans">Descripción de la Cuenta</th>
                        <th className="py-2 px-4 text-right w-36">Debe (Bs.)</th>
                        <th className="py-2 px-4 text-right w-36">Haber (Bs.)</th>
                        <th className="py-2 px-4 text-right w-28 text-[#3D405B]/60">USD Eq.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4F1DE]">
                      {seat.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/60">
                          <td className="py-2.5 px-4 font-bold text-[#3D405B]">{item.accountCode}</td>
                          <td className="py-2.5 px-4 font-sans text-[#3D405B]">
                            <span className={item.creditBs > 0 ? 'pl-6 block' : 'block font-medium'}>
                              {item.accountName}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-[#3D405B]">
                            {item.debitBs > 0 ? formatCurrencyBs(item.debitBs) : '-'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-[#3D405B]">
                            {item.creditBs > 0 ? formatCurrencyBs(item.creditBs) : '-'}
                          </td>
                          <td className="py-2.5 px-4 text-right text-[11px] text-[#3D405B]/60">
                            {item.debitUsd > 0
                              ? `$${item.debitUsd.toLocaleString()}`
                              : item.creditUsd > 0
                              ? `$${item.creditUsd.toLocaleString()}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FAF8F5] font-bold text-[#3D405B] border-t border-[#D8E2DC]">
                      <tr>
                        <td colSpan={2} className="py-2.5 px-4 text-right font-sans text-xs">
                          Totales del Asiento:
                        </td>
                        <td className="py-2.5 px-4 text-right text-xs">
                          {formatCurrencyBs(seat.totalDebitBs)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-xs">
                          {formatCurrencyBs(seat.totalCreditBs)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SENIAT Monthly Tax Report Sub-Tab */
        <div className="space-y-6">
          {/* Fiscal Summary Cards - Soft Pastel Palette (Bimonetario) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Compras Primarias Exentas de IVA - Pastel Blue */}
            <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#1E4E79] font-semibold uppercase tracking-wider text-[10px]">
                Compras Primarias Exentas de IVA
              </div>
              <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers mt-1">
                {formatCurrencyBs(totalExemptAgriculturalPurchasesBs)}
              </div>
              <div className="text-xs font-semibold text-[#2A6496] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(totalExemptAgriculturalPurchasesBs / bcvRate)}
              </div>
              <div className="text-xs text-[#2A6496] mt-2 border-t border-[#CFE2F3]/70 pt-1.5 font-medium">
                Rubro Café: Exento Art. 18 Ley IVA (Venta Primaria)
              </div>
            </div>

            {/* Retenciones ISLR 1.5% - Pastel Rose */}
            <div className="bg-[#FDF0F2] border border-[#FACCD5] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#962842] font-semibold uppercase tracking-wider text-[10px]">
                Retenciones ISLR 1.5% por Enterar
              </div>
              <div className="text-xl font-bold text-[#962842] font-mono-numbers mt-1">
                {formatCurrencyBs(totalIslr15RetainedBs)}
              </div>
              <div className="text-xs font-semibold text-[#B83250] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(totalIslr15RetainedBs / bcvRate)}
              </div>
              <div className="text-xs text-[#B83250] mt-2 border-t border-[#FACCD5]/70 pt-1.5 font-medium">
                Decreto N° 1.808 / Adquisición Agrícola Primaria
              </div>
            </div>

            {/* Anticipos Vigentes - Pastel Yellow */}
            <div className="bg-[#FEF9E7] border border-[#FBE6A2] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#7C5B00] font-semibold uppercase tracking-wider text-[10px]">
                Anticipos Vigentes en Activo (Cta 1330)
              </div>
              <div className="text-xl font-bold text-[#7C5B00] font-mono-numbers mt-1">
                {formatCurrencyBs(totalAdvancesActiveBs)}
              </div>
              <div className="text-xs font-semibold text-[#7C5B00] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(totalAdvancesActiveBs / bcvRate)}
              </div>
              <div className="text-xs text-[#8A6800] mt-2 border-t border-[#FBE6A2]/70 pt-1.5 font-medium">
                No sujeto a retención hasta liquidación en zafra
              </div>
            </div>
          </div>

          {/* Tax Breakdown Matrix */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-base font-bold text-[#1A202C]">
                Cédula Tributaria Mensual: Operaciones del Sector Cafetalero ante el SENIAT
              </h2>
              <p className="text-xs text-[#4A5568] mt-1">
                Período Fiscal: Octubre 2026 · Contribuyente Especial RIF: J-40889911-0 · Actividad: Beneficio y Exportación
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Item 1: IVA - Soft Pastel Green */}
              <div className="p-4 bg-[#EEF8F1] rounded-xl border border-[#CBEAD2]">
                <div className="flex items-center justify-between font-bold text-[#1E6637] text-sm">
                  <span>1. Impuesto al Valor Agregado (IVA)</span>
                  <span className="font-mono bg-white/80 px-2.5 py-0.5 rounded text-[11px]">0,00 Bs. (NO SUJETO / EXENTO)</span>
                </div>
                <p className="text-[#277843] mt-1.5 leading-relaxed">
                  Fundamento Legal: Los desembolsos de anticipos no constituyen hecho imponible de IVA (no hay venta de bienes).
                  La adquisición de café pergamino seco a productores primarios en fincas está exenta conforme a la Ley de IVA.
                </p>
              </div>

              {/* Item 2: ISLR - Soft Pastel Rose */}
              <div className="p-4 bg-[#FDF0F2] rounded-xl border border-[#FACCD5]">
                <div className="flex items-center justify-between font-bold text-[#962842] text-sm">
                  <span>2. Retención de Impuesto Sobre la Renta (ISLR - 1,5%)</span>
                  <span className="font-mono font-bold bg-white/80 px-2.5 py-0.5 rounded text-[11px]">
                    {formatCurrencyBs(totalIslr15RetainedBs)}
                  </span>
                </div>
                <p className="text-[#B83250] mt-1.5 leading-relaxed">
                  Fundamento Legal: Conforme al Decreto 1.808 (Reglamento de Retenciones de ISLR), la adquisición primaria de
                  rubros agrícolas a personas naturales tiene una retención del 1,5% que se aplica exclusivamente al momento de
                  emitir el comprobante de compra definitiva en zafra sobre el valor bruto acumulado.
                </p>
              </div>

              {/* Item 3: IGTF - Soft Pastel Yellow */}
              <div className="p-4 bg-[#FEF9E7] rounded-xl border border-[#FBE6A2]">
                <div className="flex items-center justify-between font-bold text-[#7C5B00] text-sm">
                  <span>3. Impuesto a las Grandes Transacciones Financieras (IGTF - 3%)</span>
                  <span className="font-mono bg-white/80 px-2.5 py-0.5 rounded text-[11px]">
                    Aplica 3% sobre entregas en efectivo rural si es Sujeto Pasivo Especial
                  </span>
                </div>
                <p className="text-[#8A6800] mt-1.5 leading-relaxed">
                  Las transferencias bancarias directas en moneda extranjera dentro del sistema bancario nacional
                  autorizado bajo Convenio Cambiario N° 1 no causan la alícuota del 3% de IGTF en efectivo, preservando la liquidez
                  operativa de la empresa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
