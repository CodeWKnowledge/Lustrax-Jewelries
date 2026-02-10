import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ViewIcon } from 'hugeicons-react'
import { products } from '../data/products'
import QuickViewModal from './QuickViewModal'

const featuredProducts = products.slice(0, 4);

const FeaturedProducts = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openQuickView = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <section className="py-16 bg-color-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-3xl font-heading text-black mb-4 tracking-[0.2em] font-black uppercase">Elite Selections</h2>
                    <div className="w-12 h-[1px] bg-color-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col items-center">
                            <Link
                                to={`/product/${product.id}`}
                                className="w-full"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-color-sand/20 mb-6 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 border border-color-sand">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    />
                                    {/* Minimal Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                    {/* Quick View Button */}
                                    <button
                                        onClick={(e) => openQuickView(e, product)}
                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 text-color-charcoal hover:bg-color-gold hover:text-white transition-all duration-300 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-xl border border-color-sand/50"
                                        title="Quick View"
                                    >
                                        <ViewIcon size={20} />
                                    </button>

                                    <div className="absolute inset-x-4 bottom-4 h-[1px] bg-color-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            </Link>

                            <Link to={`/product/${product.id}`} className="text-center group">
                                <h3 className="text-sm font-heading text-color-charcoal tracking-[0.2em] mb-2 group-hover:text-color-gold transition-colors font-bold uppercase">
                                    {product.name}
                                </h3>
                                <p className="text-color-gold font-body font-bold text-xs tracking-widest mb-4">
                                    ₦{product.price.toLocaleString()}
                                </p>
                            </Link>

                            <span className="text-[10px] text-color-charcoal/30 tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 cursor-default">
                                Exclusive Piece
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link
                        to="/shop"
                        className="inline-block border-b border-color-sand pb-2 text-[10px] tracking-[0.5em] text-color-charcoal/40 uppercase hover:text-color-gold hover:border-color-gold transition-all font-black"
                    >
                        View Full Catalog &rarr;
                    </Link>
                </div>
            </div>

            <QuickViewModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    )
}

export default FeaturedProducts
