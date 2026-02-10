import React from 'react'
import { Cancel01Icon, ShoppingCart01Icon } from 'hugeicons-react'
import { useCart } from '../context/CartContext'

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart()

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-color-bg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-color-sand shadow-2xl animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-color-charcoal/40 hover:text-color-gold transition-colors z-20"
                >
                    <Cancel01Icon size={32} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Product Image */}
                    <div className="w-full md:w-1/2 aspect-[4/5] bg-color-sand/10">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-color-gold text-[10px] tracking-[0.5em] uppercase font-black mb-4">
                            Premium Selection
                        </span>

                        <h2 className="text-3xl font-heading text-black mb-4 tracking-tighter uppercase font-black leading-none">
                            {product.name}
                        </h2>

                        <p className="text-color-gold font-body font-black text-xl mb-8 tracking-widest">
                            ₦{product.price.toLocaleString()}
                        </p>

                        <div className="w-12 h-[1px] bg-color-gold/30 mb-8" />

                        <p className="text-color-charcoal/70 text-sm font-body leading-loose uppercase tracking-widest mb-10">
                            Engineering precision meets timeless luxury. This piece is crafted for those who define exclusivity.
                        </p>

                        <button
                            onClick={() => {
                                addToCart(product)
                                onClose()
                            }}
                            className="group relative flex items-center justify-center gap-4 bg-color-charcoal text-white px-10 py-5 font-body font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-300 hover:bg-color-gold overflow-hidden"
                        >
                            <span className="relative z-10">Add To Cart</span>
                            <ShoppingCart01Icon size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                            {/* Hover Shine Effect */}
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000" />
                        </button>

                        <p className="mt-6 text-[8px] text-color-charcoal/30 tracking-[0.2em] font-bold uppercase text-center">
                            Secure Worldwide Express Shipping • Insured Delivery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickViewModal
