import React, { useState, useEffect } from 'react';
import { ForeignTransfer } from '../types';
import { classifyForeignWireTransfer } from '../utils/mlClassifier';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import { Sparkles, Globe2, Landmark, Check, X, ShieldAlert } from 'lucide-react';

interface NewTransferModalProps {
  bcvRate: number;
  onAddTransfer: (transfer: ForeignTransfer) => void;
  onClose: () => void;
}

export const NewTransferModal: React.FC<NewTransferModalProps> = ({
  bcvRate,
  onAddTransfer,
  onClose,
}) => {
  const [senderEntity, setSenderEntity] = useState('Nordic Coffee Roasters ApS Copenhagen');
  const [originatingBank, setOriginatingBank] = useState('Nordea Bank Abp');
  const [originatingCountry, setOriginatingCountry] = useState('Dinamarca');
  const [destinationBankVzla, setDestinationBankVzla] = useState('Banco Nacional de Crédito (BNC)');
  const [destinationAccountNum, setDestinationAccountNum] = useState('0191-0021-34-2100089123');
  const [amountUsd, setAmountUsd] = useState<number>(45000);
  const [memoRaw, setMemoRaw] = useState(
    'ADVANCE PAYMENT HARVEST 2026 SPECIALTY ARABICA COFFEE CONTRACT NCR-VZ-44'
  );

  // Live ML classification
  const mlResult = classifyForeignWireTransfer(memoRaw, amountUsd, senderEntity);

  const amountBs = Number((amountUsd * bcvRate).toFixed(2));
  const retention80Usd = mlResult.retention80 ? Number((amountUsd * 0.8).toFixed(2)) : amountUsd;
  const saleBcv20Usd = mlResult.retention80 ? Number((amountUsd * 0.2).toFixed(2)) : 0;

  const handleApplyPreset = (type: 'advance' | 'spot' | 'loan') => {
    if (type === 'advance') {
      setSenderEntity('Milano Specialty Roasters S.r.l.');
      setOriginatingBank('UniCredit S.p.A. Milan');
      setOriginatingCountry('Italia');
      setAmountUsd(40000);
      setMemoRaw('PRE-HARVEST CROP ADVANCE PURCHASE AGREEMENT COFFEE PERGAMINO SECO BISCUIT LOT 12');
    } else if (type === 'spot') {
      setSenderEntity('Rotterdam Green Coffee Trading B.V.');
      setOriginatingBank('ING Bank N.V. Amsterdam');
      setOriginatingCountry('Países Bajos');
      setAmountUsd(60000);
      setMemoRaw('FINAL PAYMENT COFFEE INVOICE EXPORT SHIPMENT B/L 99014 CONTAINER PUERTO CABELLO');
    } else {
      setSenderEntity('Global Agro Trade Finance Fund');
      setOriginatingBank('Standard Chartered Bank London');
      setOriginatingCountry('Reino Unido');
      setAmountUsd(75000);
      setMemoRaw('PRE-EXPORT TRADE FINANCE LOAN FACILITY CROP 2026 CAPITAL DE TRABAJO CAFETALERO');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const swiftRef = `SWIFT-EXT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransfer: ForeignTransfer = {
      id: `ft-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      referenceSwift: swiftRef,
      originatingBank,
      originatingCountry,
      destinationBankVzla,
      destinationAccountNum,
      senderEntity,
      amountUsd,
      memoRaw,
      bcvRate,
      amountBs,
      mlCategory: mlResult.category,
      mlConfidence: mlResult.confidence,
      mlExplanation: mlResult.explanation,
      convenioArt: mlResult.convenioArt,
      retention80Usd,
      saleBcv20Usd,
      justificationBankLetter: mlResult.bankJustificationTemplate,
      justificationSeniatNote: mlResult.seniatJustificationTemplate,
      status: 'JUSTIFICADO_BANCO',
      assignedToAdvancesUsd: 0,
    };

    onAddTransfer(newTransfer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-[#D8E2DC] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#D8E2DC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#E07A5F]" />
            <div>
              <h3 className="text-base font-bold text-[#3D405B]">
                Registrar Transferencia en Dólares del Exterior
              </h3>
              <p className="text-xs text-[#3D405B]/70">
                Clasificación automática por Machine Learning bajo Convenio Cambiario N° 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#3D405B]/60 hover:text-[#3D405B] text-lg font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 pb-2 border-b border-[#F4F1DE] overflow-x-auto">
            <span className="text-[11px] font-semibold text-[#3D405B]/70 whitespace-nowrap">
              Cargar Ejemplo Rápido:
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('advance')}
              className="px-2.5 py-1 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] rounded text-[11px] font-medium text-[#3D405B] whitespace-nowrap"
            >
              Anticipo Tostaduría (Italia)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('spot')}
              className="px-2.5 py-1 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] rounded text-[11px] font-medium text-[#3D405B] whitespace-nowrap"
            >
              Venta Spot (Holanda)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('loan')}
              className="px-2.5 py-1 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#3D405B] rounded text-[11px] font-medium text-[#3D405B] whitespace-nowrap"
            >
              Crédito Pre-Export (Londres)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3D405B] font-medium mb-1">Entidad Remitente (Comprador)</label>
              <input
                type="text"
                required
                value={senderEntity}
                onChange={(e) => setSenderEntity(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-[#3D405B] font-medium mb-1">Monto en Dólares (USD)</label>
              <input
                type="number"
                required
                value={amountUsd}
                onChange={(e) => setAmountUsd(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono text-sm font-bold"
              />
              <span className="text-[10px] text-[#3D405B]/60 font-mono mt-0.5 block">
                ≈ {formatCurrencyBs(amountBs)} @ Bs. {bcvRate.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-[#3D405B] font-medium mb-1">Banco en el Exterior</label>
              <input
                type="text"
                required
                value={originatingBank}
                onChange={(e) => setOriginatingBank(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-[#3D405B] font-medium mb-1">País de Origen</label>
              <input
                type="text"
                required
                value={originatingCountry}
                onChange={(e) => setOriginatingCountry(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
              />
            </div>

            <div>
              <label className="block text-[#3D405B] font-medium mb-1">Banco Receptor en Venezuela</label>
              <select
                value={destinationBankVzla}
                onChange={(e) => setDestinationBankVzla(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
              >
                <option value="Banco Nacional de Crédito (BNC)">Banco Nacional de Crédito (BNC)</option>
                <option value="Banesco Banco Universal">Banesco Banco Universal</option>
                <option value="Banco de Venezuela, S.A.">Banco de Venezuela (BDV)</option>
                <option value="Banco Mercantil">Banco Mercantil</option>
              </select>
            </div>

            <div>
              <label className="block text-[#3D405B] font-medium mb-1">Cuenta en Divisas (20 dígitos)</label>
              <input
                type="text"
                value={destinationAccountNum}
                onChange={(e) => setDestinationAccountNum(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3D405B] font-medium mb-1">
              Concepto / SWIFT MT103 Memo (Field 70)
            </label>
            <textarea
              rows={2}
              required
              value={memoRaw}
              onChange={(e) => setMemoRaw(e.target.value)}
              className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono text-[11px]"
            />
          </div>

          {/* Real-time ML Classification Box */}
          <div className="bg-[#FAF8F5] border border-[#D8E2DC] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#3D405B] text-xs">
                <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                <span>Resultado del Algoritmo de Aprendizaje Automático:</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-semibold text-[11px]">
                {(mlResult.confidence * 100).toFixed(0)}% Confianza
              </span>
            </div>

            <div className="text-xs">
              <strong className="text-[#3D405B]">Categoría Predicha:</strong>{' '}
              <span className="font-semibold text-emerald-800">{mlResult.category}</span>
            </div>

            <div className="text-[11px] text-[#3D405B]/80">{mlResult.explanation}</div>

            {mlResult.detectedKeywords.length > 0 && (
              <div className="text-[10px] text-[#3D405B]/70 font-mono">
                Tokens clave extraídos: [{mlResult.detectedKeywords.join(', ')}]
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8E2DC] text-[11px] font-mono-numbers">
              <div className="bg-white p-2 rounded border border-[#D8E2DC]">
                <span className="text-[#3D405B]/60 block font-sans text-[10px]">
                  Retención 80% Bóveda (Art. 57):
                </span>
                <strong className="text-emerald-700 block">{formatCurrencyUsd(retention80Usd)}</strong>
                <span className="text-[10px] text-emerald-800/80 block font-mono">
                  {formatCurrencyBs(retention80Usd * bcvRate)}
                </span>
              </div>
              <div className="bg-white p-2 rounded border border-[#D8E2DC]">
                <span className="text-[#3D405B]/60 block font-sans text-[10px]">Venta 20% al BCV:</span>
                <strong className="text-[#3D405B] block">{formatCurrencyUsd(saleBcv20Usd)}</strong>
                <span className="text-[10px] text-[#3D405B]/80 block font-mono">
                  {formatCurrencyBs(saleBcv20Usd * bcvRate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8E2DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D8E2DC] text-[#3D405B] rounded-lg hover:bg-[#FAF8F5]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white font-bold rounded-lg shadow-sm"
            >
              Guardar & Incorporar a Bóveda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
