export interface ForeignTransfer {
  id: string;
  date: string;
  referenceSwift: string;
  originatingBank: string;
  originatingCountry: string;
  destinationBankVzla: string;
  destinationAccountNum: string;
  senderEntity: string;
  amountUsd: number;
  memoRaw: string;
  bcvRate: number; // Bolívares por USD oficial
  amountBs: number;
  // ML Classification fields
  mlCategory: 
    | 'ANTICIPO_EXPORTACION_ART57'
    | 'VENTA_SPOT_CAFE_VERDE'
    | 'FINANCIAMIENTO_EXTERIOR_COSECHA'
    | 'APORTE_CAPITAL_AGRO'
    | 'SERVICIOS_LOGISTICA_FLETE';
  mlConfidence: number; // 0 to 1
  mlExplanation: string;
  // Legal justification fields (Convenio Cambiario N° 1)
  convenioArt: string; // "Art. 57 (Retención 80% exportador / 20% BCV)", "Arts. 31 y 32"
  retention80Usd: number;
  saleBcv20Usd: number;
  justificationBankLetter: string;
  justificationSeniatNote: string;
  status: 'PENDIENTE_JUSTIFICAR' | 'JUSTIFICADO_BANCO' | 'EN_BOVEDA_DISPONIBLE' | 'AMORTIZADO';
  assignedToAdvancesUsd: number;
}

export interface Producer {
  id: string;
  fullName: string;
  idNumber: string; // Cédula ej: V-14.890.123
  rif: string; // RIF ej: V-14890123-1
  runopaId: string; // MPPAT ej: RUNOPA-PORT-2026-8812
  sigesaiCertCode: string; // INSAI ej: SIGESAI-INSAI-009912
  sicaCode: string; // SUNAGRO ej: SICA-99412
  farmName: string;
  state: string; // ej. Portuguesa, Lara, Mérida, Trujillo, Monagas
  municipality: string;
  sector: string;
  approvedHectares: number;
  coffeeVariety: string; // ej. Caturra, Catuaí, Típica, Monteclaro
  historicalYieldQHa: number; // Quintales por Hectárea (10 a 20)
  bankName: string;
  accountNumber: string;
  phone: string;
  phytosanitaryStatus: 'APROBADO' | 'EN_INSPECCION' | 'CONDICIONADO';
}

export interface AdvanceContract {
  id: string;
  contractNumber: string;
  cutCode: string; // Código Único de Trazabilidad ej: CUT-CAFÉ-2026-0045-JM
  producerId: string;
  producerName: string;
  producerIdNumber: string;
  runopaId: string;
  sigesaiCertCode: string;
  farmName: string;
  state: string;
  hectares: number;
  rHa: number; // Rendimiento quintales por ha
  estimatedQuintals: number; // P_est = H * R_ha
  basePriceUsd: number; // P_base USD/Quintal
  projectedCropValueUsd: number;
  coverageAlpha: number; // ej. 0.40 (40%)
  maxAdvanceUsd: number; // A_max
  amountUsd: number;
  bcvRateAtIssue: number;
  amountBs: number;
  paymentMethod: 'TRANSFERENCIA_BANCARIA' | 'EFECTIVO_CAMPO';
  bankRef: string;
  sourceTransferId: string; // Vínculo con transferencia del exterior
  issueDate: string;
  settlementTerm: string; // ej. "01 de Octubre a 28 de Febrero"
  status: 'ACTIVO_PENDIENTE' | 'LIQUIDADO_OCTUBRE' | 'AMORTIZADO_PARCIAL';
  amortizedAmountUsd: number;
  balancePendingUsd: number;
  offlineHashSha256: string;
  biometricVerified: boolean;
  notes: string;
}

export interface HarvestReception {
  id: string;
  date: string;
  contractId: string;
  cutCode: string;
  producerName: string;
  sicaGuideNum: string; // SUNAGRO Guía SICA
  quintalsDelivered: number; // Quintales CPS entregados
  // Laboratorio 250g
  sampleWeightGrams: number; // 250g
  pasillaGrams: number;
  brocaGrams: number;
  cleanAlmondGrams: number; // 250 - (P + B)
  yieldFactorFr: number; // FR = 87.50 / (A_sana / 250)
  qualityGrade: 'ESPECIAL_AA' | 'LAVADO_FINO' | 'CORRIENTE_COMERCIAL';
  settlementPricePerQUsd: number;
  grossValueUsd: number;
  bcvRateSettlement: number;
  grossValueBs: number;
  // Amortización del anticipo
  amortizedAdvanceUsd: number;
  historicalAdvanceRate: number;
  historicalAdvanceBs: number;
  reexpressedAdvanceBs: number;
  exchangeGainBs: number; // Diferencial Cambiario NIC 21 (7120.01)
  // Retención Tributaria SENIAT
  islrRate: number; // 0.015 (1.5% compra primaria)
  islrWithholdingBs: number;
  netPayableUsd: number;
  netPayableBs: number;
  paymentBankRef: string;
  status: 'LIQUIDADO';
}

export interface AccountingEntryItem {
  accountCode: string;
  accountName: string;
  debitBs: number;
  creditBs: number;
  debitUsd: number;
  creditUsd: number;
}

export interface AccountingSeat {
  id: string;
  seatNumber: string;
  date: string;
  concept: string;
  cutCode?: string;
  sourceModule: 'BOVEDA_EXTERIOR' | 'ANTICIPOS_PRODUCTOR' | 'RECEPCION_OCTUBRE' | 'TRIBUTARIO_SENIAT';
  standard: 'VEN-NIF / NIC 21';
  items: AccountingEntryItem[];
  totalDebitBs: number;
  totalCreditBs: number;
}

export interface BankReconciliationItem {
  id: string;
  date: string;
  reference: string;
  description: string;
  amountUsd: number;
  amountBs: number;
  bcvRate: number;
  type: 'INGRESO' | 'EGRESO';
  category: 'EXTERIOR_SWIFT' | 'ANTICIPO_PRODUCTOR' | 'LIQUIDACION_NETA' | 'VENTA_BCV_20' | 'GASTO_OPERATIVO';
  matchedInBooks: boolean;
  bookSeatNumber?: string;
  status: 'CONCILIADO' | 'EN_TRANSITO' | 'REQUIERE_JUSTIFICACION';
}

export interface CoffeeMarketPrice {
  nyCPriceCentsLb: number; // C-Price NY en centavos / libra
  nyCPriceUsdQuintal: number; // 1 quintal = 100 lb o 46 kg aprox
  venezuelaPremiumUsd: number; // Diferencial de origen venezolano
  suggestedBasePriceUsd: number;
  lastUpdated: string;
}
