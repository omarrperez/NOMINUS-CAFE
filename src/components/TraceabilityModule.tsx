import React, { useState } from 'react';
import { BankReconciliationItem, ForeignTransfer, AdvanceContract, HarvestReception } from '../types';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Landmark,
  Search,
  Filter,
  Layers,
  FileCheck,
  Building,
} from 'lucide-react';

interface TraceabilityModuleProps {
  reconciliationItems: BankReconciliationItem[];
  transfers: ForeignTransfer[];
  contracts: AdvanceContract[];
  receptions: HarvestReception[];
  bcvRate: number;
}

export const TraceabilityModule: React.FC<TraceabilityModuleProps> = ({
  reconciliationItems,
  transfers,
  contracts,
  receptions,
  bcvRate,
}) => {
  const [selectedCutFilter, setSelectedCutFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'cashtrail' | 'reconciliation'>('cashtrail');

  // Compute reconciliation totals
  const totalInflows = reconciliationItems
    .filter((i) => i.type === 'INGRESO')
    .reduce((sum, i) => sum + i.amountUsd, 0);

  const totalOutflows = reconciliationItems
    .filter((i) => i.type === 'EGRESO')
    .reduce((sum, i) => sum + i.amountUsd, 0);

  const bankClosingBalance = totalInflows - totalOutflows;
  const reconciledCount = reconciliationItems.filter((i) => i.status === 'CONCILIADO').length;

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Trazabilidad Integral (Cash-Trail) & Conciliación Bancaria
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Pista de auditoría inalterable que conecta cada dólar que ingresa a Venezuela desde bancos
            internacionales hasta su desembolso a caficultores y su liquidación final en la zafra de café,
            garantizando total transparencia ante <strong>SUDEBAN (SIAR LC/FT)</strong> y el <strong>SENIAT</strong>.
          </p>
        </div>

        {/* Segmented view switch */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#D8E2DC] rounded-lg">
          <button
            onClick={() => setActiveSubTab('cashtrail')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'cashtrail'
                ? 'bg-[#3D405B] text-white shadow-xs'
                : 'text-[#3D405B]/70 hover:text-[#3D405B]'
            }`}
          >
            Línea de Trazabilidad (Cash-Trail)
          </button>
          <button
            onClick={() => setActiveSubTab('reconciliation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'reconciliation'
                ? 'bg-[#3D405B] text-white shadow-xs'
                : 'text-[#3D405B]/70 hover:text-[#3D405B]'
            }`}
          >
            Conciliación Bancaria en Tiempo Real
          </button>
        </div>
      </div>

      {activeSubTab === 'cashtrail' ? (
        <div className="space-y-6">
          {/* Visual Cash-Trail Architecture Explanatory Cards */}
          <div className="bg-[#FAF8F5] border border-[#D8E2DC] rounded-xl p-5">
            <h2 className="text-sm font-bold text-[#3D405B] uppercase tracking-wider mb-4">
              Circuito Cerrado de Trazabilidad Monetaria y Agroindustrial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Step 1 - Pastel Blue */}
              <div className="bg-[#EBF3FA] border border-[#CFE2F3] p-3.5 rounded-xl relative shadow-2xs">
                <div className="text-[10px] font-bold text-[#1E4E79] uppercase tracking-wider">Paso 01</div>
                <div className="font-bold text-[#1E4E79] text-xs mt-0.5">Ingreso Exterior SWIFT</div>
                <p className="text-[11px] text-[#2A6496] mt-1 leading-relaxed">
                  Convenio Cambiario N° 1 (Arts. 31, 32 y 57). Remitente exterior clasificado con IA/ML.
                </p>
                <div className="text-[10px] text-[#1E6637] font-semibold mt-2.5 bg-white/70 px-2 py-0.5 rounded inline-block">
                  Justificación Banco
                </div>
              </div>

              {/* Step 2 - Pastel Green */}
              <div className="bg-[#EEF8F1] border border-[#CBEAD2] p-3.5 rounded-xl relative shadow-2xs">
                <div className="text-[10px] font-bold text-[#1E6637] uppercase tracking-wider">Paso 02</div>
                <div className="font-bold text-[#1E6637] text-xs mt-0.5">Bóveda Operativa (80%)</div>
                <p className="text-[11px] text-[#277843] mt-1 leading-relaxed">
                  Retención legal para cubrir insumos y anticipos cafetaleros; 20% intermediado con el BCV.
                </p>
                <div className="text-[10px] text-[#1E6637] font-semibold mt-2.5 bg-white/70 px-2 py-0.5 rounded inline-block">
                  Cta 1110.02 Moneda Ext.
                </div>
              </div>

              {/* Step 3 - Pastel Yellow */}
              <div className="bg-[#FEF9E7] border border-[#FBE6A2] p-3.5 rounded-xl relative shadow-2xs">
                <div className="text-[10px] font-bold text-[#7C5B00] uppercase tracking-wider">Paso 03</div>
                <div className="font-bold text-[#7C5B00] text-xs mt-0.5">Desembolso (CUT)</div>
                <p className="text-[11px] text-[#8A6800] mt-1 leading-relaxed">
                  Contrato de Cosecha Futura (Art. 1.332 CCV), validación RUNOPA, SIGESAI y hash criptográfico.
                </p>
                <div className="text-[10px] text-[#7C5B00] font-semibold mt-2.5 bg-white/70 px-2 py-0.5 rounded inline-block">
                  Activo Cta 1330.01
                </div>
              </div>

              {/* Step 4 - Pastel Lavender */}
              <div className="bg-[#F4F0FA] border border-[#DFD5F5] p-3.5 rounded-xl relative shadow-2xs">
                <div className="text-[10px] font-bold text-[#4D337F] uppercase tracking-wider">Paso 04</div>
                <div className="font-bold text-[#4D337F] text-xs mt-0.5">Recepción Zafra Octubre</div>
                <p className="text-[11px] text-[#5F439B] mt-1 leading-relaxed">
                  Pesaje en beneficio, Guía SICA (SUNAGRO) y cálculo de laboratorio Factor Rendimiento (FR).
                </p>
                <div className="text-[10px] text-[#4D337F] font-semibold mt-2.5 bg-white/70 px-2 py-0.5 rounded inline-block">
                  Inventario Cta 1130.01
                </div>
              </div>

              {/* Step 5 - Pastel Rose */}
              <div className="bg-[#FDF0F2] border border-[#FACCD5] p-3.5 rounded-xl relative shadow-2xs">
                <div className="text-[10px] font-bold text-[#962842] uppercase tracking-wider">Paso 05</div>
                <div className="font-bold text-[#962842] text-xs mt-0.5">Finiquito & SENIAT</div>
                <p className="text-[11px] text-[#B83250] mt-1 leading-relaxed">
                  Amortización de anticipo, ganancia diferencial (NIC 21) y retención 1.5% ISLR exenta de IVA.
                </p>
                <div className="text-[10px] text-[#962842] font-semibold mt-2.5 bg-white/70 px-2 py-0.5 rounded inline-block">
                  Dossier Fiscal Completo
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Cash-Trail Chains (Expanded Cases) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#3D405B]">
              Cadenas Activas de Trazabilidad por Contrato (Fondo Exterior ➔ Caficultor ➔ Cosecha)
            </h3>

            {contracts.map((contract) => {
              const sourceTransfer = transfers.find((t) => t.id === contract.sourceTransferId) || transfers[0];
              const linkedReception = receptions.find((r) => r.cutCode === contract.cutCode);

              return (
                <div
                  key={contract.id}
                  className="bg-white border border-[#D8E2DC] rounded-xl p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F1DE] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3D405B] text-sm">{contract.cutCode}</span>
                      <span className="text-xs text-[#3D405B]/70">·</span>
                      <span className="text-xs font-semibold text-[#3D405B]">{contract.producerName}</span>
                      <span className="text-xs text-[#3D405B]/60">({contract.farmName})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {linkedReception ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          Circuito Completado en Zafra
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[11px]">
                          Fase Pre-Cosecha (Anticipo Activo)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flow Steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-numbers">
                    {/* Origin Inflow */}
                    <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#D8E2DC]/80">
                      <div className="text-[10px] font-bold text-[#3D405B]/70 uppercase tracking-wider">
                        Origen de Fondos (Bóveda Ext.)
                      </div>
                      <div className="font-semibold text-[#3D405B] mt-1">{sourceTransfer.referenceSwift}</div>
                      <div className="text-[#3D405B]/80 font-sans mt-0.5">{sourceTransfer.senderEntity}</div>
                      <div className="text-[#3D405B]/60 font-sans text-[11px]">
                        Banco en Vzla: {sourceTransfer.destinationBankVzla}
                      </div>
                      <div className="mt-2 text-emerald-700 font-bold">
                        Bóveda: {formatCurrencyUsd(sourceTransfer.amountUsd)}
                      </div>
                    </div>

                    {/* Advance Disbursed */}
                    <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#D8E2DC]/80">
                      <div className="text-[10px] font-bold text-[#3D405B]/70 uppercase tracking-wider">
                        Desembolso al Productor
                      </div>
                      <div className="font-semibold text-[#3D405B] mt-1 font-sans">
                        {contract.contractNumber} (Art. 1.332 CCV)
                      </div>
                      <div className="text-[#3D405B]/80 font-sans mt-0.5">
                        RUNOPA: {contract.runopaId}
                      </div>
                      <div className="text-[#3D405B]/60 text-[11px] truncate">
                        {contract.bankRef}
                      </div>
                      <div className="mt-2 text-[#E07A5F] font-bold">
                        Anticipo: {formatCurrencyUsd(contract.amountUsd)} ({formatCurrencyBs(contract.amountBs)})
                      </div>
                    </div>

                    {/* Final Settlement or Pending */}
                    <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#D8E2DC]/80">
                      <div className="text-[10px] font-bold text-[#3D405B]/70 uppercase tracking-wider">
                        Cierre en Zafra / Cosecha
                      </div>
                      {linkedReception ? (
                        <>
                          <div className="font-semibold text-[#3D405B] mt-1">
                            {linkedReception.sicaGuideNum}
                          </div>
                          <div className="text-[#3D405B]/80 mt-0.5">
                            Entregado: {linkedReception.quintalsDelivered} Q CPS · FR: {linkedReception.yieldFactorFr}
                          </div>
                          <div className="text-emerald-700 text-[11px] mt-0.5">
                            Dif. Cambiario: +{formatCurrencyBs(linkedReception.exchangeGainBs)}
                          </div>
                          <div className="mt-2 text-[#3D405B] font-bold">
                            Neto Pagado: {formatCurrencyBs(linkedReception.netPayableBs)}
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-[#3D405B]/60 font-sans italic text-center">
                          Esperando entrega en planta entre 01 de Octubre y 28 de Febrero.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#3D405B]/70 pt-2 border-t border-[#F4F1DE]">
                    <span>
                      Hash Criptográfico de Auditoría:{' '}
                      <strong className="font-mono text-[#3D405B]">{contract.offlineHashSha256}</strong>
                    </span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verificado ante el SENIAT y Banco
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Reconciliation Sub-Tab */
        <div className="space-y-6">
          {/* Reconciliation Metric Strip - Soft Pastel Palette (Bimonetario) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Total Entradas Bancarias - Pastel Green */}
            <div className="bg-[#EEF8F1] border border-[#CBEAD2] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#1E6637] font-semibold uppercase tracking-wider text-[10px]">
                Total Entradas Bancarias
              </div>
              <div className="text-xl font-bold text-[#1E6637] font-mono-numbers mt-1">
                {formatCurrencyBs(totalInflows * bcvRate)}
              </div>
              <div className="text-xs font-semibold text-[#277843] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(totalInflows)}
              </div>
              <div className="text-[11px] text-[#2D6A4F] mt-2 border-t border-[#CBEAD2]/70 pt-1.5 font-medium">
                Transferencias SWIFT del exterior
              </div>
            </div>

            {/* Total Salidas Bancarias - Pastel Rose */}
            <div className="bg-[#FDF0F2] border border-[#FACCD5] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#962842] font-semibold uppercase tracking-wider text-[10px]">
                Total Salidas Anticipos
              </div>
              <div className="text-xl font-bold text-[#962842] font-mono-numbers mt-1">
                {formatCurrencyBs(totalOutflows * bcvRate)}
              </div>
              <div className="text-xs font-semibold text-[#B83250] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(totalOutflows)}
              </div>
              <div className="text-[11px] text-[#962842]/85 mt-2 border-t border-[#FACCD5]/70 pt-1.5 font-medium">
                Desembolsos autorizados a productores
              </div>
            </div>

            {/* Saldo Cierre Bancario - Pastel Blue */}
            <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#1E4E79] font-semibold uppercase tracking-wider text-[10px]">
                Saldo Cierre Bancario
              </div>
              <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers mt-1">
                {formatCurrencyBs(bankClosingBalance * bcvRate)}
              </div>
              <div className="text-xs font-semibold text-[#2A6496] font-mono-numbers mt-0.5">
                {formatCurrencyUsd(bankClosingBalance)}
              </div>
              <div className="text-xs text-[#1E6637] mt-2 border-t border-[#CFE2F3]/70 pt-1.5 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Coincide con Libro Mayor (Cta 1110)
              </div>
            </div>

            {/* Partidas Conciliadas - Pastel Yellow */}
            <div className="bg-[#FEF9E7] border border-[#FBE6A2] rounded-2xl p-4.5 shadow-xs">
              <div className="text-xs text-[#7C5B00] font-semibold uppercase tracking-wider text-[10px]">
                Partidas Conciliadas
              </div>
              <div className="text-xl font-bold text-[#7C5B00] font-mono-numbers mt-1">
                {reconciledCount} / {reconciliationItems.length}
              </div>
              <div className="text-xs font-semibold text-[#7C5B00] font-mono-numbers mt-0.5">
                100% Conciliado
              </div>
              <div className="text-xs text-[#8A6800] mt-2 border-t border-[#FBE6A2]/70 pt-1.5 font-medium">
                Auditoría continua en tiempo real
              </div>
            </div>
          </div>

          {/* Bank Ledger Table */}
          <div className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#D8E2DC] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#3D405B]">
                Extracto Bancario en Divisas vs. Asientos Contables Registrados (Bimonetario)
              </h2>
              <span className="text-xs text-[#3D405B]/70 font-mono-numbers">
                Cuentas en Moneda Extranjera (BNC, Banesco, BDV) · Tasa BCV: Bs. {bcvRate.toFixed(2)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#3D405B] border-b border-[#D8E2DC] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Fecha & Ref Bancaria</th>
                    <th className="py-3 px-4">Descripción del Movimiento</th>
                    <th className="py-3 px-4">Tipo & Categoría</th>
                    <th className="py-3 px-4 text-right">Monto Bimonetario (Bs. / USD)</th>
                    <th className="py-3 px-4">Asiento Contable Vinculado</th>
                    <th className="py-3 px-4 text-center">Estatus Conciliación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1DE] font-mono-numbers">
                  {reconciliationItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#3D405B]">{item.date}</div>
                        <div className="text-[11px] text-[#3D405B]/70 font-mono">{item.reference}</div>
                      </td>

                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-medium text-[#3D405B]">{item.description}</div>
                      </td>

                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`font-semibold text-[11px] ${
                            item.type === 'INGRESO' ? 'text-emerald-700' : 'text-[#E07A5F]'
                          }`}
                        >
                          {item.type === 'INGRESO' ? '▲ Ingreso' : '▼ Egreso'}
                        </span>
                        <div className="text-[10px] text-[#3D405B]/60 mt-0.5">{item.category}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div
                          className={`font-bold text-sm ${
                            item.type === 'INGRESO' ? 'text-[#1E6637]' : 'text-[#962842]'
                          }`}
                        >
                          {item.type === 'INGRESO' ? '+' : '-'} {formatCurrencyBs(item.amountBs || (item.amountUsd * (item.bcvRate || bcvRate)))}
                        </div>
                        <div className="text-xs font-semibold text-[#4A5568]">
                          {item.type === 'INGRESO' ? '+' : '-'} {formatCurrencyUsd(item.amountUsd)}
                        </div>
                        <div className="text-[10px] text-[#718096]">
                          Tasa BCV: Bs. {(item.bcvRate || bcvRate).toFixed(2)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-[#3D405B] font-semibold">{item.bookSeatNumber}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-sans">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
