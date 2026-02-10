import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

const CheckoutPage = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Mocking payment processing
        setTimeout(() => {
            alert('Order Placed Successfully. Experience Dominance.');
            clearCart();
            navigate('/');
        }, 2000);
    }

    return (
        <Layout>
            <div className="pt-32 pb-24 bg-color-bg min-h-screen font-body">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h1 className="text-4xl font-heading mb-12">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Final Verification/Form */}
                        <div className="space-y-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <h2 className="text-xs font-heading tracking-[0.3em] text-color-gold font-black uppercase">Contact Information</h2>
                                    <input
                                        required
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        className="w-full bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-xs font-heading tracking-[0.3em] text-color-gold font-black uppercase">Shipping Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="FIRST NAME" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase" />
                                        <input required placeholder="LAST NAME" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase" />
                                    </div>
                                    <input required placeholder="STREET ADDRESS" className="w-full bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="CITY" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase" />
                                        <input required placeholder="POSTCODE/ZIP" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold uppercase" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-xs font-heading tracking-[0.3em] text-color-gold font-black uppercase">Payment</h2>
                                    <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Secure Credit Card Transaction (Mockup)</p>
                                    <div className="space-y-4">
                                        <input required placeholder="CARD NUMBER" className="w-full bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required placeholder="EXP MM/YY" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold" />
                                            <input required placeholder="CVV" className="bg-color-sand/20 border border-color-sand px-4 py-4 text-xs tracking-widest focus:outline-none focus:border-color-gold" />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-color-charcoal/40 text-center tracking-widest uppercase mb-8">
                                    Secure encrypted transaction &bull; Global logistics coverage
                                </p>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-color-charcoal text-white py-6 mb-8 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] disabled:bg-zinc-400"
                                >
                                    {isProcessing ? 'Processing Transaction...' : 'Complete Acquisition'}
                                </button>

                                <div className="pt-8 border-t border-color-sand/30 text-center">
                                    <p className="text-[9px] text-color-charcoal/60 uppercase tracking-[0.3em] font-black mb-2">Requiring Transactional Assistance?</p>
                                    <button className="text-color-gold text-[9px] uppercase tracking-[0.3em] font-black border-b border-color-gold/20 hover:border-color-gold transition-all">
                                        Speak with a Specialist
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Recap */}
                        <div>
                            <div className="bg-color-sand/20 p-8 border border-color-sand">
                                <h3 className="text-sm font-heading tracking-widest mb-8">Summary ({cart.length})</h3>
                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                            <div className="flex gap-4">
                                                <span className="text-zinc-400">{item.quantity}X</span>
                                                <span className="text-color-charcoal">{item.name}</span>
                                            </div>
                                            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-color-sand pt-6 flex justify-between items-center">
                                    <span className="font-heading tracking-widest text-sm text-color-charcoal">Final Total</span>
                                    <span className="font-heading text-xl font-black text-black">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CheckoutPage
