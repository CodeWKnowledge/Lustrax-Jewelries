import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Share01Icon, CheckmarkCircle01Icon, Add01Icon, Remove01Icon } from 'hugeicons-react'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'

const ProductDetailPage = () => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const product = products.find(p => p.id === parseInt(id)) || products[0]

    const handleAddToCart = () => {
        // Add specific quantity to cart
        for (let i = 0; i < quantity; i++) {
            addToCart({ ...product, size: 'Universal' })
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 3000)
    }

    const adjustQuantity = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount))
    }

    return (
        <Layout>
            <div className="pt-28 pb-16 bg-color-bg min-h-screen">
                <div className="container mx-auto px-6">
                    <Link to="/shop" className="text-color-charcoal/40 hover:text-color-gold text-[10px] font-black uppercase tracking-[0.5em] mb-10 inline-block transition-all">
                        &larr; Return to Catalog
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Image Section */}
                        <div className="w-full lg:w-3/5 overflow-hidden bg-color-sand/20 border border-color-sand">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-auto object-cover hover:scale-105 transition-all duration-1000"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="w-full lg:w-2/5 flex flex-col justify-center animate-slide-up">
                            <span className="text-color-gold uppercase tracking-[0.4em] text-[10px] font-black mb-6 border-l border-color-gold pl-4">{product.category}</span>
                            <h1 className="text-3xl md:text-5xl font-heading text-color-charcoal mb-8 tracking-tighter leading-tight italic font-black">{product.name}</h1>
                            <p className="text-3xl text-color-gold mb-10 font-body font-black tracking-widest">₦{product.price.toLocaleString()}</p>

                            <div className="w-12 h-[1px] bg-color-sand mb-10" />

                            <p className="text-color-charcoal/60 font-body font-light text-base md:text-lg mb-12 leading-loose uppercase tracking-wide">
                                {product.desc}
                            </p>

                            {/* Quantity Selector */}
                            <div className="flex flex-col gap-4 mb-10">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-color-charcoal/60">Quantity</label>
                                <div className="flex items-center space-x-6 border border-color-sand w-fit p-2">
                                    <button
                                        onClick={() => adjustQuantity(-1)}
                                        className="p-2 hover:text-color-gold transition-colors"
                                    >
                                        <Remove01Icon size={18} />
                                    </button>
                                    <span className="text-sm font-bold font-heading w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => adjustQuantity(1)}
                                        className="p-2 hover:text-color-gold transition-colors"
                                    >
                                        <Add01Icon size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-6 mb-16">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-color-charcoal text-white py-6 px-10 flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all duration-300 uppercase tracking-[0.3em] font-black text-xs"
                                >
                                    {added ? (
                                        <>
                                            <CheckmarkCircle01Icon size={18} /> Added to Bag
                                        </>
                                    ) : `Add ${quantity} to Shopping Bag`}
                                </button>
                                <div className="flex gap-4">
                                    <Link to="/cart" className="flex-1 border border-color-sand py-5 flex items-center justify-center gap-3 text-color-charcoal/40 hover:text-black hover:border-black transition-all text-[10px] items-center tracking-widest uppercase font-bold">
                                        View Bag
                                    </Link>
                                    <button className="flex-1 border border-color-sand py-5 flex items-center justify-center gap-3 text-color-charcoal/40 hover:text-black hover:border-black transition-all text-[10px] items-center tracking-widest uppercase font-bold">
                                        Share Selection
                                    </button>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div className="border-t border-color-sand pt-8">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-color-charcoal/70 mb-6 italic underline-offset-8 underline decoration-color-gold/30">Verification Detail</h4>
                                <ul className="grid grid-cols-2 gap-y-4 text-[10px] text-color-charcoal/40 tracking-[0.2em] font-bold uppercase">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-color-gold" /> Authenticated 18k Gold</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-color-gold" /> Certified Components</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-color-gold" /> Luxury Packaging</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-color-gold" /> Warranty Card</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetailPage
