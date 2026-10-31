import { useState } from 'react'
import { PRODUCTS, formatPaise, type Product, type ProductVariant } from '../data/seed'
import { Badge, Btn, SearchInput } from '../components/ui'
import { Plus, Package, X, Check, Layers } from 'lucide-react'

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Variant modal / drawer state
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line-strong)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Product & Variant Matrix</h1>
          <p className="text-xs font-mono text-[var(--ink-40)] uppercase tracking-wider mt-0.5">
            Software Licenses & Infrastructure Catalog · Additive Variant Pricing
          </p>
        </div>
        <Btn variant="primary" size="sm" className="font-mono text-xs">
          <Plus size={13} /> Add Product
        </Btn>
      </div>

      <div className="flex justify-between items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search product or code..." />
        <span className="text-xs font-mono text-[var(--ink-40)]">{filtered.length} products listed</span>
      </div>

      {/* Table: Full-bleed, 44px rows, sticky header, 1px strong line */}
      <div className="border border-[var(--line-strong)] bg-white overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-40)]">
              <th className="px-4 py-3">CODE</th>
              <th className="px-4 py-3">NAME & DESCRIPTION</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3 text-right">SALES PRICE</th>
              <th className="px-4 py-3 text-right">COST</th>
              <th className="px-4 py-3 text-right">MARGIN %</th>
              <th className="px-4 py-3 text-center">VARIANTS</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map(p => {
              const margin = p.salesPrice > 0 ? Math.round(((p.salesPrice - p.costPrice) / p.salesPrice) * 100) : 0
              return (
                <tr key={p.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">{p.code}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-sans font-semibold text-[var(--ink)] text-sm">{p.name}</p>
                    <p className="text-[11px] text-[var(--ink-40)] truncate">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-60)]">{p.type}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ink)]">{formatPaise(p.salesPrice)}</td>
                  <td className="px-4 py-3 text-right text-[var(--ink-40)]">{formatPaise(p.costPrice)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--ok)]">{margin}%</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setVariantDrawerProduct(p)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 border border-[var(--line)] hover:border-[var(--line-strong)] rounded text-[10px] font-semibold bg-white cursor-pointer"
                    >
                      <Layers size={10} /> {p.variants.length} Variants
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? 'ok' : 'neutral'}>
                      {p.isActive ? 'ACTIVE' : 'ARCHIVED'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setVariantDrawerProduct(p)}
                      className="text-[10px] font-bold text-[var(--accent)] hover:underline"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => toggleArchive(p.id)}
                      className="text-[10px] font-bold text-[var(--ink-40)] hover:text-[var(--bad)] hover:underline"
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

      {/* Variant Editor Slide-Over Drawer */}
      {variantDrawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[var(--line-strong)]">
            <div className="p-6 border-b border-[var(--line)] flex justify-between items-start bg-[var(--surface-2)]">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">{variantDrawerProduct.code}</span>
                <h2 className="text-lg font-bold tracking-tight text-[var(--ink)] mt-0.5">
                  {variantDrawerProduct.name} Variants
                </h2>
                <p className="text-xs font-mono text-[var(--ink-40)] mt-1">
                  Base Price: {formatPaise(variantDrawerProduct.salesPrice)}
                </p>
              </div>
              <button
                onClick={() => setVariantDrawerProduct(null)}
                className="p-1 rounded hover:bg-zinc-200 text-[var(--ink-60)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6 font-mono text-xs">
              {/* Existing Variants List */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-40)] mb-3">
                  CONFIGURED VARIANTS & PRICE DELTAS
                </p>
                {variantDrawerProduct.variants.length === 0 ? (
                  <p className="text-zinc-400 py-3 text-center border border-dashed border-[var(--line)] rounded">
                    No variants. Base pricing applies.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variantDrawerProduct.variants.map(v => {
                      const finalPrice = variantDrawerProduct.salesPrice + v.priceDelta
                      return (
                        <div key={v.id} className="p-3 border border-[var(--line)] rounded bg-[var(--surface-2)] flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[var(--ink)] text-sm">{v.name}</p>
                            <p className="text-[10px] text-[var(--ink-40)]">
                              Delta: +{formatPaise(v.priceDelta)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[var(--ink-40)] uppercase">Effective Price</span>
                            <p className="font-bold text-sm text-[var(--accent)]">{formatPaise(finalPrice)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Add New Variant Form with Live Calculation */}
              <div className="p-4 border border-[var(--line-strong)] rounded bg-white space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
                  Add Variant with Price Surcharge
                </p>
                <form onSubmit={handleAddVariant} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[var(--ink-60)] mb-1">Variant Name (e.g., Odoo Brand)</label>
                    <input
                      type="text"
                      value={newVariantName}
                      onChange={e => setNewVariantName(e.target.value)}
                      placeholder="e.g. Odoo Brand"
                      required
                      className="w-full px-3 py-1.5 border border-[var(--line)] rounded text-xs bg-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--ink-60)] mb-1">Additive Surcharge in INR ₹ (e.g. 560)</label>
                    <input
                      type="number"
                      value={newVariantDeltaRupees}
                      onChange={e => setNewVariantDeltaRupees(e.target.value)}
                      placeholder="560"
                      className="w-full px-3 py-1.5 border border-[var(--line)] rounded text-xs bg-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  {/* Live Formula Preview */}
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] space-y-1">
                    <p className="font-semibold text-blue-900">Live Mathematical Proof:</p>
                    <p className="text-blue-800">
                      Base ({formatPaise(variantDrawerProduct.salesPrice)}) + Delta (₹{newVariantDeltaRupees || '0'}) ={' '}
                      <span className="font-bold underline">
                        {formatPaise(variantDrawerProduct.salesPrice + Math.round(parseFloat(newVariantDeltaRupees || '0') * 100))}
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[var(--accent)] hover:bg-blue-900 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save Variant to Matrix
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

