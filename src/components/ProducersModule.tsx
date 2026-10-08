import React, { useState } from 'react';
import { Producer } from '../types';
import {
  MapPin,
  Search,
  PlusCircle,
  FileBadge2,
  TreePine,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProducersModuleProps {
  producers: Producer[];
  onAddProducer: (producer: Producer) => void;
  onSelectProducerForAdvance: (producer: Producer) => void;
}

export const ProducersModule: React.FC<ProducersModuleProps> = ({
  producers,
  onAddProducer,
  onSelectProducerForAdvance,
}) => {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form state
  const [newProd, setNewProd] = useState<Partial<Producer>>({
    fullName: '',
    idNumber: 'V-',
    rif: 'V-',
    runopaId: 'RUNOPA-PORT-2026-',
    sigesaiCertCode: 'SIGESAI-INSAI-',
    sicaCode: 'SICA-PROD-',
    farmName: '',
    state: 'Portuguesa',
    municipality: 'Sucre',
    sector: 'Biscucuy',
    approvedHectares: 10,
    coffeeVariety: 'Caturra y Catuaí',
    historicalYieldQHa: 15,
    bankName: 'Banesco Banco Universal',
    accountNumber: '0134-',
    phone: '+58 414-',
    phytosanitaryStatus: 'APROBADO',
  });

  const filtered = producers.filter((p) => {
    const matchesState = filterState === 'all' || p.state === filterState;
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.runopaId.toLowerCase().includes(search.toLowerCase()) ||
      p.farmName.toLowerCase().includes(search.toLowerCase()) ||
      p.sector.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesSearch;
  });

  const handleSaveProducer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.fullName || !newProd.idNumber || !newProd.farmName) return;

    const producer: Producer = {
      id: `prod-${Date.now()}`,
      fullName: newProd.fullName || '',
      idNumber: newProd.idNumber || '',
      rif: newProd.rif || '',
      runopaId: newProd.runopaId || `RUNOPA-PORT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sigesaiCertCode: newProd.sigesaiCertCode || `SIGESAI-INSAI-${Math.floor(10000 + Math.random() * 90000)}`,
      sicaCode: newProd.sicaCode || `SICA-PROD-${Math.floor(10000 + Math.random() * 90000)}`,
      farmName: newProd.farmName || '',
      state: newProd.state || 'Portuguesa',
      municipality: newProd.municipality || 'Sucre',
      sector: newProd.sector || '',
      approvedHectares: Number(newProd.approvedHectares) || 10,
      coffeeVariety: newProd.coffeeVariety || 'Caturra',
      historicalYieldQHa: Number(newProd.historicalYieldQHa) || 14,
      bankName: newProd.bankName || 'Banesco',
      accountNumber: newProd.accountNumber || '',
      phone: newProd.phone || '',
      phytosanitaryStatus: (newProd.phytosanitaryStatus as any) || 'APROBADO',
    };

    onAddProducer(producer);
    setShowNewModal(false);
  };

  const totalHectares = producers.reduce((sum, p) => sum + p.approvedHectares, 0);
  const totalEstimatedHarvest = producers.reduce(
    (sum, p) => sum + p.approvedHectares * p.historicalYieldQHa,
    0
  );

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8E2DC] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3D405B]">
            Padrón de Productores Cafetaleros de Venezuela
          </h1>
          <p className="text-sm text-[#3D405B]/80 mt-1 max-w-3xl">
            Expediente digital obligatorio para la justificación de anticipos de cosecha ante el{' '}
            <strong>SENIAT</strong> y el <strong>Banco</strong>. Integra acreditación legal{' '}
            <strong>RUNOPA (MPPAT)</strong>, inspección fitosanitaria <strong>SIGESAI (INSAI)</strong> y
            guías de movilización <strong>SICA (SUNAGRO)</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nuevo Caficultor
        </button>
      </div>

      {/* Metric Cards - Soft Pastel Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Productores Registrados - Soft Pastel Blue */}
        <div className="bg-[#EBF3FA] border border-[#CFE2F3] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#1E4E79] mb-1 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Productores Registrados</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#1E4E79]">
              <FileBadge2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#1E4E79] font-mono-numbers mt-1">
            {producers.length} caficultores
          </div>
          <div className="text-xs text-[#2A6496] mt-1 font-medium">100% con RUNOPA e INSAI verificados</div>
        </div>

        {/* Superficie Total Aprobada - Soft Pastel Green */}
        <div className="bg-[#EEF8F1] border border-[#CBEAD2] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#1E6637] mb-1 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Superficie Total Aprobada</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#1E6637]">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#1E6637] font-mono-numbers mt-1">
            {totalHectares.toFixed(2)} Hectáreas
          </div>
          <div className="text-xs text-[#277843] mt-1 font-medium">Tierras cafetaleras en producción activa</div>
        </div>

        {/* Potencial de Cosecha Zafra - Soft Pastel Yellow */}
        <div className="bg-[#FEF9E7] border border-[#FBE6A2] rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7C5B00] mb-1 font-semibold">
            <span className="uppercase tracking-wider text-[10px]">Potencial de Cosecha Zafra</span>
            <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center text-[#7C5B00]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#7C5B00] font-mono-numbers mt-1">
            {totalEstimatedHarvest.toLocaleString('es-VE')} Quintales CPS
          </div>
          <div className="text-xs text-[#8A6800] mt-1 font-medium">Rendimiento proyectado para exportación</div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'Portuguesa', 'Lara', 'Mérida', 'Trujillo'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterState === st
                  ? 'bg-[#2D3748] text-white shadow-2xs'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F1F5F9]'
              }`}
            >
              {st === 'all' ? `Todos los Estados (${producers.length})` : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por productor, finca, cédula o RUNOPA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D8E2DC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3D405B] text-[#3D405B]"
          />
        </div>
      </div>

      {/* Table of Producers */}
      <div className="bg-white border border-[#D8E2DC] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#3D405B] border-b border-[#D8E2DC] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Productor & Documento</th>
                <th className="py-3 px-4">Finca & Georreferencia</th>
                <th className="py-3 px-4">Acreditaciones Obligatorias (MPPAT/INSAI/SUNAGRO)</th>
                <th className="py-3 px-4 text-right">Hectáreas & Rendimiento</th>
                <th className="py-3 px-4">Datos Bancarios para Anticipos</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1DE]">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  {/* Productor */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#3D405B] text-sm">{prod.fullName}</div>
                    <div className="text-[11px] text-[#3D405B]/70 font-mono-numbers">
                      C.I: {prod.idNumber} · RIF: {prod.rif}
                    </div>
                    <div className="text-[11px] text-[#3D405B]/60 mt-0.5">{prod.phone}</div>
                  </td>

                  {/* Finca & Ubicación */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#3D405B]">{prod.farmName}</div>
                    <div className="text-[11px] text-[#3D405B]/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#E07A5F]" />
                      <span>
                        {prod.sector}, {prod.municipality}, Edo. {prod.state}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#3D405B]/60 mt-0.5">
                      Variedad: <strong>{prod.coffeeVariety}</strong>
                    </div>
                  </td>

                  {/* Registros Agrícolas */}
                  <td className="py-3.5 px-4 font-mono-numbers">
                    <div className="text-[11px] text-[#3D405B]">
                      <span className="font-semibold text-[#3D405B]">RUNOPA:</span> {prod.runopaId}
                    </div>
                    <div className="text-[11px] text-[#3D405B]">
                      <span className="font-semibold text-[#3D405B]">SIGESAI:</span> {prod.sigesaiCertCode}
                    </div>
                    <div className="text-[11px] text-[#3D405B]/70">
                      <span className="font-semibold text-[#3D405B]">SICA:</span> {prod.sicaCode}
                    </div>
                  </td>

                  {/* Hectáreas & Rendimiento */}
                  <td className="py-3.5 px-4 text-right font-mono-numbers">
                    <div className="font-bold text-[#3D405B]">
                      {prod.approvedHectares.toFixed(2)} ha
                    </div>
                    <div className="text-[11px] text-[#3D405B]/70">
                      {prod.historicalYieldQHa.toFixed(1)} Q/ha
                    </div>
                    <div className="text-[10px] text-[#E07A5F] font-semibold mt-0.5">
                      P_est: {(prod.approvedHectares * prod.historicalYieldQHa).toFixed(0)} Q
                    </div>
                  </td>

                  {/* Datos Bancarios */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#3D405B]">{prod.bankName}</div>
                    <div className="text-[11px] text-[#3D405B]/70 font-mono-numbers">
                      {prod.accountNumber}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>DDC Bancaria Verificada</span>
                    </div>
                  </td>

                  {/* Acción */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onSelectProducerForAdvance(prod)}
                      className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D8E2DC] hover:border-[#E07A5F] text-[#3D405B] hover:text-[#E07A5F] rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Generar Anticipo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nuevo Caficultor */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-[#D8E2DC] shadow-xl overflow-hidden my-8">
            <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#D8E2DC] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#3D405B]">
                  Registrar Caficultor en el Padrón Agrícola
                </h3>
                <p className="text-xs text-[#3D405B]/70">
                  Requisito previo obligatorio para la justificación de anticipos monetarios.
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#3D405B]/60 hover:text-[#3D405B] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProducer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Nombre Completo del Productor</label>
                  <input
                    type="text"
                    required
                    value={newProd.fullName}
                    onChange={(e) => setNewProd({ ...newProd, fullName: e.target.value })}
                    placeholder="Ej. José Antonio Mendoza"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Cédula de Identidad</label>
                  <input
                    type="text"
                    required
                    value={newProd.idNumber}
                    onChange={(e) => setNewProd({ ...newProd, idNumber: e.target.value })}
                    placeholder="Ej. V-14.890.123"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">RIF del Productor</label>
                  <input
                    type="text"
                    required
                    value={newProd.rif}
                    onChange={(e) => setNewProd({ ...newProd, rif: e.target.value })}
                    placeholder="Ej. V-14890123-1"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Nombre de la Finca / Predio</label>
                  <input
                    type="text"
                    required
                    value={newProd.farmName}
                    onChange={(e) => setNewProd({ ...newProd, farmName: e.target.value })}
                    placeholder="Ej. Finca La Esperanza"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Código RUNOPA (MPPAT)</label>
                  <input
                    type="text"
                    required
                    value={newProd.runopaId}
                    onChange={(e) => setNewProd({ ...newProd, runopaId: e.target.value })}
                    placeholder="Ej. RUNOPA-PORT-2026-8812"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Certificado SIGESAI (INSAI)</label>
                  <input
                    type="text"
                    required
                    value={newProd.sigesaiCertCode}
                    onChange={(e) => setNewProd({ ...newProd, sigesaiCertCode: e.target.value })}
                    placeholder="Ej. SIGESAI-INSAI-009912"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Código SICA (SUNAGRO)</label>
                  <input
                    type="text"
                    value={newProd.sicaCode}
                    onChange={(e) => setNewProd({ ...newProd, sicaCode: e.target.value })}
                    placeholder="Ej. SICA-PROD-88120"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Estado</label>
                  <select
                    value={newProd.state}
                    onChange={(e) => setNewProd({ ...newProd, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  >
                    <option value="Portuguesa">Portuguesa (Biscucuy, Unda, Sucre)</option>
                    <option value="Lara">Lara (Sanare, Guarico, Villanueva)</option>
                    <option value="Mérida">Mérida (Santa Cruz de Mora, Tovar)</option>
                    <option value="Trujillo">Trujillo (Boconó, Carache)</option>
                    <option value="Monagas">Monagas (Caripe del Guácharo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Superficie Aprobada (Hectáreas)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProd.approvedHectares}
                    onChange={(e) => setNewProd({ ...newProd, approvedHectares: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Rendimiento Histórico (Q/ha)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProd.historicalYieldQHa}
                    onChange={(e) => setNewProd({ ...newProd, historicalYieldQHa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Banco Receptor en Venezuela</label>
                  <input
                    type="text"
                    value={newProd.bankName}
                    onChange={(e) => setNewProd({ ...newProd, bankName: e.target.value })}
                    placeholder="Banesco / BNC / Banco de Venezuela"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#3D405B] font-medium mb-1">Número de Cuenta Bancaria (20 dígitos)</label>
                  <input
                    type="text"
                    value={newProd.accountNumber}
                    onChange={(e) => setNewProd({ ...newProd, accountNumber: e.target.value })}
                    placeholder="0134-XXXX-XX-XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-[#D8E2DC] rounded-md bg-[#FAF8F5] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#D8E2DC]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-[#D8E2DC] text-[#3D405B] rounded-lg hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E07A5F] hover:bg-[#d66b50] text-white font-semibold rounded-lg shadow-sm"
                >
                  Guardar Productor en Padrón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
