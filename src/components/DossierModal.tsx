import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { AdvanceContract, HarvestReception, ForeignTransfer, Producer } from '../types';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import {
  FileCheck2,
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  Building,
} from 'lucide-react';

interface DossierModalProps {
  contracts: AdvanceContract[];
  receptions: HarvestReception[];
  transfers: ForeignTransfer[];
  producers: Producer[];
  bcvRate: number;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  contracts,
  receptions,
  transfers,
  producers,
  bcvRate,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalTransfersUsd = transfers.reduce((sum, t) => sum + t.amountUsd, 0);
  const totalAdvancesUsd = contracts.reduce((sum, c) => sum + c.amountUsd, 0);
  const totalHarvestQ = receptions.reduce((sum, r) => sum + r.quintalsDelivered, 0);
  const totalIslrBs = receptions.reduce((sum, r) => sum + r.islrWithholdingBs, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full border border-[#D8E2DC] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#D8E2DC] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#E07A5F]" />
            <div>
              <h3 className="text-base font-bold text-[#3D405B]">
                Dossier Probatorio Integral para SENIAT y Banca Universal
              </h3>
              <p className="text-xs text-[#3D405B]/70">
                Expediente digital certificado bajo normas SUDEBAN SIAR LC/FT y VEN-NIF (NIC 21)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3D405B] text-white rounded-md text-xs font-semibold hover:bg-[#2D3142] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Expediente
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#3D405B]/60 hover:text-[#3D405B] text-lg font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-xs text-[#2D3142] leading-relaxed">
          {/* Certificate Header */}
          <div className="text-center border-b border-black/20 pb-4 font-sans space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-600">
              EXPEDIENTE DE FISCALIZACIÓN Y CONCILIACIÓN INTEGRAL
            </div>
            <h1 className="text-base font-extrabold uppercase text-[#3D405B]">
              CERTIFICACIÓN DE ORIGEN, DESTINO Y TRAZABILIDAD DE FONDOS CAMBIARIOS
            </h1>
            <div className="text-[11px] text-neutral-600 font-mono">
              EMPRESA: {COMPANY_INFO.name} · RIF: {COMPANY_INFO.rif} · SICA: {COMPANY_INFO.sicaCode}
            </div>
            <div className="text-[10px] text-neutral-500">
              Período de Zafra: {COMPANY_INFO.activeCropCycle} · Archivo de Custodia Obligatoria por 10 Años
            </div>
          </div>

          {/* Section 1: Executive Audit Summary */}
          <div className="bg-[#FAF8F5] border border-[#D8E2DC] rounded-xl p-4 space-y-3 font-mono-numbers">
            <h4 className="font-bold text-[#3D405B] font-sans uppercase text-[11px] tracking-wider">
              1. Balance Ejecutivo del Circuito Financiero Cafetalero
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-2.5 rounded border border-[#D8E2DC]">
                <span className="text-[10px] text-[#3D405B]/60 block font-sans">
                  Ingreso Divisas Exterior:
                </span>
                <strong className="text-sm text-[#3D405B] block">{formatCurrencyBs(totalTransfersUsd * bcvRate)}</strong>
                <span className="text-xs font-semibold text-[#2A6496] font-mono block">{formatCurrencyUsd(totalTransfersUsd)}</span>
                <span className="text-[10px] text-neutral-500 block font-sans mt-0.5">Art. 57 Convenio Camb. 1</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D8E2DC]">
                <span className="text-[10px] text-[#3D405B]/60 block font-sans">
                  Anticipos a Productores:
                </span>
                <strong className="text-sm text-[#E07A5F] block">{formatCurrencyBs(totalAdvancesUsd * bcvRate)}</strong>
                <span className="text-xs font-semibold text-[#962842] font-mono block">{formatCurrencyUsd(totalAdvancesUsd)}</span>
                <span className="text-[10px] text-neutral-500 block font-sans mt-0.5">Cta 1330.01 Activo</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D8E2DC]">
                <span className="text-[10px] text-[#3D405B]/60 block font-sans">
                  Cosecha Recibida Zafra:
                </span>
                <strong className="text-sm text-[#3D405B] block">{totalHarvestQ.toFixed(2)} Q CPS</strong>
                <span className="text-xs font-semibold text-[#1E6637] font-mono block">
                  {formatCurrencyBs(receptions.reduce((sum, r) => sum + r.grossValueBs, 0))}
                </span>
                <span className="text-[10px] text-neutral-500 block font-sans mt-0.5">Cta 1130.01 Inventario</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D8E2DC]">
                <span className="text-[10px] text-[#3D405B]/60 block font-sans">
                  Retención 1.5% ISLR SENIAT:
                </span>
                <strong className="text-sm text-emerald-800 block">{formatCurrencyBs(totalIslrBs)}</strong>
                <span className="text-xs font-semibold text-emerald-700 font-mono block">
                  {formatCurrencyUsd(totalIslrBs / bcvRate)}
                </span>
                <span className="text-[10px] text-neutral-500 block font-sans mt-0.5">Compra primaria exenta IVA</span>
              </div>
            </div>
          </div>

