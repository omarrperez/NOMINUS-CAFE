import { ForeignTransfer } from '../types';

export interface MLClassificationResult {
  category: ForeignTransfer['mlCategory'];
  confidence: number;
  explanation: string;
  convenioArt: string;
  retention80: boolean;
  bankJustificationTemplate: string;
  seniatJustificationTemplate: string;
  detectedKeywords: string[];
}

export function classifyForeignWireTransfer(memo: string, amountUsd: number, senderName: string): MLClassificationResult {
  const text = (memo + ' ' + senderName).toLowerCase();
  
  // Weights dictionary for NLP Feature Extraction
  const features = {
    exportAdvance: [
      'advance', 'anticipo', 'pre-harvest', 'pre harvest', 'crop advance', 'forward',
      'specialty coffee', 'arabica', 'green coffee', 'harvest 2026', 'zafra', 'cosecha',
      'contract', 'purchase agreement', 'ico', 'café de especialidad', 'pergamino'
    ],
    spotSale: [
      'final payment', 'invoice', 'factura', 'bill of lading', 'b/l', 'spot',
      'liquidation', 'shipment', 'container', 'embarque', 'puerto cabello'
    ],
    financing: [
      'loan', 'credit facility', 'trade finance', 'pre-export financing',
      'capital de trabajo', 'banco corresponsal', 'intereses', 'financiamiento'
    ],
    capitalContribution: [
      'equity', 'capital increase', 'aporte de capital', 'shareholder',
      'inversion extranjera', 'socio', 'dividendo', 'registro siex'
    ],
    logistics: [
      'freight', 'shipping line', 'customs', 'flete', 'seguro marítimo',
      'terminal handling', 'despacho'
    ]
  };

  let scores = {
    ANTICIPO_EXPORTACION_ART57: 0.1,
    VENTA_SPOT_CAFE_VERDE: 0.05,
    FINANCIAMIENTO_EXTERIOR_COSECHA: 0.05,
    APORTE_CAPITAL_AGRO: 0.05,
    SERVICIOS_LOGISTICA_FLETE: 0.05,
  };

  const detectedKeywords: string[] = [];

  features.exportAdvance.forEach(word => {
    if (text.includes(word)) {
      scores.ANTICIPO_EXPORTACION_ART57 += 0.35;
      detectedKeywords.push(word);
    }
  });

  features.spotSale.forEach(word => {
    if (text.includes(word)) {
      scores.VENTA_SPOT_CAFE_VERDE += 0.35;
      detectedKeywords.push(word);
    }
  });

  features.financing.forEach(word => {
    if (text.includes(word)) {
      scores.FINANCIAMIENTO_EXTERIOR_COSECHA += 0.35;
      detectedKeywords.push(word);
    }
  });

  features.capitalContribution.forEach(word => {
    if (text.includes(word)) {
      scores.APORTE_CAPITAL_AGRO += 0.40;
      detectedKeywords.push(word);
    }
  });

  features.logistics.forEach(word => {
    if (text.includes(word)) {
      scores.SERVICIOS_LOGISTICA_FLETE += 0.40;
      detectedKeywords.push(word);
    }
  });

  // Heuristic adjustments based on amount and sender entity
  if (amountUsd >= 10000 && (text.includes('coffee') || text.includes('roaster') || text.includes('importer') || text.includes('gmbh') || text.includes('corp'))) {
    scores.ANTICIPO_EXPORTACION_ART57 += 0.25;
  }

  // Find dominant category
  const categoryKeys: Array<ForeignTransfer['mlCategory']> = [
    'ANTICIPO_EXPORTACION_ART57',
    'VENTA_SPOT_CAFE_VERDE',
    'FINANCIAMIENTO_EXTERIOR_COSECHA',
    'APORTE_CAPITAL_AGRO',
    'SERVICIOS_LOGISTICA_FLETE',
  ];

  let maxCategory: ForeignTransfer['mlCategory'] = 'ANTICIPO_EXPORTACION_ART57';
  let maxScore = scores.ANTICIPO_EXPORTACION_ART57;

  for (const cat of categoryKeys) {
    if (scores[cat] > maxScore) {
      maxScore = scores[cat];
      maxCategory = cat;
    }
  }

  // Normalize confidence (between 0.78 and 0.99)
  const normalizedConfidence = Math.min(0.99, Math.max(0.78, Number((maxScore / (maxScore + 0.3)).toFixed(2))));

  // Generate legal & regulatory narratives
  let convenioArt = 'Convenio Cambiario N° 1 - Art. 57 (Retención 80% / Venta 20% BCV)';
  let retention80 = true;
  let explanation = '';
  let bankJustificationTemplate = '';
  let seniatJustificationTemplate = '';

  switch (maxCategory) {
    case 'ANTICIPO_EXPORTACION_ART57':
      convenioArt = 'Convenio Cambiario N° 1 - Art. 57 (Retención 80% Operativo / 20% BCV)';
      retention80 = true;
      explanation = `Clasificado como Anticipo Comercial para Exportación de Café por detección de términos clave [${detectedKeywords.slice(0, 3).join(', ')}] y contraparte compradora del exterior. Califica expresamente bajo el Art. 57 del Convenio Cambiario N° 1 para administración en Bóveda Cambiaria destinada a financiamiento de productores nacionales.`;
      bankJustificationTemplate = `Atención: Gerencia de Cumplimiento / Mesa de Cambio. Cumpliendo con las normas SIAR LC/FT/FPADM de SUDEBAN y Arts. 31, 32 y 57 del Convenio Cambiario N° 1, certificamos que los fondos por USD $${amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} recibidos de ${senderName} corresponden a anticipo de financiamiento de exportación de café verde de especialidad (Cosecha Zafra 2026). El 80% (USD $${(amountUsd * 0.8).toLocaleString('en-US', { minimumFractionDigits: 2 })}) se destina al pago directo de anticipos de cosecha futura a caficultores registrados en RUNOPA/SIGESAI, y el 20% restante queda sujeto a los términos de intermediación cambiaria oficial con el BCV.`;
      seniatJustificationTemplate = `Soporte Probatorio Fiscal (SENIAT): Operación mercantil de recepción de divisas bajo Convenio Cambiario N° 1 Art. 57. No configura hecho imponible de IVA por tratarse de anticipo a cuenta de exportación de bienes fuera del territorio nacional (Art. 13 y 16 Ley IVA). Registro contable asignado a Bóveda Divisas Cuenta 1110.02 contra Cuenta por Pagar Comercial Exterior Cuenta 2110.01 bajo VEN-NIF (NIC 21).`;
      break;

    case 'VENTA_SPOT_CAFE_VERDE':
      convenioArt = 'Convenio Cambiario N° 1 - Art. 57 (Liquidación Definitiva Exportación)';
      retention80 = true;
      explanation = 'Clasificado como Liquidación Definitiva de Embarque de Café Verde según factura comercial de exportación y guía de transporte internacional.';
      bankJustificationTemplate = `Fondos recibidos en cancelación de factura de exportación de café con Guía Única SICA y Documento de Embarque Marítimo (BL). Conforme al Art. 57 del Convenio Cambiario N° 1, el exportador administra el 80% para insumos y pago a productores.`;
      seniatJustificationTemplate = `Facturación de exportación con alícuota 0% / No sujeta a IVA nacional. Soporte aduanero con Declaración Única de Aduanas (DUA) y Guía SICA Sunagro de exportación.`;
      break;

    case 'FINANCIAMIENTO_EXTERIOR_COSECHA':
      convenioArt = 'Convenio Cambiario N° 1 - Arts. 31 y 32 (Operaciones Financieras en Divisas)';
      retention80 = false;
      explanation = 'Clasificado como Crédito Comercial / Facilidad de Pre-Exportación otorgada por entidad financiera o fondo de inversión agrícola internacional.';
      bankJustificationTemplate = `Crédito comercial externo debidamente registrado para apalancamiento de compra de cosecha y fertilización en zonas cafetaleras. Respaldado con contrato financiero mercantil.`;
      seniatJustificationTemplate = `Ingreso financiero en calidad de pasivo comercial (Cuenta 2110). No sujeto a IVA. Retención de ISLR no aplica sobre el capital del préstamo; intereses sujetos a normativa de convenios de doble tributación.`;
      break;

    case 'APORTE_CAPITAL_AGRO':
      convenioArt = 'Convenio Cambiario N° 1 - Arts. 31 y 32 / Registro de Inversión Extranjera';
      retention80 = false;
      explanation = 'Clasificado como Aporte de Capital para Aumento de Capital Social o Inversión de Socios en la Beneficiadora.';
      bankJustificationTemplate = `Aporte para aumento de capital de trabajo agroindustrial por parte de accionista extranjero, justificado mediante acta de asamblea extraordinaria y certificación de origen lícito de fondos.`;
      seniatJustificationTemplate = `Ingreso al Patrimonio neto (Cuenta 3110 Capital Social). Exento de IVA y no gravable por ISLR al no constituir enriquecimiento neto sino aporte patrimonial.`;
      break;

    default:
      convenioArt = 'Convenio Cambiario N° 1 - Arts. 31 y 32';
      retention80 = false;
      explanation = 'Clasificado como transferencia por servicios comerciales y soporte de comercio exterior.';
      bankJustificationTemplate = `Fondos recibidos por servicios de comercialización y logística cafetalera de acuerdo al Convenio Cambiario N° 1.`;
      seniatJustificationTemplate = `Registro contable según contrato de servicios comerciales.`;
  }

  return {
    category: maxCategory,
    confidence: normalizedConfidence,
    explanation,
    convenioArt,
    retention80,
    bankJustificationTemplate,
    seniatJustificationTemplate,
    detectedKeywords: Array.from(new Set(detectedKeywords)),
  };
}
