import React from 'react';
import { AdvanceContract } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { formatCurrencyBs, formatCurrencyUsd } from '../utils/accountingEngine';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ContractModalProps {
  contract: AdvanceContract;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full border border-[#D8E2DC] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#FAF8F5] px-6 py-3.5 border-b border-[#D8E2DC] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E07A5F]" />
            <div>
              <h3 className="text-sm font-bold text-[#3D405B]">
                Documento Legal Formal: Contrato de Compraventa de Cosecha Futura
              </h3>
              <p className="text-[11px] text-[#3D405B]/70">
                Código CUT: <strong className="font-mono text-[#3D405B]">{contract.cutCode}</strong> · Art. 1.332 CCV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3D405B] hover:bg-[#2D3142] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#3D405B]/60 hover:text-[#3D405B] rounded-md text-lg font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Document Body (Formal Legal Layout) */}
        <div className="p-8 sm:p-12 overflow-y-auto font-serif text-[#1e2029] leading-relaxed text-[13px] bg-white space-y-6 print:p-0">
          {/* Header Office */}
          <div className="text-center border-b border-black/20 pb-6 font-sans">
            <div className="text-xs uppercase tracking-widest text-neutral-600 font-bold">
              República Bolivariana de Venezuela
            </div>
            <div className="text-sm uppercase tracking-wide font-bold text-neutral-800 mt-0.5">
              Sector Agroindustrial Cafetalero · Circuito de Financiamiento Productivo
            </div>
            <h1 className="text-base sm:text-lg font-extrabold uppercase mt-3 tracking-tight text-neutral-900 font-serif">
              CONTRATO DE COMPRAVENTA DE COSECHA FUTURA DE CAFÉ CON ENTREGAS PROGRESIVAS Y ANTICIPO DE FINANCIAMIENTO
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-mono mt-2 text-neutral-600">
              <span>N° DOCUMENTO: {contract.contractNumber}</span>
              <span>·</span>
              <span>CÓDIGO ÚNICO TRAZABILIDAD: {contract.cutCode}</span>
            </div>
          </div>

          {/* Intro Paragraph */}
          <p className="text-justify indent-8">
            Entre la sociedad mercantil <strong>{COMPANY_INFO.name}</strong>, domiciliada en {COMPANY_INFO.address}, inscrita en el Registro Mercantil Primero de la Circunscripción Judicial del Estado Portuguesa, bajo el número de Información Fiscal (RIF) <strong>{COMPANY_INFO.rif}</strong> y Código SICA de Beneficio <strong>{COMPANY_INFO.sicaCode}</strong>, representada en este acto por el ciudadano <strong>{COMPANY_INFO.legalRepresentative}</strong>, titular de la cédula de identidad N° <strong>{COMPANY_INFO.repId}</strong>, en lo sucesivo denominada <strong>"LA EMPRESA"</strong>; y por la otra parte el ciudadano <strong>{contract.producerName}</strong>, titular de la cédula de identidad N° <strong>{contract.producerIdNumber}</strong>, debidamente inscrito en el Registro Único Nacional Obligatorio y Permanente de Productores Agrícolas (RUNOPA) bajo el N° <strong>{contract.runopaId}</strong>, y con Certificado de Sanidad Vegetal SIGESAI (INSAI) N° <strong>{contract.sigesaiCertCode}</strong>, domiciliado en el sector {contract.farmName}, Municipio Sucre/Unda del Estado {contract.state}, en lo sucesivo denominado <strong>"EL PRODUCTOR"</strong>, se ha convenido en celebrar el presente contrato mercantil regido por el <strong>Artículo 1.332 del Código Civil de Venezuela</strong> y las disposiciones del Código de Comercio, sujeto a las siguientes cláusulas:
          </p>

          {/* Cláusula Primera */}
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-neutral-900 mb-1">
              PRIMERA: DEL OBJETO Y PREDIO AGRÍCOLA
            </h4>
            <p className="text-justify">
              <strong>EL PRODUCTOR</strong> compromete y vende a favor de <strong>LA EMPRESA</strong> la totalidad de la producción de café pergamino seco (CPS) correspondiente a la cosecha del ciclo agrícola <strong>2026-2027</strong>, estimada mediante inspección técnica agronómica en una masa física aproximada de <strong>{contract.estimatedQuintals.toFixed(2)} quintales (Q)</strong>, cultivada en el predio denominado <strong>"{contract.farmName}"</strong>, ubicado en la jurisdicción del Estado {contract.state}, con una superficie geográfica aprovechable y verificada de <strong>{contract.hectares.toFixed(2)} hectáreas</strong>.
            </p>
          </div>

          {/* Cláusula Segunda */}
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-neutral-900 mb-1">
              SEGUNDA: DEL ANTICIPO Y FINANCIAMIENTO OPERATIVO
            </h4>
            <p className="text-justify">
              Para atender los costos inherentes a la fertilización, control fitosanitario, poda, limpia y contratación de mano de obra previa al inicio de la zafra de recolección en el mes de octubre, <strong>LA EMPRESA</strong> entrega en este acto a <strong>EL PRODUCTOR</strong> la suma de <strong>{formatCurrencyUsd(contract.amountUsd)}</strong>, calculados y liquidados a la tasa oficial de cambio del Banco Central de Venezuela (BCV) de <strong>Bs. {contract.bcvRateAtIssue.toFixed(4)} por USD</strong>, equivalentes a <strong>{formatCurrencyBs(contract.amountBs)}</strong>. Dicho monto es desembolsado mediante <strong>{contract.paymentMethod === 'TRANSFERENCIA_BANCARIA' ? 'Transferencia Bancaria Nacional' : 'Entrega en Efectivo Autorizada para Campo'}</strong> según constancia de referencia <strong>{contract.bankRef}</strong>. La citada suma reviste el carácter legal exclusivo de <strong>PAGO ANTICIPADO A CUENTA DEL PRECIO FINAL</strong> de la cosecha contratada, y no constituye préstamo de dinero ni genera intereses de ninguna naturaleza.
            </p>
          </div>

          {/* Cláusula Tercera */}
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-neutral-900 mb-1">
              TERCERA: DE LA RECEPCIÓN, FACTURACIÓN Y LIQUIDACIÓN EN ZAFRA (OCTUBRE)
            </h4>
            <p className="text-justify">
              <strong>EL PRODUCTOR</strong> se obliga formalmente a trasladar y entregar el café pergamino seco en la planta de beneficio de <strong>LA EMPRESA</strong> entre el 01 de octubre de 2026 y el 28 de febrero de 2027, amparado en su respectiva Guía de Movilización SICA (SUNAGRO). Al momento de cada recepción, se emitirá el comprobante de pesaje, determinando el peso neto y el <strong>Factor de Rendimiento (FR)</strong> de la almendra sana según análisis de laboratorio sobre muestra de 250 gramos. <strong>LA EMPRESA</strong> procederá a la liquidación y emisión del comprobante de compra primaria definitiva, descontando y amortizando del valor total a pagar el monto del anticipo otorgado en la cláusula segunda, aplicando la <strong>retención del 1,5% de Impuesto Sobre la Renta (ISLR)</strong> correspondiente a compras primarias agrícolas de personas naturales conforme a las directrices del SENIAT, y cancelando el saldo neto restante a favor de <strong>EL PRODUCTOR</strong>.
            </p>
          </div>

          {/* Cláusula Cuarta */}
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-neutral-900 mb-1">
              CUARTA: CLÁUSULA PENAL Y RESOLUCIÓN INTERRUPTIVA
            </h4>
            <p className="text-justify">
              El incumplimiento injustificado en la entrega del café contratado, o el desvío comprobado de los recursos otorgados para fines ajenos al mantenimiento del cafetal, facultará a <strong>LA EMPRESA</strong> a rescindir de pleno derecho el presente contrato mercantil y exigir el reintegro inmediato del capital desembolsado en anticipo reajustado según la variación cambiaria oficial del BCV, más una indemnización equivalente al 20% del valor total del financiamiento otorgado.
            </p>
          </div>

          {/* Cláusula Quinta */}
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-wider text-neutral-900 mb-1">
              QUINTA: DOMICILIO ESPECIAL Y JURISDICCIÓN
            </h4>
            <p className="text-justify">
              Para todos los efectos y derivadas acciones legales del presente instrumento, las partes eligen como domicilio especial y excluyente a la ciudad de Biscucuy, Estado Portuguesa, a la jurisdicción de cuyos tribunales declaran someterse de forma irrevocable.
            </p>
          </div>

          {/* Signatures and Hashes Block */}
          <div className="pt-8 border-t border-black/20 font-sans space-y-6">
            <div className="text-xs text-neutral-600 font-mono text-center">
              Constancia de Integridad Criptográfica: {contract.offlineHashSha256} · Verificado Biométricamente
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
              <div className="border-t border-black pt-2">
                <div className="font-bold text-neutral-900">{COMPANY_INFO.legalRepresentative}</div>
                <div className="text-neutral-700">Por: {COMPANY_INFO.name}</div>
                <div className="text-neutral-500 font-mono">RIF: {COMPANY_INFO.rif} (LA EMPRESA)</div>
              </div>

              <div className="border-t border-black pt-2">
                <div className="font-bold text-neutral-900">{contract.producerName}</div>
                <div className="text-neutral-700">C.I.: {contract.producerIdNumber}</div>
                <div className="text-neutral-500 font-mono">RUNOPA: {contract.runopaId} (EL PRODUCTOR)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