          {/* Section 2: Legal Checklist */}
          <div className="border border-[#D8E2DC] rounded-xl p-4 bg-white space-y-3">
            <h4 className="font-bold text-[#3D405B] uppercase text-[11px] tracking-wider">
              2. Checklist Probatorio Documental Completo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Convenio Cambiario N° 1 (Arts. 31, 32 y 57):</strong> Autorización expresa de retención del 80% de divisas para insumos y pago a caficultores.
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Contratos de Cosecha Futura (Art. 1.332 CCV):</strong> Respaldados con códigos CUT, delimitación georreferenciada y cláusulas penales.
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Acreditación Agrícola (RUNOPA / SIGESAI):</strong> 100% de productores verificados ante MPPAT e INSAI.
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Guías de Movilización SICA (SUNAGRO):</strong> Trazabilidad del grano de café en recepción con Factor de Rendimiento (FR).
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Contabilidad VEN-NIF (NIC 21):</strong> Asientos por partida doble con reconocimiento de ganancia/pérdida por diferencial cambiario.
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Custodia Legal por 10 Años:</strong> Base de datos inalterable con hashes criptográficos SHA-256 de todas las operaciones.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Producers & Contracts Summary */}
          <div className="border border-[#D8E2DC] rounded-xl p-4 bg-white space-y-3">
            <h4 className="font-bold text-[#3D405B] uppercase text-[11px] tracking-wider">
              3. Relación Detallada de Contratos de Anticipo Emitidos
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono-numbers">
                <thead className="bg-[#FAF8F5] text-[#3D405B] font-semibold border-b border-[#D8E2DC]">
                  <tr>
                    <th className="py-2 px-2">Código CUT</th>
                    <th className="py-2 px-2 font-sans">Productor</th>
                    <th className="py-2 px-2">RUNOPA</th>
                    <th className="py-2 px-2 text-right">Anticipo (USD)</th>
                    <th className="py-2 px-2 text-right">Anticipo (Bs.)</th>
                    <th className="py-2 px-2 font-sans">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1DE]">
                  {contracts.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-2 font-bold">{c.cutCode}</td>
                      <td className="py-2 px-2 font-sans">{c.producerName}</td>
                      <td className="py-2 px-2">{c.runopaId}</td>
                      <td className="py-2 px-2 text-right font-bold">{formatCurrencyUsd(c.amountUsd)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrencyBs(c.amountBs)}</td>
                      <td className="py-2 px-2 font-sans text-neutral-600">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Declaración Jurada */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#D8E2DC] text-[11px] space-y-2">
            <div className="font-bold text-[#3D405B]">DECLARACIÓN JURADA DE CUMPLIMIENTO FISCAL Y BANCARIO:</div>
            <p className="text-justify text-[#3D405B]/80">
              Certificamos bajo fe de juramento que la información consignada en el presente expediente refleja con
              fidelidad los flujos de divisas ingresados a la República Bolivariana de Venezuela al amparo del Convenio
              Cambiario N° 1 y los desembolsos a caficultores bajo contratos mercantiles de cosecha futura válidos conforme
              al ordenamiento legal vigente. Los soportes físicos y digitales se encuentran resguardados en nuestra sede de
              Biscucuy, Estado Portuguesa, a disposición de los funcionarios acreditados de la Administración Tributaria
              (SENIAT), la Superintendencia de las Instituciones del Sector Bancario (SUDEBAN) y el Banco Central de Venezuela (BCV).
            </p>
          </div>

          {/* Signature Line */}
          <div className="pt-6 text-center text-xs">
            <div className="inline-block border-t border-black px-12 pt-2">
              <div className="font-bold">{COMPANY_INFO.legalRepresentative}</div>
              <div>Representante Legal · {COMPANY_INFO.name}</div>
              <div className="font-mono text-neutral-500">C.I.: {COMPANY_INFO.repId} · RIF: {COMPANY_INFO.rif}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
