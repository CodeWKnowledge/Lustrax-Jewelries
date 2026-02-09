import React from 'react'
import { Link } from 'react-router-dom'

import { products } from '../data/products'

const featuredProducts = products.slice(0, 4);

const FeaturedProducts = () => {
    return (
        <section className="py-16 bg-color-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-3xl font-heading text-black mb-4 tracking-[0.2em] font-black">ELITE SELECTIONS</h2>
                    <div className="w-12 h-[1px] bg-color-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group flex flex-col items-center"
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-color-sand/20 mb-6 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 border border-color-sand">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                {/* Minimal Overlay */}
                                <div className="absolute inset-x-4 bottom-4 h-[1px] bg-color-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>

                            <h3 className="text-sm font-heading text-color-charcoal tracking-[0.2em] mb-2 group-hover:text-color-gold transition-colors font-bold">
                                {product.name}
                            </h3>
                            <p className="text-color-gold font-body font-bold text-xs tracking-widest mb-4">
                                ${product.price.toLocaleString()}
                            </p>

                            <span className="text-[10px] text-color-charcoal/30 tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                View Details
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
