import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { products } from '../data/products'

const ShopPage = () => {
    const [filter, setFilter] = useState('All')

    const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter)

    return (
        <Layout>
            <div className="pt-28 pb-16 min-h-screen bg-color-bg">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="animate-slide-up">
                            <h1 className="text-3xl md:text-5xl font-heading text-black mb-4 font-black italic tracking-tighter uppercase">Possession Catalog</h1>
                            <div className="flex items-center gap-6">
                                <p className="text-zinc-400 font-body text-[9px] tracking-[0.4em] uppercase">
                                    CURATED / <span className="text-color-gold italic font-bold">VETTED ASSETS</span>
                                </p>
                                <Link to="/track-order" className="text-color-gold font-body text-[9px] tracking-[0.4em] uppercase border-b border-color-gold/30 hover:border-color-gold transition-all font-black">
                                    Track Existing Order &rarr;
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 border-b border-zinc-100 pb-4 overflow-x-auto w-full md:w-auto no-scrollbar">
                            {['All', 'Chains', 'Rings', 'Bracelets', 'Watches', 'Pendants', 'Accessories'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`text-[10px] uppercase tracking-[0.3em] font-bold whitespace-nowrap transition-all duration-300 ${filter === cat ? 'text-color-gold border-b border-color-gold pb-2' : 'text-zinc-300 hover:text-black'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="group flex flex-col"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-color-sand/10 mb-5 border border-color-sand transition-all duration-700 group-hover:border-color-gold/30">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-color-bg via-transparent to-transparent h-1/2 opacity-60" />

                                    <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-color-charcoal text-white px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                        Inspect Piece
                                    </button>
                                </div>
                                <h3 className="font-heading text-xs text-color-charcoal mb-2 tracking-widest group-hover:text-color-gold transition-colors font-black uppercase truncate">{product.name}</h3>
                                <p className="text-color-gold font-body font-black text-[10px] tracking-[0.2em]">₦{product.price.toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ShopPage
