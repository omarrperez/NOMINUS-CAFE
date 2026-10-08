import { AccountingSeat, ForeignTransfer, AdvanceContract, HarvestReception } from '../types';

export function formatCurrencyBs(amount: number): string {
  return 'Bs. ' + amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrencyUsd(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
}

export function createInflowAccountingSeat(transfer: ForeignTransfer, seatIndex: number): AccountingSeat {
  const seatNumber = `AS-ING-${transfer.date.replace(/-/g, '').slice(2)}-${String(seatIndex).padStart(3, '0')}`;
  const totalDebitBs = transfer.amountBs;
  const totalCreditBs = transfer.amountBs;

  return {
    id: `seat-inflow-${transfer.id}`,
    seatNumber,
    date: transfer.date,
    concept: `Recepción de divisas del exterior vía Convenio Cambiario N° 1 (${transfer.referenceSwift}) de ${transfer.senderEntity}. Clasificado: ${transfer.mlCategory}. Tasa BCV: Bs. ${transfer.bcvRate.toFixed(4)}.`,
    cutCode: transfer.referenceSwift,
    sourceModule: 'BOVEDA_EXTERIOR',
    standard: 'VEN-NIF / NIC 21',
    items: [
      {
        accountCode: '1110.02',
        accountName: `Banco Nacional (${transfer.destinationBankVzla}) - Cuenta Moneda Extranjera (USD)`,
        debitBs: transfer.amountBs,
        creditBs: 0,
        debitUsd: transfer.amountUsd,
        creditUsd: 0,
      },
      {
        accountCode: '2110.01',
        accountName: `Cuentas por Pagar Comerciales Exterior / Anticipos Clientes Café (Art. 57)`,
        debitBs: 0,
        creditBs: transfer.amountBs,
        debitUsd: 0,
        creditUsd: transfer.amountUsd,
      },
    ],
    totalDebitBs,
    totalCreditBs,
  };
}

export function createAdvanceAccountingSeat(contract: AdvanceContract, seatIndex: number): AccountingSeat {
  const seatNumber = `AS-ANT-${contract.issueDate.replace(/-/g, '').slice(2)}-${String(seatIndex).padStart(3, '0')}`;
  const totalDebitBs = contract.amountBs;
  const totalCreditBs = contract.amountBs;

  const items = [
    {
      accountCode: '1330.01',
      accountName: `Anticipos a Productores de Café (Activo Corriente - Cosecha Futura Art. 1.332 CCV) - ${contract.producerName}`,
      debitBs: contract.amountBs,
      creditBs: 0,
      debitUsd: contract.amountUsd,
      creditUsd: 0,
    },
    {
      accountCode: '1110.02',
      accountName: `Banco Nacional - Cuenta Divisas Convenio Cambiario N° 1 (${contract.paymentMethod === 'EFECTIVO_CAMPO' ? 'Retiro Autorizado Efectivo Rural' : 'Transferencia Bancaria'})`,
      debitBs: 0,
      creditBs: contract.amountBs,
      debitUsd: 0,
      creditUsd: contract.amountUsd,
    },
  ];

  // If cash in foreign currency by Special Taxpayer, include 3% IGTF tax obligation
  if (contract.paymentMethod === 'EFECTIVO_CAMPO') {
    const igtfRate = 0.03;
    const igtfBs = Number((contract.amountBs * igtfRate).toFixed(2));
    const igtfUsd = Number((contract.amountUsd * igtfRate).toFixed(2));
    items.push({
      accountCode: '6210.05',
      accountName: 'Gastos Tributarios - Impuesto a las Grandes Transacciones Financieras (IGTF 3% SPE)',
      debitBs: igtfBs,
      creditBs: 0,
      debitUsd: igtfUsd,
      creditUsd: 0,
    });
    items.push({
      accountCode: '2140.05',
      accountName: 'Retención / IGTF 3% por Enterar al SENIAT (Pagos en Divisas Fuera Sistema)',
      debitBs: 0,
      creditBs: igtfBs,
      debitUsd: 0,
      creditUsd: igtfUsd,
    });
  }

  const calculatedDebit = items.reduce((acc, curr) => acc + curr.debitBs, 0);
  const calculatedCredit = items.reduce((acc, curr) => acc + curr.creditBs, 0);

  return {
    id: `seat-advance-${contract.id}`,
    seatNumber,
    date: contract.issueDate,
    concept: `Desembolso de anticipo de cosecha futura a productor ${contract.producerName} (${contract.producerIdNumber}) según contrato mercantil. Código Trazabilidad: ${contract.cutCode}. Tasa BCV: Bs. ${contract.bcvRateAtIssue.toFixed(4)}.`,
    cutCode: contract.cutCode,
    sourceModule: 'ANTICIPOS_PRODUCTOR',
    standard: 'VEN-NIF / NIC 21',
    items,
    totalDebitBs: calculatedDebit,
    totalCreditBs: calculatedCredit,
  };
}

export function createHarvestSettlementSeat(
  reception: HarvestReception,
  seatIndex: number
): AccountingSeat {
  const seatNumber = `AS-LIQ-${reception.date.replace(/-/g, '').slice(2)}-${String(seatIndex).padStart(3, '0')}`;

  const items = [
    // 1. Ingreso del café cosechado al inventario a tasa de liquidación
    {
      accountCode: '1130.01',
      accountName: `Inventarios - Café Pergamino Seco (Almacén Beneficio Cordillera) [${reception.quintalsDelivered} Q @ FR ${reception.yieldFactorFr}]`,
      debitBs: reception.grossValueBs,
      creditBs: 0,
      debitUsd: reception.grossValueUsd,
      creditUsd: 0,
    },
    // 2. Cierre y amortización del anticipo al costo histórico registrado
    {
      accountCode: '1330.01',
      accountName: `Anticipos a Productores de Café (Cierre Saldo Histórico Activo Corriente)`,
      debitBs: 0,
      creditBs: reception.historicalAdvanceBs,
      debitUsd: 0,
      creditUsd: reception.amortizedAdvanceUsd,
    },
    // 3. Diferencial cambiario por reexpresión del anticipo a tasa de liquidación (NIC 21)
    {
      accountCode: '7120.01',
      accountName: `Ganancia por Diferencial Cambiario (Ajuste Reexpresión Anticipo Tasa BCV Octubre NIC 21)`,
      debitBs: 0,
      creditBs: reception.exchangeGainBs,
      debitUsd: 0,
      creditUsd: 0,
    },
    // 4. Retención de ISLR del 1.5% compra primaria de rubros agrícolas (SENIAT)
    {
      accountCode: '2140.01',
      accountName: `Retención ISLR por Enterar al SENIAT (1.5% Adquisición Primaria Agrícola Exenta IVA)`,
      debitBs: 0,
      creditBs: reception.islrWithholdingBs,
      debitUsd: 0,
      creditUsd: Number((reception.islrWithholdingBs / reception.bcvRateSettlement).toFixed(2)),
    },
    // 5. Saldo neto cancelado al productor
    {
      accountCode: '1110.01',
      accountName: `Banco Nacional - Pago Finiquito Neto Liquidación Zafra al Productor (Ref ${reception.paymentBankRef})`,
      debitBs: 0,
      creditBs: reception.netPayableBs,
      debitUsd: 0,
      creditUsd: reception.netPayableUsd,
    },
  ];

  const totalDebitBs = items.reduce((sum, item) => sum + item.debitBs, 0);
  const totalCreditBs = items.reduce((sum, item) => sum + item.creditBs, 0);

  return {
    id: `seat-settlement-${reception.id}`,
    seatNumber,
    date: reception.date,
    concept: `Liquidación definitiva de cosecha zafra octubre para ${reception.producerName} (${reception.quintalsDelivered} Q CPS). Guía SICA: ${reception.sicaGuideNum}. Amortización anticipo ${reception.cutCode}, reconocimiento diferencial cambiario y retención 1.5% ISLR SENIAT. Tasa BCV: Bs. ${reception.bcvRateSettlement.toFixed(4)}.`,
    cutCode: reception.cutCode,
    sourceModule: 'RECEPCION_OCTUBRE',
    standard: 'VEN-NIF / NIC 21',
    items,
    totalDebitBs,
    totalCreditBs,
  };
}
