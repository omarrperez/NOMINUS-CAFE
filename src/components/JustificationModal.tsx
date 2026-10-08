import React, { useState } from 'react';
import { ForeignTransfer } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import { Landmark, ShieldCheck, Printer, Copy, Check, X, FileText } from 'lucide-react';

interface JustificationModalProps {
  transfer: ForeignTransfer;
  onClose: () => void;
}

export const JustificationModal: React.FC<JustificationModalProps> = ({ transfer, onClose }) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedSeniat, setCopiedSeniat] = useState(false);

  const handleCopy = (text: string, type: 'bank' | 'seniat') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedSeniat(true);
      setTimeout(() => setCopiedSeniat(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-[#D8E2DC] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#D8E2DC] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#E07A5F]" />
            <div>
              <h3 className="text-base font-bold text-[#3D405B]">
                Certificación y Justificación Probatoria Oficial
              </h3>
              <p className="text-xs text-[#3D405B]/70 font-mono">
                Ref SWIFT: {transfer.referenceSwift} · Banco: {transfer.destinationBankVzla}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3D405B] text-white rounded-md text-xs font-semibold hover:bg-[#2D3142]"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#3D405B]/60 hover:text-[#3D405B] text-lg font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#2D3142] leading-relaxed">
          {/* Transfer Summary Badge */}
          <div className="bg-[#FAF8F5] border border-[#D8E2DC] p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numbers">
            <div>
              <span className="text-[10px] text-[#3D405B]/60 block font-sans">MONTO EXTERIOR (Bs. / USD):</span>
              <strong className="text-sm text-[#3D405B] block">{formatCurrencyBs(transfer.amountBs)}</strong>
              <span className="text-xs font-semibold text-[#2A6496] font-mono block">
                {formatCurrencyUsd(transfer.amountUsd)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#3D405B]/60 block font-sans">TASA BCV OFICIAL:</span>
              <strong className="text-sm text-[#3D405B]">Bs. {transfer.bcvRate.toFixed(4)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#3D405B]/60 block font-sans">REMITENTE:</span>
              <span className="font-sans font-semibold text-[#3D405B] truncate block">
                {transfer.senderEntity}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#3D405B]/60 block font-sans">MARCO LEGAL:</span>
              <span className="font-sans font-semibold text-emerald-800 text-[11px] block">
                {transfer.convenioArt}
              </span>
            </div>
          </div>

          {/* Document 1: Carta para el Banco Universal & SUDEBAN */}
          <div className="border border-[#D8E2DC] rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#F4F1DE] pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-[#3D405B] text-sm font-sans">
                  1. Justificación para el Banco Receptor en Venezuela (Mesa de Cambio / SUDEBAN)
                </h4>
              </div>
              <button
                onClick={() => handleCopy(transfer.justificationBankLetter, 'bank')}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] rounded text-[#3D405B]"
              >
                {copiedBank ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedBank ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>

            <div className="p-3 bg-[#FAF8F5]/80 rounded-md border border-[#D8E2DC]/60 font-mono text-[11px] leading-relaxed text-[#3D405B] whitespace-pre-wrap">
              {transfer.justificationBankLetter}
            </div>

            <div className="text-[11px] text-[#3D405B]/70">
              <strong>Cumplimiento Normativo:</strong> Este soporte satisface las exigencias de la
              Circular SUDEBAN sobre Prevención de LC/FT/FPADM, justificando plenamente el origen lícito,
              la retención del 80% (Convenio Cambiario N° 1 Art. 57) y el destino hacia caficultores
              registrados con RUNOPA/SIGESAI.
            </div>
          </div>

          {/* Document 2: Justificación para el SENIAT */}
          <div className="border border-[#D8E2DC] rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#F4F1DE] pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E07A5F]" />
                <h4 className="font-bold text-[#3D405B] text-sm font-sans">
                  2. Soporte Probatorio Fiscal para el SENIAT (Control Tributario)
                </h4>
              </div>
              <button
                onClick={() => handleCopy(transfer.justificationSeniatNote, 'seniat')}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] rounded text-[#3D405B]"
              >
                {copiedSeniat ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedSeniat ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>

            <div className="p-3 bg-[#FAF8F5]/80 rounded-md border border-[#D8E2DC]/60 font-mono text-[11px] leading-relaxed text-[#3D405B] whitespace-pre-wrap">
              {transfer.justificationSeniatNote}
            </div>

            <div className="text-[11px] text-[#3D405B]/70">
              <strong>Alineación Tributaria:</strong> Los ingresos en divisas de exportación y anticipos
              comerciales no se configuran como ventas gravables de IVA en territorio nacional (Arts. 13 y 16
              Ley IVA). Se mantienen registrados en Cuenta 1110.02 (Banco Divisas) con asiento contable por
              partida doble bajo VEN-NIF.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
