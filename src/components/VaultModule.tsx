import React, { useState } from 'react';
import { ForeignTransfer } from '../types';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  Building2,
  FileText,
  PlusCircle,
  Sparkles,
  ArrowDownRight,
  Landmark,
  FileCheck2,
  Globe2,
  ShieldCheck,
} from 'lucide-react';

interface VaultModuleProps {
  transfers: ForeignTransfer[];
  onOpenNewTransferModal: () => void;
  onOpenJustificationModal: (transfer: ForeignTransfer) => void;
  bcvRate: number;
}

export const VaultModule: React.FC<VaultModuleProps> = ({
  transfers,
  onOpenNewTransferModal,
  onOpenJustificationModal,
  bcvRate,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalReceivedUsd = transfers.reduce((sum, t) => sum + t.amountUsd, 0);
  const totalRetained80Usd = transfers.reduce((sum, t) => sum + t.retention80Usd, 0);
  const totalBcv20Usd = transfers.reduce((sum, t) => sum + t.saleBcv20Usd, 0);
  const totalDisbursedToAdvancesUsd = transfers.reduce((sum, t) => sum + t.assignedToAdvancesUsd, 0);
  const totalAvailableVaultUsd = totalRetained80Usd - totalDisbursedToAdvancesUsd;

  const filteredTransfers = transfers.filter((t) => {
    const matchesCategory = filterCategory === 'all' || t.mlCategory === filterCategory;
    const matchesSearch =
      t.referenceSwift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.senderEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.originatingBank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.originatingCountry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Title & Hero Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Bóveda Cambiaria & Transferencias del Exterior
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Control integral de divisas transferidas desde bancos internacionales a cuentas venezolanas.
            Clasificación automática mediante algoritmos de Machine Learning y emisión de justificaciones
            legales ante el <strong>SENIAT</strong> y la <strong>SUDEBAN</strong> bajo el{' '}
            <strong>Convenio Cambiario N° 1 (Arts. 31, 32 y 57)</strong>.
          </p>
        </div>

        <button
          onClick={onOpenNewTransferModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Transferencia Exterior
        </button>
      </div>

      {/* KPI Structural Grid (Soft Pastel Palette: Bimonetary VEN-NIF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow - Soft Pastel Blue */}
        <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#1E4E79] mb-1.5 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Total Ingresado Exterior (VEN-NIF)</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#1E4E79]">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers">
            {formatCurrencyBs(totalReceivedUsd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#2A6496] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalReceivedUsd)}
          </div>
          <div className="text-[11px] text-[#335E8A] mt-2.5 border-t border-[#CFE2F3]/70 pt-2 font-medium flex items-center justify-between">
            <span>Tasa BCV Referencial:</span>
            <span className="font-mono font-bold">Bs. {bcvRate.toFixed(2)}</span>
          </div>
        </div>

        {/* 80% Retained for Crop Operations (Art. 57) - Soft Pastel Green */}
        <div className="bg-[#EEF8F1] border border-[#CBEAD2] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#1E6637] mb-1.5 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Retención 80% Art. 57 CC1</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#1E6637]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#1E6637] font-mono-numbers">
            {formatCurrencyBs(totalRetained80Usd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#277843] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalRetained80Usd)}
          </div>
          <div className="text-[11px] text-[#2D6A4F] mt-2.5 border-t border-[#CBEAD2]/70 pt-2 font-medium">
            Bóveda Moneda Extranjera para anticipos
          </div>
        </div>

        {/* 20% Sold to BCV - Soft Pastel Yellow */}
        <div className="bg-[#FEF9E7] border border-[#FBE6A2] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7C5B00] mb-1.5 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Venta 20% Obligatoria BCV</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#7C5B00]">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#7C5B00] font-mono-numbers">
            {formatCurrencyBs(totalBcv20Usd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#8A6800] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalBcv20Usd)}
          </div>
          <div className="text-[11px] text-[#7C5B00]/80 mt-2.5 border-t border-[#FBE6A2]/70 pt-2 font-medium">
            Intermediación cambiaria oficial en Bs.
          </div>
        </div>

        {/* Net Available in Vault - Soft Pastel Rose */}
        <div className="bg-[#FDF0F2] border border-[#FACCD5] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#962842] mb-1.5 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Disponible en Bóveda</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#962842]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#962842] font-mono-numbers">
            {formatCurrencyBs(totalAvailableVaultUsd * bcvRate)}
          </div>
          <div className="text-xs font-bold text-[#B83250] font-mono-numbers mt-0.5">
            {formatCurrencyUsd(totalAvailableVaultUsd)}
          </div>
          <div className="text-[11px] text-[#962842]/85 mt-2.5 border-t border-[#FACCD5]/70 pt-2 font-medium">
            En anticipos: {formatCurrencyBs(totalDisbursedToAdvancesUsd * bcvRate)} ({formatCurrencyUsd(totalDisbursedToAdvancesUsd)})
          </div>
        </div>
      </div>

      {/* ML Classification Informational Strip with Soft Pastel Gradient */}
      <div className="bg-gradient-to-r from-[#EEF8F1] via-[#F4F9F5] to-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white text-[#1E6637] rounded-xl shadow-xs border border-[#CBEAD2]/60 mt-0.5">
            <Sparkles className="w-5 h-5 text-[#1E6637]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              Algoritmo de Aprendizaje Automático (NLP Multi-Atributo) Activo
            </h3>
            <p className="text-xs text-[#475569] mt-0.5 max-w-2xl">
              El motor analiza los campos MT103 (SWIFT), identificando contratos de exportación de café,
              entidades remitentes y normativas del Convenio Cambiario N° 1. Asigna automáticamente el sustento legal
              para el Banco (SUDEBAN SIAR) y el SENIAT (Art. 13/16 Ley IVA - Operación no gravable).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="px-3 py-1.5 bg-white border border-[#CBEAD2] text-[#1E6637] font-semibold rounded-lg shadow-2xs">
            Precisión Promedio: <strong>96.8%</strong>
          </span>
          <span className="px-3 py-1.5 bg-white border border-[#CFE2F3] text-[#1E4E79] font-semibold rounded-lg shadow-2xs">
            Custodia Probatoria: <strong>10 Años</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar (Soft Pastel Segmented Buttons) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#2D3748] text-white shadow-2xs'
                : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
            }`}
          >
            Todas ({transfers.length})
          </button>
          <button
            onClick={() => setFilterCategory('ANTICIPO_EXPORTACION_ART57')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterCategory === 'ANTICIPO_EXPORTACION_ART57'
                ? 'bg-[#EEF8F1] text-[#1E6637] border border-[#CBEAD2]'
                : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
            }`}
          >
            Anticipos Art. 57
          </button>
          <button
            onClick={() => setFilterCategory('VENTA_SPOT_CAFE_VERDE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterCategory === 'VENTA_SPOT_CAFE_VERDE'
                ? 'bg-[#EBF3FA] text-[#1E4E79] border border-[#CFE2F3]'
                : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
            }`}
          >
            Liquidación Spot
          </button>
          <button
            onClick={() => setFilterCategory('FINANCIAMIENTO_EXTERIOR_COSECHA')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterCategory === 'FINANCIAMIENTO_EXTERIOR_COSECHA'
                ? 'bg-[#FEF9E7] text-[#7C5B00] border border-[#FBE6A2]'
                : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
            }`}
          >
            Financiamiento
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por SWIFT, banco o comprador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D8E2DC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3D405B] text-[#3D405B]"
          />
        </div>
      </div>

      {/* Main Table: Foreign Transfers */}
      <div className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#3D405B] border-b border-[#D8E2DC] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fecha & Ref SWIFT</th>
                <th className="py-3 px-4">Origen & Remitente</th>
                <th className="py-3 px-4">Destino Bancario (Vzla)</th>
                <th className="py-3 px-4 text-right">Monto Bimonetario (Bs. / USD)</th>
                <th className="py-3 px-4 text-right">Retención Art. 57 (80% / 20%)</th>
                <th className="py-3 px-4">Clasificación IA / Marco Legal</th>
                <th className="py-3 px-4 text-center">Acciones Probatorias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1DE] font-mono-numbers">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#3D405B]/60 text-xs">
                    No se encontraron transferencias con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Fecha & Ref */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1A202C]">{item.date}</div>
                      <div className="text-[11px] text-[#4A5568]">{item.referenceSwift}</div>
                    </td>

                    {/* Origen & Remitente */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-medium text-[#1A202C] line-clamp-1">{item.senderEntity}</div>
                      <div className="text-[11px] text-[#4A5568]">
                        {item.originatingBank} · {item.originatingCountry}
                      </div>
                    </td>

                    {/* Destino en Venezuela */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-medium text-[#1A202C]">{item.destinationBankVzla}</div>
                      <div className="text-[11px] text-[#4A5568] font-mono-numbers">
                        Cta: {item.destinationAccountNum}
                      </div>
                    </td>

                    {/* Monto Bimonetario: Bolívares y Dólares */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-[#1A202C] text-sm">
                        {formatCurrencyBs(item.amountBs)}
                      </div>
                      <div className="text-xs font-semibold text-[#2A6496]">
                        {formatCurrencyUsd(item.amountUsd)}
                      </div>
                      <div className="text-[10px] text-[#718096]">
                        Tasa BCV: Bs. {item.bcvRate.toFixed(4)}
                      </div>
                    </td>

                    {/* Distribución 80% / 20% Bimonetaria */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="text-xs font-semibold text-[#1E6637]">
                        80% Bóveda: {formatCurrencyBs(item.retention80Usd * item.bcvRate)}
                      </div>
                      <div className="text-[11px] text-[#277843]">
                        ({formatCurrencyUsd(item.retention80Usd)})
                      </div>
                      <div className="text-[10px] text-[#7C5B00] mt-0.5">
                        20% BCV: {formatCurrencyBs(item.saleBcv20Usd * item.bcvRate)} ({formatCurrencyUsd(item.saleBcv20Usd)})
                      </div>
                    </td>

                    {/* Clasificación IA */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#1A202C] text-[11px]">
                          {item.mlCategory === 'ANTICIPO_EXPORTACION_ART57'
                            ? 'Anticipo Exportación (Art. 57)'
                            : item.mlCategory === 'VENTA_SPOT_CAFE_VERDE'
                            ? 'Liquidación Venta Spot'
                            : item.mlCategory === 'FINANCIAMIENTO_EXTERIOR_COSECHA'
                            ? 'Financiamiento Cosecha'
                            : item.mlCategory}
                        </span>
                        <span className="text-[10px] bg-[#EEF8F1] text-[#1E6637] border border-[#CBEAD2] px-1.5 py-0.2 rounded font-mono font-medium">
                          {(item.mlConfidence * 100).toFixed(0)}% IA
                        </span>
                      </div>
                      <div className="text-[10px] text-[#4A5568] line-clamp-1 mt-0.5">
                        {item.convenioArt}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-center font-sans">
                      <button
                        onClick={() => onOpenJustificationModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] text-[#3D405B] rounded text-[11px] font-medium transition-colors cursor-pointer"
                        title="Ver Justificación Oficial para el Banco y el SENIAT"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                        Justificación SENIAT/Banco
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory Context Box */}
      <div className="bg-[#F4F1DE]/50 border border-[#F2CC8F] rounded-xl p-4 text-xs text-[#3D405B]">
        <div className="flex items-center gap-2 font-bold mb-1 text-[#3D405B]">
          <Landmark className="w-4 h-4 text-[#E07A5F]" />
          <span>Marco Jurídico de Operación Cambiaria en Venezuela:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <strong className="block text-[#3D405B]">Convenio Cambiario N° 1 (Arts. 31 y 32)</strong>
            <p className="text-[11px] text-[#3D405B]/80 mt-0.5">
              Habilita la libre recepción de divisas del exterior y su mantenimiento en cuentas en moneda extranjera
              en bancos universales venezolanos.
            </p>
          </div>
          <div>
            <strong className="block text-[#3D405B]">Artículo 57 (Sector Exportador de Café)</strong>
            <p className="text-[11px] text-[#3D405B]/80 mt-0.5">
              Autoriza a las empresas cafetaleras a retener hasta el 80% de los ingresos en divisas para cubrir
              financiamientos a caficultores, fertilizantes y gastos de cosecha, vendiendo el 20% al BCV.
            </p>
          </div>
          <div>
            <strong className="block text-[#3D405B]">Normativa SUDEBAN SIAR LC/FT/FPADM</strong>
            <p className="text-[11px] text-[#3D405B]/80 mt-0.5">
              Exige conservar toda la documentación probatoria del origen y destino de los fondos por un periodo
              mínimo ininterrumpido de 10 años ante fiscalizaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
