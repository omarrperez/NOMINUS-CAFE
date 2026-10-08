import React, { useState } from 'react';
import { AdvanceContract, HarvestReception } from '../types';
import { calculateYieldFactor } from '../utils/agronomicEngine';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  Scale,
  FlaskConical,
  Receipt,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface HarvestModuleProps {
  receptions: HarvestReception[];
  activeContracts: AdvanceContract[];
  bcvRate: number;
  onAddReception: (reception: HarvestReception) => void;
}

export const HarvestModule: React.FC<HarvestModuleProps> = ({
  receptions,
  activeContracts,
  bcvRate,
  onAddReception,
}) => {
  const [showNewReception, setShowNewReception] = useState<boolean>(false);
  const eligibleContracts = activeContracts.filter((c) => c.status === 'ACTIVO_PENDIENTE');

  // Form states
  const [selectedContractId, setSelectedContractId] = useState<string>(eligibleContracts[0]?.id || '');
  const [sicaGuide, setSicaGuide] = useState<string>('SICA-SUNAGRO-2026-');
  const [deliveredQuintals, setDeliveredQuintals] = useState<number>(45);
  const [pasillaGrams, setPasillaGrams] = useState<number>(3.12);
  const [brocaGrams, setBrocaGrams] = useState<number>(8.79);
  const [settlementPriceUsd, setSettlementPriceUsd] = useState<number>(150);

  const selectedContract = activeContracts.find((c) => c.id === selectedContractId) || eligibleContracts[0];

  // Live calculation of yield factor
  const yieldResult = calculateYieldFactor(pasillaGrams, brocaGrams, 250);

  // Settlement financial math
  const grossValueUsd = Number((deliveredQuintals * settlementPriceUsd).toFixed(2));
  const grossValueBs = Number((grossValueUsd * bcvRate).toFixed(2));

  // Amortization of advance
  const advanceToAmortizeUsd = selectedContract
    ? Math.min(selectedContract.balancePendingUsd, grossValueUsd)
    : 0;

  const historicalAdvanceBs = selectedContract
    ? Number((advanceToAmortizeUsd * selectedContract.bcvRateAtIssue).toFixed(2))
    : 0;

  const reexpressedAdvanceBs = Number((advanceToAmortizeUsd * bcvRate).toFixed(2));
  const exchangeGainBs = Number((reexpressedAdvanceBs - historicalAdvanceBs).toFixed(2));

  // SENIAT: 1.5% ISLR withholding on primary agricultural purchase (Exempt of IVA)
  const islrWithholdingBs = Number((grossValueBs * 0.015).toFixed(2));
  const islrWithholdingUsd = Number((islrWithholdingBs / bcvRate).toFixed(2));

  // Net payable to producer
  const netPayableBs = Number((grossValueBs - reexpressedAdvanceBs - islrWithholdingBs).toFixed(2));
  const netPayableUsd = Number((grossValueUsd - advanceToAmortizeUsd - islrWithholdingUsd).toFixed(2));

  const handleSaveReception = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    const newRec: HarvestReception = {
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      contractId: selectedContract.id,
      cutCode: selectedContract.cutCode,
      producerName: selectedContract.producerName,
      sicaGuideNum: sicaGuide.length > 15 ? sicaGuide : `SICA-SUNAGRO-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      quintalsDelivered: deliveredQuintals,
      sampleWeightGrams: 250,
      pasillaGrams,
      brocaGrams,
      cleanAlmondGrams: yieldResult.cleanAlmondGrams,
      yieldFactorFr: yieldResult.yieldFactorFr,
      qualityGrade: yieldResult.qualityClassification,
      settlementPricePerQUsd: settlementPriceUsd,
      grossValueUsd,
      bcvRateSettlement: bcvRate,
      grossValueBs,
      amortizedAdvanceUsd: advanceToAmortizeUsd,
      historicalAdvanceRate: selectedContract.bcvRateAtIssue,
      historicalAdvanceBs,
      reexpressedAdvanceBs,
      exchangeGainBs,
      islrRate: 0.015,
      islrWithholdingBs,
      netPayableUsd,
      netPayableBs,
      paymentBankRef: `Liquidación Zafra Ref N° 00${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'LIQUIDADO',
    };

    onAddReception(newRec);
    setShowNewReception(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Recepción en Beneficio & Liquidación Zafra de Cosecha (Octubre)
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Protocolo de recepción de Café Pergamino Seco (CPS) con <strong>Guía SICA (SUNAGRO)</strong>,
            determinación de laboratorio del <strong>Factor de Rendimiento (FR)</strong>, amortización del
            anticipo otorgado, reconocimiento de <strong>Diferencial Cambiario (NIC 21)</strong> y aplicación
            de la <strong>Retención de ISLR del 1.5%</strong> ante el SENIAT.
          </p>
        </div>

        <button
          onClick={() => setShowNewReception(!showNewReception)}
          disabled={eligibleContracts.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {showNewReception ? 'Cerrar Formulario' : 'Recibir Cosecha & Liquidar'}
        </button>
      </div>

      {/* KPI Cards - Soft Pastel Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Café Pergamino Recibido - Soft Pastel Blue */}
        <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#1E4E79] font-semibold uppercase tracking-wider text-[10px]">
            Café Pergamino Recibido
          </div>
          <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers mt-1">
            {receptions.reduce((sum, r) => sum + r.quintalsDelivered, 0).toFixed(2)} Q
          </div>
          <div className="text-xs text-[#2A6496] mt-1 font-medium">Ingresado a Almacén de Beneficio (Cta 1130.01)</div>
        </div>

        {/* Diferencial Cambiario Ganado - Soft Pastel Green */}
        <div className="bg-[#EEF8F1] border border-[#CBEAD2] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#1E6637] font-semibold uppercase tracking-wider text-[10px]">
            Diferencial Cambiario Ganado (NIC 21)
          </div>
          <div className="text-xl font-bold text-[#1E6637] font-mono-numbers mt-1 flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-[#1E6637]" />
            {formatCurrencyBs(receptions.reduce((sum, r) => sum + r.exchangeGainBs, 0))}
          </div>
          <div className="text-xs font-semibold text-[#277843] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(receptions.reduce((sum, r) => sum + r.exchangeGainBs, 0) / bcvRate)}
          </div>
          <div className="text-xs text-[#277843] mt-2 border-t border-[#CBEAD2]/70 pt-1.5 font-medium">
            Reexpresión anticipos a tasa de cierre (Cta 7120.01)
          </div>
        </div>

        {/* Retenciones ISLR 1.5% SENIAT - Soft Pastel Rose */}
        <div className="bg-[#FDF0F2] border border-[#FACCD5] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#962842] font-semibold uppercase tracking-wider text-[10px]">
            Retenciones ISLR 1.5% SENIAT
          </div>
          <div className="text-xl font-bold text-[#962842] font-mono-numbers mt-1">
            {formatCurrencyBs(receptions.reduce((sum, r) => sum + r.islrWithholdingBs, 0))}
          </div>
          <div className="text-xs font-semibold text-[#B83250] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(receptions.reduce((sum, r) => sum + r.islrWithholdingBs, 0) / bcvRate)}
          </div>
          <div className="text-xs text-[#B83250] mt-2 border-t border-[#FACCD5]/70 pt-1.5 font-medium">
            Adquisición agrícola primaria exenta de IVA
          </div>
        </div>
      </div>

      {/* Reception & Settlement Form */}
      {showNewReception && selectedContract && (
        <div className="bg-white border border-[#D8E2DC] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D8E2DC]">
            <Scale className="w-5 h-5 text-[#E07A5F]" />
            <h2 className="text-base font-bold text-[#3D405B]">
              Recepción en Planta de Beneficio & Liquidación Definitiva de Finiquito
            </h2>
          </div>

          <form onSubmit={handleSaveReception} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Contrato y Pesaje */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <span className="font-bold text-[#3D405B] uppercase tracking-wider block text-[11px]">
                  1. Contrato & Guía SICA
                </span>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Seleccionar Contrato de Anticipo
                  </label>
                  <select
                    value={selectedContractId}
                    onChange={(e) => setSelectedContractId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white text-xs"
                  >
                    {eligibleContracts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cutCode} - {c.producerName} (${c.balancePendingUsd} USD pendiente)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Número de Guía Única SICA (SUNAGRO)
                  </label>
                  <input
                    type="text"
                    required
                    value={sicaGuide}
                    onChange={(e) => setSicaGuide(e.target.value)}
                    placeholder="SICA-SUNAGRO-2026-XXXXXX"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Masa Física Entregada (Quintales Pergamino Seco)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={deliveredQuintals}
                    onChange={(e) => setDeliveredQuintals(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Precio Convenido de Liquidación (USD/Q)
                  </label>
                  <input
                    type="number"
                    value={settlementPriceUsd}
                    onChange={(e) => setSettlementPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  />
                </div>
              </div>

              {/* Col 2: Laboratorio Físico 250g (FR) */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#3D405B] uppercase tracking-wider text-[11px]">
                  <FlaskConical className="w-4 h-4 text-[#E07A5F]" />
                  <span>2. Laboratorio Físico (Muestra 250g)</span>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Merma por Pasilla (Gramos en 250g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pasillaGrams}
                    onChange={(e) => setPasillaGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Daño por Broca (Gramos en 250g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={brocaGrams}
                    onChange={(e) => setBrocaGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  />
                </div>

                <div className="p-3 bg-white border border-[#D8E2DC] rounded-md space-y-1.5 font-mono-numbers">
                  <div className="flex justify-between">
                    <span className="text-[#3D405B]/70">Almendra Sana (A_sana):</span>
                    <strong>{yieldResult.cleanAlmondGrams.toFixed(2)} g</strong>
                  </div>
                  <div className="flex justify-between text-[#3D405B]">
                    <span className="font-semibold">Factor Rendimiento (FR):</span>
                    <strong className="text-sm font-bold text-[#3D405B]">
                      {yieldResult.yieldFactorFr} kg CPS/saco
                    </strong>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-sans font-semibold pt-1 border-t border-[#D8E2DC]">
                    {yieldResult.evaluationNotes}
                  </div>
                </div>
              </div>

              {/* Col 3: Finiquito & Liquidación VEN-NIF */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <span className="font-bold text-[#3D405B] uppercase tracking-wider block text-[11px]">
                  3. Liquidación Contable & Fiscal
                </span>

                <div className="p-3 bg-white border border-[#D8E2DC] rounded-md space-y-2 font-mono-numbers">
                  <div className="flex justify-between">
                    <span className="text-[#3D405B]/70">Valor Bruto Cosecha (USD):</span>
                    <strong>{formatCurrencyUsd(grossValueUsd)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3D405B]/70">Valor Bruto a Tasa BCV ({bcvRate}):</span>
                    <strong>{formatCurrencyBs(grossValueBs)}</strong>
                  </div>
                  <div className="flex justify-between text-[#E07A5F]">
                    <span>Amortización Anticipo ({selectedContract.cutCode}):</span>
                    <span>- {formatCurrencyUsd(advanceToAmortizeUsd)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 text-[11px]">
                    <span>Ganancia Diferencial (NIC 21):</span>
                    <span>+ {formatCurrencyBs(exchangeGainBs)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800 text-[11px]">
                    <span>Retención 1.5% ISLR SENIAT:</span>
                    <span>- {formatCurrencyBs(islrWithholdingBs)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#3D405B] border-t border-[#D8E2DC] pt-1.5">
                    <span>Saldo Neto a Pagar al Caficultor:</span>
                    <span>{formatCurrencyBs(netPayableBs)}</span>
                  </div>
                  <div className="text-[10px] text-right text-[#3D405B]/70">
                    ≈ {formatCurrencyUsd(netPayableUsd)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8E2DC]">
              <button
                type="button"
                onClick={() => setShowNewReception(false)}
                className="px-4 py-2 border border-[#D8E2DC] text-[#3D405B] text-xs rounded-lg hover:bg-[#FAF8F5]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Procesar Liquidación & Asiento VEN-NIF
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table: Receptions */}
      <div className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#D8E2DC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#3D405B]">
            Historial de Recepción y Liquidaciones de Zafra
          </h2>
          <span className="text-xs text-[#3D405B]/70 font-mono-numbers">
            {receptions.length} recepciones registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#3D405B] border-b border-[#D8E2DC] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fecha & Guía SICA</th>
                <th className="py-3 px-4">Productor & Código CUT</th>
                <th className="py-3 px-4 text-right">Volumen & Factor (FR)</th>
                <th className="py-3 px-4 text-right">Valor Bruto (USD/Bs.)</th>
                <th className="py-3 px-4 text-right">Amortización Anticipo</th>
                <th className="py-3 px-4 text-right">Dif. Cambiario & ISLR</th>
                <th className="py-3 px-4 text-right">Neto Cancelado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1DE] font-mono-numbers">
              {receptions.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#3D405B]">{item.date}</div>
                    <div className="text-[11px] text-[#3D405B]/70 font-mono">{item.sicaGuideNum}</div>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-[#3D405B]">{item.producerName}</div>
                    <div className="text-[11px] text-[#3D405B]/70 font-mono">{item.cutCode}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-bold text-[#3D405B] text-sm">
                      {item.quintalsDelivered.toFixed(2)} Q
                    </div>
                    <div className="text-[11px] text-[#3D405B]/70">
                      FR: {item.yieldFactorFr} ({item.qualityGrade})
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-bold text-[#3D405B]">
                      {formatCurrencyUsd(item.grossValueUsd)}
                    </div>
                    <div className="text-[11px] text-[#3D405B]/60">
                      {formatCurrencyBs(item.grossValueBs)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-semibold text-[#E07A5F]">
                      - {formatCurrencyUsd(item.amortizedAdvanceUsd)}
                    </div>
                    <div className="text-[10px] text-[#3D405B]/60">
                      Histórico: {formatCurrencyBs(item.historicalAdvanceBs)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="text-emerald-700 font-semibold text-[11px]">
                      + {formatCurrencyBs(item.exchangeGainBs)} (NIC 21)
                    </div>
                    <div className="text-amber-800 text-[11px]">
                      - {formatCurrencyBs(item.islrWithholdingBs)} (1.5% ISLR)
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-bold text-[#3D405B] text-sm">
                      {formatCurrencyBs(item.netPayableBs)}
                    </div>
                    <div className="text-[10px] text-[#3D405B]/70">
                      ≈ {formatCurrencyUsd(item.netPayableUsd)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
