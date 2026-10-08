import React, { useState, useMemo } from 'react';
import {
  ForeignTransfer,
  Producer,
  AdvanceContract,
  HarvestReception,
  AccountingSeat,
  BankReconciliationItem,
  CoffeeMarketPrice,
} from './types';
import {
  COMPANY_INFO,
  INITIAL_FOREIGN_TRANSFERS,
  INITIAL_PRODUCERS,
  INITIAL_ADVANCE_CONTRACTS,
  INITIAL_HARVEST_RECEPTIONS,
  INITIAL_BANK_RECONCILIATION,
  INITIAL_COFFEE_MARKET,
} from './data/mockData';
import {
  createInflowAccountingSeat,
  createAdvanceAccountingSeat,
  createHarvestSettlementSeat,
} from './utils/accountingEngine';
import { HeaderNav } from './components/HeaderNav';
import { VaultModule } from './components/VaultModule';
import { ProducersModule } from './components/ProducersModule';
import { AdvancesModule } from './components/AdvancesModule';
import { HarvestModule } from './components/HarvestModule';
import { TraceabilityModule } from './components/TraceabilityModule';
import { AccountingFiscalModule } from './components/AccountingFiscalModule';
import { ContractModal } from './components/ContractModal';
import { JustificationModal } from './components/JustificationModal';
import { NewTransferModal } from './components/NewTransferModal';
import { DossierModal } from './components/DossierModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('vault');
  const [bcvRate, setBcvRate] = useState<number>(COMPANY_INFO.bcvOfficialRateCurrent);
  const [coffeeMarket, setCoffeeMarket] = useState<CoffeeMarketPrice>(INITIAL_COFFEE_MARKET);

  const [transfers, setTransfers] = useState<ForeignTransfer[]>(INITIAL_FOREIGN_TRANSFERS);
  const [producers, setProducers] = useState<Producer[]>(INITIAL_PRODUCERS);
  const [contracts, setContracts] = useState<AdvanceContract[]>(INITIAL_ADVANCE_CONTRACTS);
  const [receptions, setReceptions] = useState<HarvestReception[]>(INITIAL_HARVEST_RECEPTIONS);
  const [reconciliationItems, setReconciliationItems] = useState<BankReconciliationItem[]>(
    INITIAL_BANK_RECONCILIATION
  );

  // Modals
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [justificationTransfer, setJustificationTransfer] = useState<ForeignTransfer | null>(null);
  const [contractToPreview, setContractToPreview] = useState<AdvanceContract | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [producerForAdvance, setProducerForAdvance] = useState<Producer | null>(null);

  // Compute accounting seats dynamically from operations to ensure 100% double-entry cuadre
  const accountingSeats = useMemo<AccountingSeat[]>(() => {
    const list: AccountingSeat[] = [];

    // Inflow seats
    transfers.forEach((t, i) => {
      list.push(createInflowAccountingSeat(t, i + 1));
    });

    // Advance seats
    contracts.forEach((c, i) => {
      list.push(createAdvanceAccountingSeat(c, i + 1));
    });

    // Harvest settlement seats
    receptions.forEach((r, i) => {
      list.push(createHarvestSettlementSeat(r, i + 1));
    });

    return list;
  }, [transfers, contracts, receptions]);

  // Compute available vault funds
  const vaultAvailableUsd = useMemo(() => {
    const totalRetained80 = transfers.reduce((sum, t) => sum + t.retention80Usd, 0);
    const totalDisbursed = contracts.reduce((sum, c) => sum + c.amountUsd, 0);
    return Math.max(0, totalRetained80 - totalDisbursed);
  }, [transfers, contracts]);

  const vaultAvailableBs = useMemo(() => {
    return Number((vaultAvailableUsd * bcvRate).toFixed(2));
  }, [vaultAvailableUsd, bcvRate]);

  // Handlers
  const handleAddTransfer = (newTransfer: ForeignTransfer) => {
    setTransfers((prev) => [newTransfer, ...prev]);

    // Also add to bank reconciliation items
    const newReconItem: BankReconciliationItem = {
      id: `recon-${Date.now()}`,
      date: newTransfer.date,
      reference: newTransfer.referenceSwift,
      description: `Transferencia Divisas Exterior - ${newTransfer.senderEntity}`,
      amountUsd: newTransfer.amountUsd,
      amountBs: newTransfer.amountBs,
      bcvRate: newTransfer.bcvRate,
      type: 'INGRESO',
      category: 'EXTERIOR_SWIFT',
      matchedInBooks: true,
      bookSeatNumber: `AS-ING-${newTransfer.date.replace(/-/g, '').slice(2)}-${transfers.length + 1}`,
      status: 'CONCILIADO',
    };
    setReconciliationItems((prev) => [newReconItem, ...prev]);
  };

  const handleAddProducer = (newProducer: Producer) => {
    setProducers((prev) => [newProducer, ...prev]);
  };

  const handleSelectProducerForAdvance = (prod: Producer) => {
    setProducerForAdvance(prod);
    setActiveTab('advances');
  };

  const handleAddContract = (newContract: AdvanceContract) => {
    setContracts((prev) => [newContract, ...prev]);

    // Update transfer assigned USD in vault
    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id === newContract.sourceTransferId) {
          return {
            ...t,
            assignedToAdvancesUsd: t.assignedToAdvancesUsd + newContract.amountUsd,
          };
        }
        return t;
      })
    );

    // Add bank reconciliation outflow
    const newReconItem: BankReconciliationItem = {
      id: `recon-${Date.now()}`,
      date: newContract.issueDate,
      reference: newContract.bankRef,
      description: `Desembolso Anticipo Productor ${newContract.producerName} (${newContract.cutCode})`,
      amountUsd: newContract.amountUsd,
      amountBs: newContract.amountBs,
      bcvRate: newContract.bcvRateAtIssue,
      type: 'EGRESO',
      category: 'ANTICIPO_PRODUCTOR',
      matchedInBooks: true,
      bookSeatNumber: `AS-ANT-${newContract.issueDate.replace(/-/g, '').slice(2)}-${contracts.length + 1}`,
      status: 'CONCILIADO',
    };
    setReconciliationItems((prev) => [newReconItem, ...prev]);
  };

  const handleAddReception = (newReception: HarvestReception) => {
    setReceptions((prev) => [newReception, ...prev]);

    // Mark the linked contract as amortized
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === newReception.contractId) {
          const newAmortized = c.amortizedAmountUsd + newReception.amortizedAdvanceUsd;
          const newBalance = Math.max(0, c.amountUsd - newAmortized);
          return {
            ...c,
            amortizedAmountUsd: newAmortized,
            balancePendingUsd: newBalance,
            status: newBalance <= 0 ? 'LIQUIDADO_OCTUBRE' : 'AMORTIZADO_PARCIAL',
          };
        }
        return c;
      })
    );

    // Add reconciliation outflow for net payment
    const newReconItem: BankReconciliationItem = {
      id: `recon-${Date.now()}`,
      date: newReception.date,
      reference: newReception.paymentBankRef,
      description: `Pago Finiquito Neto Cosecha ${newReception.producerName} (${newReception.sicaGuideNum})`,
      amountUsd: newReception.netPayableUsd,
      amountBs: newReception.netPayableBs,
      bcvRate: newReception.bcvRateSettlement,
      type: 'EGRESO',
      category: 'LIQUIDACION_NETA',
      matchedInBooks: true,
      bookSeatNumber: `AS-LIQ-${newReception.date.replace(/-/g, '').slice(2)}-${receptions.length + 1}`,
      status: 'CONCILIADO',
    };
    setReconciliationItems((prev) => [newReconItem, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#2D3748]">
      {/* Top Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bcvRate={bcvRate}
        setBcvRate={setBcvRate}
        vaultAvailableUsd={vaultAvailableUsd}
        vaultAvailableBs={vaultAvailableBs}
        coffeeMarket={coffeeMarket}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'vault' && (
          <VaultModule
            transfers={transfers}
            onOpenNewTransferModal={() => setIsNewTransferOpen(true)}
            onOpenJustificationModal={(transfer) => setJustificationTransfer(transfer)}
            bcvRate={bcvRate}
          />
        )}

        {activeTab === 'producers' && (
          <ProducersModule
            producers={producers}
            onAddProducer={handleAddProducer}
            onSelectProducerForAdvance={handleSelectProducerForAdvance}
          />
        )}

        {activeTab === 'advances' && (
          <AdvancesModule
            contracts={contracts}
            producers={producers}
            transfers={transfers}
            bcvRate={bcvRate}
            onAddContract={handleAddContract}
            onOpenContractModal={(contract) => setContractToPreview(contract)}
            selectedProducerForAdvance={producerForAdvance}
            onClearSelectedProducer={() => setProducerForAdvance(null)}
          />
        )}

        {activeTab === 'harvest' && (
          <HarvestModule
            receptions={receptions}
            activeContracts={contracts}
            bcvRate={bcvRate}
            onAddReception={handleAddReception}
          />
        )}

        {activeTab === 'traceability' && (
          <TraceabilityModule
            reconciliationItems={reconciliationItems}
            transfers={transfers}
            contracts={contracts}
            receptions={receptions}
            bcvRate={bcvRate}
          />
        )}

        {activeTab === 'accounting' && (
          <AccountingFiscalModule
            seats={accountingSeats}
            contracts={contracts}
            receptions={receptions}
            transfers={transfers}
            bcvRate={bcvRate}
            onOpenDossierModal={() => setIsDossierOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D8E2DC] bg-white py-4 text-xs text-[#3D405B]/70 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <strong>NOMINUS CAFÉ VENEZUELA</strong> · Sistema de Control Cambiario y Gestión Cafetalera
            <span className="block text-[11px] text-[#3D405B]/60 mt-0.5">
              Convenio Cambiario N° 1 (Arts. 31, 32 y 57) · Código Civil de Venezuela (Art. 1.332) · Normas VEN-NIF (NIC 21)
            </span>
          </div>
          <div className="text-[11px] text-[#3D405B]/70 font-mono-numbers">
            Custodia Probatoria SUDEBAN: 10 Años · RIF: {COMPANY_INFO.rif}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isNewTransferOpen && (
        <NewTransferModal
          bcvRate={bcvRate}
          onAddTransfer={handleAddTransfer}
          onClose={() => setIsNewTransferOpen(false)}
        />
      )}

      {justificationTransfer && (
        <JustificationModal
          transfer={justificationTransfer}
          onClose={() => setJustificationTransfer(null)}
        />
      )}

      {contractToPreview && (
        <ContractModal
          contract={contractToPreview}
          onClose={() => setContractToPreview(null)}
        />
      )}

      {isDossierOpen && (
        <DossierModal
          contracts={contracts}
          receptions={receptions}
          transfers={transfers}
          producers={producers}
          bcvRate={bcvRate}
          onClose={() => setIsDossierOpen(false)}
        />
      )}
    </div>
  );
}
