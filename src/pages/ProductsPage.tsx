import { useState, useEffect } from 'react'
import { PRODUCTS, formatPaise, type Product, type ProductVariant } from '../data/seed'
import { Badge, Btn, SearchInput, TableSkeleton } from '../components/ui'
import { Plus, X, Layers, Check, CheckCircle } from 'lucide-react'

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')

  // Add Product Modal State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('Software')
  const [newSalesRupees, setNewSalesRupees] = useState('2499')
  const [newCostRupees, setNewCostRupees] = useState('800')
  const [newDesc, setNewDesc] = useState('')
  const [toastNotice, setToastNotice] = useState('')

  // Variant drawer state
  const [variantDrawerProduct, setVariantDrawerProduct] = useState<Product | null>(null)
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantDeltaRupees, setNewVariantDeltaRupees] = useState('560')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const filtered = productsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const code = newCode.trim() || `PRD-${String(productsList.length + 1).padStart(3, '0')}`
    const salesPaise = Math.round(parseFloat(newSalesRupees || '0') * 100)
    const costPaise = Math.round(parseFloat(newCostRupees || '0') * 100)

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      code,
      name: newName.trim(),
      description: newDesc.trim() || 'Enterprise SaaS software subscription license with Indian GST compliance.',
      type: newType,
      salesPrice: salesPaise,
      costPrice: costPaise,
      isActive: true,
      variants: [],
      createdAt: '2026-10-31',
    }

    setProductsList([newProduct, ...productsList])
    setAddModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewDesc('')
    setToastNotice(`Product ${newProduct.name} (${code}) added to catalog.`)
    setTimeout(() => setToastNotice(''), 4500)
  }

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!variantDrawerProduct || !newVariantName.trim()) return

    const deltaPaise = Math.round(parseFloat(newVariantDeltaRupees || '0') * 100)
    const newVariant: ProductVariant = {
      id: `pv-${Date.now()}`,
      name: newVariantName.trim(),
      priceDelta: deltaPaise,
      isActive: true,
    }

    const updatedProducts = productsList.map(p => {
      if (p.id === variantDrawerProduct.id) {
        return {
          ...p,
          variants: [...p.variants, newVariant],
        }
      }
      return p
    })

    setProductsList(updatedProducts)
    setVariantDrawerProduct(prev => prev ? { ...prev, variants: [...prev.variants, newVariant] } : null)
    setNewVariantName('')
    setNewVariantDeltaRupees('0')
    setToastNotice(`Variant "${newVariant.name}" (+₹${newVariantDeltaRupees}) added to ${variantDrawerProduct.name}.`)
    setTimeout(() => setToastNotice(''), 4000)
  }

  const toggleArchive = (productId: string) => {
    setProductsList(prev =>
      prev.map(p => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 anim-spring stagger-1">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#4A3043]">Product Catalog</h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
            Software Licenses & Infrastructure Modules · Additive Variant Pricing
          </p>
        </div>
        <Btn variant="primary" size="md" onClick={() => setAddModalOpen(true)}>
          <Plus size={15} strokeWidth={2.5} /> Add Product
        </Btn>
      </div>

      {toastNotice && (
        <div className="p-4 bg-white/95 backdrop-blur-md border-[1.5px] border-black rounded-2xl shadow-[0_4px_0_0_#000] text-xs font-mono text-emerald-800 flex justify-between items-center anim-spring">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice('')} className="font-bold text-gray-500 hover:text-black cursor-pointer">×</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex justify-between items-center anim-spring stagger-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search product or code..." />
        <span className="text-xs font-mono text-gray-500">{filtered.length} products listed</span>
      </div>

      {/* Table / Skeleton */}
      {loading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] anim-spring stagger-3">
          <table className="w-full text-left border-collapse">
            <thead className="border-b-[1.5px] border-black bg-white/60">
              <tr>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CODE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">PRODUCT NAME</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">CATEGORY</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">SALES PRICE</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">MARGIN %</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-center">VARIANTS</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono">STATUS</th>
                <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-800 font-mono text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filtered.map(p => {
                const margin = p.salesPrice > 0 ? Math.round(((p.salesPrice - p.costPrice) / p.salesPrice) * 100) : 0
                return (
                  <tr key={p.id} className="table-row">
                    <td className="px-6 py-4 font-bold font-mono text-[#4A3043]">{p.code}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#4A3043] text-sm">{p.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono truncate max-w-xs">{p.description}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{p.type}</td>
                    <td className="px-6 py-4 text-right font-bold font-mono text-[#4A3043]">{formatPaise(p.salesPrice)}</td>
                    <td className="px-6 py-4 text-right font-bold font-mono text-emerald-600">{margin}%</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setVariantDrawerProduct(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 border-[1.5px] border-black rounded-lg text-xs font-bold bg-white text-[#4A3043] shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all"
                      >
                        <Layers size={12} /> {p.variants.length} Variants
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.isActive ? 'ok' : 'neutral'}>
                        {p.isActive ? 'ACTIVE' : 'ARCHIVED'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 font-mono text-xs">
                      <button
                        onClick={() => setVariantDrawerProduct(p)}
                        className="font-bold text-[#714B67] hover:underline cursor-pointer"
                      >
                        Configure
                      </button>
                      <button
                        onClick={() => toggleArchive(p.id)}
                        className="font-bold text-gray-500 hover:text-red-600 hover:underline cursor-pointer"
                      >
                        {p.isActive ? 'Archive' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden modal-panel p-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#714B67]">Catalog Management</span>
                <h3 className="text-lg font-bold text-[#4A3043]">Add Product / Service Module</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="py-5 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Product Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value.toUpperCase())}
                    placeholder={`PRD-${String(productsList.length + 1).padStart(3, '0')}`}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Category / Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  >
                    <option value="Software">Software License</option>
                    <option value="Infrastructure">Infrastructure Module</option>
                    <option value="Service">Professional Service</option>
                    <option value="Integration">Integration Add-on</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Brightloop Automated Reconciliation Suite"
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Sales Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newSalesRupees}
                    onChange={e => setNewSalesRupees(e.target.value)}
                    placeholder="2499"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Cost Price (₹ INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCostRupees}
                    onChange={e => setNewCostRupees(e.target.value)}
                    placeholder="800"
                    className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Comprehensive billing module with automated tax computation and reconciliation."
                  className="input-focus w-full px-3.5 py-2 bg-white border-[1.5px] border-black rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variant Editor Drawer */}
      {variantDrawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#4A3043]/50 backdrop-blur-xs modal-backdrop"
            onClick={() => setVariantDrawerProduct(null)}
          />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex flex-col border-l-[1.5px] border-black z-10 drawer-panel">
            {/* Drawer Header */}
            <div className="p-6 border-b-[1.5px] border-black flex justify-between items-start bg-white/80">
              <div>
                <span className="font-mono text-xs font-bold text-[#714B67]">{variantDrawerProduct.code}</span>
                <h2 className="text-xl font-bold tracking-tight text-[#4A3043] mt-1">
                  {variantDrawerProduct.name}
                </h2>
                <p className="text-xs font-mono text-gray-600 mt-1">
                  Base Price: {formatPaise(variantDrawerProduct.salesPrice)}
                </p>
              </div>
              <button
                onClick={() => setVariantDrawerProduct(null)}
                className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6 font-mono text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 font-mono">
                  CONFIGURED VARIANTS & PRICE DELTAS
                </p>
                {variantDrawerProduct.variants.length === 0 ? (
                  <p className="text-gray-400 py-4 text-center border-[1.5px] border-dashed border-black/30 rounded-xl">
                    No variants. Base pricing applies.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {variantDrawerProduct.variants.map(v => {
                      const finalPrice = variantDrawerProduct.salesPrice + v.priceDelta
                      return (
                        <div key={v.id} className="p-4 border-[1.5px] border-black rounded-xl bg-white shadow-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[#4A3043] text-sm">{v.name}</p>
                            <p className="text-[10px] text-gray-500">Delta: +{formatPaise(v.priceDelta)}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-black text-sm">{formatPaise(finalPrice)}</span>
                            <span className="block text-[9px] text-emerald-600 font-bold uppercase">Net Active</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Add Variant Form */}
              <form onSubmit={handleAddVariant} className="p-5 border-[1.5px] border-black rounded-2xl bg-white/70 shadow-sm space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 font-mono">
                  + Add New Variant
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Variant Name</label>
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={e => setNewVariantName(e.target.value)}
                    placeholder="e.g. Odoo Brand Integration"
                    className="input-focus w-full px-3 py-2 text-xs bg-white border-[1.5px] border-black rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Price Delta (₹ INR)</label>
                  <input
                    type="number"
                    value={newVariantDeltaRupees}
                    onChange={e => setNewVariantDeltaRupees(e.target.value)}
                    placeholder="560"
                    className="input-focus w-full px-3 py-2 text-xs bg-white border-[1.5px] border-black rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary text-white text-xs font-bold w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <Check size={14} /> Add Variant (+₹{newVariantDeltaRupees})
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t-[1.5px] border-black bg-white/80 flex justify-end">
              <button
                onClick={() => setVariantDrawerProduct(null)}
                className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
