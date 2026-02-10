import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Layout from '../components/Layout'
import { Delete02Icon, Add01Icon, Remove01Icon, ShoppingCart01Icon } from 'hugeicons-react'

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <Layout>
                <div className="pt-40 pb-20 px-6 min-h-screen bg-color-bg flex flex-col items-center justify-center text-center">
                    <ShoppingCart01Icon size={64} className="text-zinc-200 mb-6" />
                    <h1 className="text-3xl font-heading mb-4">Your Cart is Empty</h1>
                    <p className="text-zinc-500 font-body mb-8">DISCOVER OUR EXCLUSIVE COLLECTIONS AND FIND YOUR NEXT STATEMENT PIECE.</p>
                    <Link to="/shop" className="px-10 py-4 bg-color-charcoal text-white font-body font-bold text-xs tracking-[0.3em] uppercase transition-all hover:bg-zinc-800">
                        Continue Shopping
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="pt-32 pb-24 bg-color-bg min-h-screen">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h1 className="text-4xl font-heading mb-12">Shopping BAG</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-8">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-6 pb-8 border-b border-color-sand items-center">
                                    <div className="w-24 h-32 bg-color-sand/20 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-grow space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-heading font-black tracking-widest">{item.name}</h3>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Brand: {item.brand || 'Elite Selection'}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Size: {item.size}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.size)}
                                                className="text-zinc-300 hover:text-red-500 transition-colors"
                                            >
                                                <Delete02Icon size={18} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex items-center border border-zinc-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                    className="p-2 hover:bg-zinc-50 text-zinc-500"
                                                >
                                                    <Remove01Icon size={14} />
                                                </button>
                                                <span className="px-4 text-xs font-bold font-body">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                    className="p-2 hover:bg-zinc-50 text-zinc-500"
                                                >
                                                    <Add01Icon size={14} />
                                                </button>
                                            </div>
                                            <p className="font-heading text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-color-sand/30 p-8 space-y-6">
                                <h2 className="text-lg font-heading tracking-widest">Order Summary</h2>

                                <div className="space-y-4 text-xs font-body uppercase tracking-wider text-color-charcoal/70">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-color-gold font-bold">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-color-sand flex justify-between items-center">
                                    <span className="font-heading tracking-widest text-sm">Total</span>
                                    <span className="font-heading text-xl font-black">₦{cartTotal.toLocaleString()}</span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="block w-full py-5 bg-color-charcoal text-white text-center font-body font-bold text-[10px] tracking-[0.4em] uppercase transition-all hover:bg-zinc-800"
                                >
                                    Proceed to Checkout
                                </Link>

                                <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest">
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage
