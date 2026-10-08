export interface AgronomicEstimation {
  hectares: number;
  yieldQHa: number;
  estimatedQuintals: number;
  basePriceUsd: number;
  projectedCropValueUsd: number;
  alphaCoverage: number;
  maxAdvanceUsd: number;
}

export function calculateAdvanceCeiling(
  hectares: number,
  yieldQHa: number,
  basePriceUsd: number,
  alphaCoverage: number = 0.40
): AgronomicEstimation {
  const estimatedQuintals = Number((hectares * yieldQHa).toFixed(2));
  const projectedCropValueUsd = Number((estimatedQuintals * basePriceUsd).toFixed(2));
  const maxAdvanceUsd = Number((alphaCoverage * projectedCropValueUsd).toFixed(2));

  return {
    hectares,
    yieldQHa,
    estimatedQuintals,
    basePriceUsd,
    projectedCropValueUsd,
    alphaCoverage,
    maxAdvanceUsd,
  };
}

export interface YieldFactorResult {
  sampleWeightGrams: number; // 250g
  pasillaGrams: number;
  brocaGrams: number;
  cleanAlmondGrams: number;
  cleanAlmondRatio: number;
  yieldFactorFr: number; // FR = 87.50 / (A_sana / 250)
  qualityClassification: 'ESPECIAL_AA' | 'LAVADO_FINO' | 'CORRIENTE_COMERCIAL';
  evaluationNotes: string;
}

export function calculateYieldFactor(
  pasillaGrams: number,
  brocaGrams: number,
  sampleWeightGrams: number = 250
): YieldFactorResult {
  const defects = Math.max(0, pasillaGrams + brocaGrams);
  const cleanAlmondGrams = Math.max(0, Number((sampleWeightGrams - defects).toFixed(2)));
  const cleanAlmondRatio = cleanAlmondGrams / sampleWeightGrams;
  
  // FR = 87.50 / (A_sana / 250)
  const yieldFactorFr = cleanAlmondRatio > 0 ? Number((87.50 / cleanAlmondRatio).toFixed(2)) : 0;

  let qualityClassification: 'ESPECIAL_AA' | 'LAVADO_FINO' | 'CORRIENTE_COMERCIAL' = 'LAVADO_FINO';
  let evaluationNotes = '';

  if (yieldFactorFr <= 90.0) {
    qualityClassification = 'ESPECIAL_AA';
    evaluationNotes = 'Calidad Superior (Almendra densa, merma por broca y pasilla inferior al 5%). Apto para exportación specialty gourmet.';
  } else if (yieldFactorFr <= 94.0) {
    qualityClassification = 'LAVADO_FINO';
    evaluationNotes = 'Calidad Estándar Fino venezolano (Rendimiento comercial óptimo de trilla). Cumple estándares de exportación.';
  } else {
    qualityClassification = 'CORRIENTE_COMERCIAL';
    evaluationNotes = 'Calidad Comercial Corriente (Alto porcentaje de pasilla o picado). Destinado a mercado nacional torrefacción.';
  }

  return {
    sampleWeightGrams,
    pasillaGrams,
    brocaGrams,
    cleanAlmondGrams,
    cleanAlmondRatio,
    yieldFactorFr,
    qualityClassification,
    evaluationNotes,
  };
}

// Generate simple deterministic SHA-256-like hex hash for offline digital receipt
export function generateDigitalActaHash(
  cutCode: string,
  producerIdNumber: string,
  amountUsd: number,
  dateIso: string,
  gps: string
): string {
  const payload = `${cutCode}|${producerIdNumber}|${amountUsd}|${dateIso}|${gps}|NOMINUS_VENEZUELA_HASH_SALT`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash ^ 0x5f3759df).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs((hash << 3) ^ 0xa5a5a5a5).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs((hash >> 2) ^ 0x12345678).toString(16).padStart(8, '0');
  return `${hexPart1}${hexPart2}${hexPart3}${hexPart4}`.toUpperCase();
}
