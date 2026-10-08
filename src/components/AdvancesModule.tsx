import React, { useState } from 'react';
import { Producer, AdvanceContract, ForeignTransfer } from '../types';
import { calculateAdvanceCeiling, generateDigitalActaHash } from '../utils/agronomicEngine';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  FileText,
  Calculator,
  ShieldCheck,
  Fingerprint,
  PlusCircle,
  Hash,
  AlertTriangle,
} from 'lucide-react';

interface AdvancesModuleProps {
  contracts: AdvanceContract[];
  producers: Producer[];
  transfers: ForeignTransfer[];
  bcvRate: number;
  onAddContract: (contract: AdvanceContract) => void;
  onOpenContractModal: (contract: AdvanceContract) => void;
  selectedProducerForAdvance?: Producer | null;
  onClearSelectedProducer: () => void;
}

export const AdvancesModule: React.FC<AdvancesModuleProps> = ({
  contracts,
  producers,
  transfers,
  bcvRate,
  onAddContract,
  onOpenContractModal,
  selectedProducerForAdvance,
  onClearSelectedProducer,
}) => {
  const [showGenerator, setShowGenerator] = useState<boolean>(!!selectedProducerForAdvance);
  const [selectedProdId, setSelectedProdId] = useState<string>(
    selectedProducerForAdvance?.id || (producers[0]?.id || '')
  );

  // Form states for agro-economic motor
  const [basePriceUsd, setBasePriceUsd] = useState<number>(150);
  const [alphaCoverage, setAlphaCoverage] = useState<number>(0.40);
  const [requestedAmountUsd, setRequestedAmountUsd] = useState<number>(3000);
  const [paymentMethod, setPaymentMethod] = useState<'TRANSFERENCIA_BANCARIA' | 'EFECTIVO_CAMPO'>('TRANSFERENCIA_BANCARIA');
  const [selectedTransferId, setSelectedTransferId] = useState<string>(transfers[0]?.id || '');
  const [notes, setNotes] = useState<string>('Anticipo para labores de manejo agronómico y fertilización de floración.');

  const currentProducer = producers.find((p) => p.id === selectedProdId) || producers[0];

  const agronomicCalc = currentProducer
    ? calculateAdvanceCeiling(
        currentProducer.approvedHectares,
        currentProducer.historicalYieldQHa,
        basePriceUsd,
        alphaCoverage
      )
    : null;

  const isOverCeiling = agronomicCalc ? requestedAmountUsd > agronomicCalc.maxAdvanceUsd : false;

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProducer || !agronomicCalc) return;

    if (isOverCeiling) {
      alert(`El monto solicitado ($${requestedAmountUsd} USD) supera el techo prudencial ($${agronomicCalc.maxAdvanceUsd} USD) calculado para proteger al productor contra sobreendeudamiento.`);
      return;
    }

    const nextIndex = contracts.length + 48;
    const initials = currentProducer.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const cutCode = `CUT-CAFÉ-2026-00${nextIndex}-${initials}`;
    const contractNumber = `CC-CAFÉ-2026-00${nextIndex}`;
    const dateNow = new Date().toISOString().split('T')[0];
    const amountBs = Number((requestedAmountUsd * bcvRate).toFixed(2));

    const offlineHash = generateDigitalActaHash(
      cutCode,
      currentProducer.idNumber,
      requestedAmountUsd,
      dateNow,
      `GEO-PORT-${currentProducer.state.toUpperCase()}`
    );

    const newContract: AdvanceContract = {
      id: `adv-${Date.now()}`,
      contractNumber,
      cutCode,
      producerId: currentProducer.id,
      producerName: currentProducer.fullName,
      producerIdNumber: currentProducer.idNumber,
      runopaId: currentProducer.runopaId,
      sigesaiCertCode: currentProducer.sigesaiCertCode,
      farmName: currentProducer.farmName,
      state: currentProducer.state,
      hectares: currentProducer.approvedHectares,
      rHa: currentProducer.historicalYieldQHa,
      estimatedQuintals: agronomicCalc.estimatedQuintals,
      basePriceUsd: basePriceUsd,
      projectedCropValueUsd: agronomicCalc.projectedCropValueUsd,
      coverageAlpha: alphaCoverage,
      maxAdvanceUsd: agronomicCalc.maxAdvanceUsd,
      amountUsd: requestedAmountUsd,
      bcvRateAtIssue: bcvRate,
      amountBs,
      paymentMethod,
      bankRef:
        paymentMethod === 'TRANSFERENCIA_BANCARIA'
          ? `${currentProducer.bankName} Ref N° 00${Math.floor(100000 + Math.random() * 900000)}`
          : 'Acta de Entrega en Campo con Hash Biométrico',
      sourceTransferId: selectedTransferId,
      issueDate: dateNow,
      settlementTerm: '01 de Octubre a 28 de Febrero',
      status: 'ACTIVO_PENDIENTE',
      amortizedAmountUsd: 0,
      balancePendingUsd: requestedAmountUsd,
      offlineHashSha256: offlineHash,
      biometricVerified: true,
      notes,
    };

    onAddContract(newContract);
    setShowGenerator(false);
    onClearSelectedProducer();
    onOpenContractModal(newContract);
  };

  const totalDisbursedUsd = contracts.reduce((sum, c) => sum + c.amountUsd, 0);
  const totalAmortizedUsd = contracts.reduce((sum, c) => sum + c.amortizedAmountUsd, 0);
  const totalPendingUsd = contracts.reduce((sum, c) => sum + c.balancePendingUsd, 0);

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Gestor de Anticipos Agrícolas & Contratos de Cosecha Futura
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Generación y seguimiento de contratos mercantiles bajo el{' '}
            <strong>Artículo 1.332 del Código Civil de Venezuela</strong>. Asignación del{' '}
            <strong>Código Único de Trazabilidad (CUT)</strong>, motor agro-económico de techo prudencial{' '}
            y justificación plena de salida de fondos bancarios para el <strong>SENIAT</strong> y el{' '}
            <strong>Banco</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {showGenerator ? 'Cerrar Calculador' : 'Nuevo Contrato de Anticipo'}
        </button>
      </div>

      {/* Summary KPI Strip - Soft Pastel Palette (Bimonetary VEN-NIF) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Anticipos Otorgados - Soft Pastel Blue */}
        <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#1E4E79] font-semibold uppercase tracking-wider text-[10px]">
            Total Anticipos Otorgados (VEN-NIF)
          </div>
          <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers mt-1">
            {formatCurrencyBs(totalDisbursedUsd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#2A6496] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalDisbursedUsd)}
          </div>
          <div className="text-[11px] text-[#335E8A] mt-2 border-t border-[#CFE2F3]/70 pt-1.5 font-medium">
            Contabilizado en Activo Corriente (Cta 1330.01)
          </div>
        </div>

        {/* Amortizado en Zafra - Soft Pastel Green */}
        <div className="bg-[#EEF8F1] border border-[#CBEAD2] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#1E6637] font-semibold uppercase tracking-wider text-[10px]">
            Amortizado en Zafra (Octubre)
          </div>
          <div className="text-xl font-bold text-[#1E6637] font-mono-numbers mt-1">
            {formatCurrencyBs(totalAmortizedUsd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#277843] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalAmortizedUsd)}
          </div>
          <div className="text-[11px] text-[#2D6A4F] mt-2 border-t border-[#CBEAD2]/70 pt-1.5 font-medium">
            Liquidado contra entrega de café pergamino
          </div>
        </div>

        {/* Saldo Pendiente por Liquidar - Soft Pastel Rose */}
        <div className="bg-[#FDF0F2] border border-[#FACCD5] rounded-2xl p-4.5 shadow-xs">
          <div className="text-xs text-[#962842] font-semibold uppercase tracking-wider text-[10px]">
            Saldo Pendiente por Liquidar
          </div>
          <div className="text-xl font-bold text-[#962842] font-mono-numbers mt-1">
            {formatCurrencyBs(totalPendingUsd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#B83250] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalPendingUsd)}
          </div>
          <div className="text-[11px] text-[#962842]/85 mt-2 border-t border-[#FACCD5]/70 pt-1.5 font-medium">
            En proceso de recolección en campo
          </div>
        </div>
      </div>

      {/* Motor Agro-Económico de Cálculo & Formalización (Collapsible Form) */}
      {showGenerator && (
        <div className="bg-white border border-[#D8E2DC] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D8E2DC]">
            <Calculator className="w-5 h-5 text-[#E07A5F]" />
            <h2 className="text-base font-bold text-[#3D405B]">
              Motor Algorítmico de Financiamiento Agrícola & Autogenerador de Contratos
            </h2>
          </div>

          <form onSubmit={handleCreateContract} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Productor y Predio */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <span className="font-bold text-[#3D405B] uppercase tracking-wider block text-[11px]">
                  1. Datos del Productor y Predio
                </span>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Seleccionar Caficultor</label>
                  <select
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white text-xs"
                  >
                    {producers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.farmName} - {p.approvedHectares} ha)
                      </option>
                    ))}
                  </select>
                </div>

                {currentProducer && (
                  <div className="space-y-1.5 pt-2 border-t border-[#D8E2DC]/80 font-mono-numbers">
                    <div>
                      <span className="text-[#3D405B]/70">Cédula:</span>{' '}
                      <strong>{currentProducer.idNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[#3D405B]/70">RUNOPA:</span>{' '}
                      <strong>{currentProducer.runopaId}</strong>
                    </div>
                    <div>
                      <span className="text-[#3D405B]/70">SIGESAI:</span>{' '}
                      <strong>{currentProducer.sigesaiCertCode}</strong>
                    </div>
                    <div>
                      <span className="text-[#3D405B]/70">Superficie:</span>{' '}
                      <strong>{currentProducer.approvedHectares} Hectáreas</strong>
                    </div>
                    <div>
                      <span className="text-[#3D405B]/70">Rendimiento Histórico:</span>{' '}
                      <strong>{currentProducer.historicalYieldQHa} Q/ha</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Col 2: Parámetros del Motor Agro-Económico */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <span className="font-bold text-[#3D405B] uppercase tracking-wider block text-[11px]">
                  2. Algoritmo Agro-Económico
                </span>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Precio Base Estimado ($/Quintal CPS)
                  </label>
                  <input
                    type="number"
                    value={basePriceUsd}
                    onChange={(e) => setBasePriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  />
                  <span className="text-[10px] text-[#3D405B]/60 mt-0.5 block">
                    Basado en ICE Arabica "C" + Diferencial de Calidad
                  </span>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Coeficiente Prudencial de Cobertura (&alpha;)
                  </label>
                  <select
                    value={alphaCoverage}
                    onChange={(e) => setAlphaCoverage(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white font-mono"
                  >
                    <option value="0.30">30% (Conservador - Riesgo Climático Alto)</option>
                    <option value="0.35">35% (Moderado - Zonas de Media Altura)</option>
                    <option value="0.40">40% (Recomendado Estándar Cordillera)</option>
                    <option value="0.50">50% (Techo Máximo Permitido)</option>
                  </select>
                </div>

                {agronomicCalc && (
                  <div className="p-3 bg-white border border-[#D8E2DC] rounded-xl space-y-1.5 font-mono-numbers">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#3D405B]/70">Producción Estimada (P_est):</span>
                      <strong>{agronomicCalc.estimatedQuintals} Quintales</strong>
                    </div>
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-[#3D405B]/70">Valor Cosecha Proyectado:</span>
                      <div className="text-right">
                        <strong className="block text-[#1A202C]">{formatCurrencyBs(agronomicCalc.projectedCropValueUsd * bcvRate)}</strong>
                        <span className="text-[11px] text-[#2A6496] font-semibold">{formatCurrencyUsd(agronomicCalc.projectedCropValueUsd)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline text-[#E07A5F] font-bold border-t border-[#D8E2DC] pt-1.5 text-xs">
                      <span>Techo Máximo (A_max):</span>
                      <div className="text-right">
                        <strong className="block text-[#E07A5F]">{formatCurrencyBs(agronomicCalc.maxAdvanceUsd * bcvRate)}</strong>
                        <span className="text-[11px] font-semibold text-[#962842]">{formatCurrencyUsd(agronomicCalc.maxAdvanceUsd)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Col 3: Desembolso y Justificación */}
              <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-lg border border-[#D8E2DC]/60 text-xs">
                <span className="font-bold text-[#3D405B] uppercase tracking-wider block text-[11px]">
                  3. Datos del Desembolso Monetario
                </span>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Monto de Anticipo a Desembolsar (USD)
                  </label>
                  <input
                    type="number"
                    value={requestedAmountUsd}
                    onChange={(e) => setRequestedAmountUsd(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md bg-white font-mono text-sm font-bold ${
                      isOverCeiling ? 'border-red-500 text-red-600' : 'border-[#D8E2DC] text-[#3D405B]'
                    }`}
                  />
                  {isOverCeiling && (
                    <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Supera el techo prudencial ({formatCurrencyUsd(agronomicCalc?.maxAdvanceUsd || 0)})</span>
                    </div>
                  )}
                  <div className="text-[11px] text-[#1E6637] font-mono-numbers mt-1.5 bg-[#EEF8F1] p-2 rounded border border-[#CBEAD2]">
                    <div className="font-bold">Total a Liquidar en Bolívares (VEN-NIF):</div>
                    <div className="text-sm font-extrabold">{formatCurrencyBs(requestedAmountUsd * bcvRate)}</div>
                    <div className="text-[10px] text-[#277843] mt-0.5">Calculado a Tasa Oficial BCV de Bs. {bcvRate.toFixed(2)} por USD</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Medio de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white text-xs"
                  >
                    <option value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria Nacional</option>
                    <option value="EFECTIVO_CAMPO">Efectivo en Campo (Acta Rural con Huella y Hash)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">
                    Fondo de Origen en Bóveda (Convenio Cambiario N° 1)
                  </label>
                  <select
                    value={selectedTransferId}
                    onChange={(e) => setSelectedTransferId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-white text-xs"
                  >
                    {transfers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.referenceSwift} - {t.senderEntity} (${t.amountUsd.toLocaleString()} USD)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D8E2DC]">
              <div className="text-xs text-[#3D405B]/70">
                Al emitir el anticipo, el sistema generará automáticamente el{' '}
                <strong>Contrato de Compraventa de Cosecha Futura</strong>, asignará el código CUT y registrará
                el asiento contable bajo <strong>VEN-NIF</strong>.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2 border border-[#D8E2DC] text-[#3D405B] text-xs rounded-lg hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isOverCeiling}
                  className="px-5 py-2 bg-[#E07A5F] hover:bg-[#d66b50] disabled:bg-gray-300 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Aprobar y Generar Contrato Formal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Table: Active Contracts */}
      <div className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#D8E2DC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#3D405B]">
            Registro de Contratos de Compraventa de Cosecha Futura
          </h2>
          <span className="text-xs text-[#3D405B]/70 font-mono-numbers">
            {contracts.length} contratos formalizados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#3D405B] border-b border-[#D8E2DC] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código CUT & Contrato</th>
                <th className="py-3 px-4">Caficultor & Predio</th>
                <th className="py-3 px-4 text-right">Anticipo Desembolsado (Bs. / USD)</th>
                <th className="py-3 px-4 text-right">Techo Prudencial A_max</th>
                <th className="py-3 px-4">Medio de Pago & Respaldo</th>
                <th className="py-3 px-4 text-right">Estatus & Saldo Pendiente</th>
                <th className="py-3 px-4 text-center">Documento Contractual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1DE] font-mono-numbers">
              {contracts.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  {/* CUT & Contrato */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1A202C] text-xs flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span>{item.cutCode}</span>
                    </div>
                    <div className="text-[11px] text-[#4A5568] mt-0.5">{item.contractNumber}</div>
                    <div className="text-[10px] text-[#718096]">Emitido: {item.issueDate}</div>
                  </td>

                  {/* Caficultor */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-[#1A202C]">{item.producerName}</div>
                    <div className="text-[11px] text-[#4A5568]">
                      {item.farmName} ({item.hectares} ha · {item.state})
                    </div>
                    <div className="text-[10px] text-[#718096] font-mono-numbers">
                      RUNOPA: {item.runopaId}
                    </div>
                  </td>

                  {/* Anticipo Desembolsado: Bimonetario */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-bold text-[#1A202C] text-sm">
                      {formatCurrencyBs(item.amountBs)}
                    </div>
                    <div className="text-xs font-semibold text-[#2A6496]">
                      {formatCurrencyUsd(item.amountUsd)}
                    </div>
                    <div className="text-[10px] text-[#718096]">
                      BCV al emitir: Bs. {item.bcvRateAtIssue.toFixed(4)}
                    </div>
                  </td>

                  {/* Techo A_max: Bimonetario */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-semibold text-[#962842] text-xs">
                      {formatCurrencyBs(item.maxAdvanceUsd * item.bcvRateAtIssue)}
                    </div>
                    <div className="text-[11px] text-[#B83250]">
                      {formatCurrencyUsd(item.maxAdvanceUsd)}
                    </div>
                    <div className="text-[10px] text-[#718096]">
                      Cobertura: {(item.coverageAlpha * 100).toFixed(0)}%
                    </div>
                  </td>

                  {/* Medio de Pago */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-medium text-[#1A202C]">
                      {item.paymentMethod === 'TRANSFERENCIA_BANCARIA' ? 'Transferencia Bancaria' : 'Efectivo en Campo'}
                    </div>
                    <div className="text-[11px] text-[#4A5568] truncate max-w-xs">
                      {item.bankRef}
                    </div>
                    {item.biometricVerified && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-0.5">
                        <Fingerprint className="w-3 h-3 text-emerald-600" />
                        <span>Firma & Hash SHA-256</span>
                      </div>
                    )}
                  </td>

                  {/* Estatus & Saldo Pendiente: Bimonetario */}
                  <td className="py-3.5 px-4 text-right font-sans">
                    {item.status === 'LIQUIDADO_OCTUBRE' ? (
                      <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                        Liquidado en Zafra
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                        Pendiente Zafra
                      </span>
                    )}
                    <div className="text-xs font-bold text-[#1A202C] font-mono-numbers mt-1">
                      {formatCurrencyBs(item.balancePendingUsd * bcvRate)}
                    </div>
                    <div className="text-[11px] text-[#718096] font-mono-numbers">
                      {formatCurrencyUsd(item.balancePendingUsd)}
                    </div>
                  </td>

                  {/* Botón Contrato */}
                  <td className="py-3.5 px-4 text-center font-sans">
                    <button
                      onClick={() => onOpenContractModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] text-[#3D405B] rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#E07A5F]" />
                      Ver Contrato Legal (PDF)
                    </button>
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
