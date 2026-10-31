import { useState } from 'react'
import { PRODUCTS, formatPaise, type Product, type ProductVariant } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Plus, X, Layers, Check } from 'lucide-react'

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')

  // Variant drawer state
  const [variantDrawerProduct, setVariantDrawerProduct] = useState<Product | null>(null)
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantDeltaRupees, setNewVariantDeltaRupees] = useState('560')

  const filtered = productsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  )

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
        <Btn variant="primary" size="md">
          <Plus size={15} strokeWidth={2.5} /> Add Product
        </Btn>
      </div>

      {/* Filter and Search */}
      <div className="flex justify-between items-center anim-spring stagger-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search product or code..." />
        <span className="text-xs font-mono text-gray-500">{filtered.length} products listed</span>
      </div>

      {/* Table */}
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

      {/* Variant Editor Drawer */}
      {variantDrawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#4A3043]/60 backdrop-blur-md modal-backdrop"
            onClick={() => setVariantDrawerProduct(null)}
          />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] flex flex-col border-l-[1.5px] border-black z-10 anim-spring">
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
                className="w-8 h-8 rounded-lg border border-black flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
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
                  className="btn-primary text-white text-xs font-bold w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 mt-2"
                >
                  <Check size={14} /> Add Variant (+₹{newVariantDeltaRupees})
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t-[1.5px] border-black bg-white/80 flex justify-end">
              <button
                onClick={() => setVariantDrawerProduct(null)}
                className="px-5 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-bold text-xs rounded-xl hover:bg-gray-50"
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
