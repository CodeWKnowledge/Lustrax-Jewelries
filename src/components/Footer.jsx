import React from 'react'
import { Link } from 'react-router-dom'
import { InstagramIcon, TiktokIcon, PinterestIcon } from 'hugeicons-react'

const Footer = () => {
    return (
        <footer className="bg-color-bg text-black py-16 border-t border-color-sand">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                {/* Brand */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <h3 className="text-3xl font-heading text-black font-black tracking-[0.2em] italic">LUSTRAX</h3>
                    <p className="text-color-charcoal/60 font-body font-light max-w-sm text-sm uppercase tracking-widest leading-loose">
                        A PREMIER HOUSE FOR CURATED EXCELLENCE. AUTHORIZED STOCKIST OF THE WORLD'S MOST ELITE JEWELRY BRANDS.
                    </p>
                </div>

                {/* Support CTA */}
                <div className="col-span-1 md:col-span-2 space-y-8 bg-color-sand/10 p-10 border border-color-sand/30">
                    <h4 className="text-xl font-heading text-color-charcoal font-black tracking-widest uppercase italic border-b border-color-sand pb-4">Concierge Support</h4>
                    <p className="text-color-charcoal/40 font-body text-[10px] tracking-[0.4em] uppercase leading-loose">
                        OUR PRIVATE CLIENT ADVISORS ARE AVAILABLE TO ASSIST WITH CURATION, SIZING, AND LOGISTICS.
                    </p>
                    <div className="pt-4">
                        <button className="bg-color-charcoal text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all">
                            Initiate Inquiry
                        </button>
                    </div>
                </div>

                {/* Logistics */}
                <div>
                    <h4 className="text-xs font-heading text-black font-bold mb-8 tracking-[0.3em] uppercase">Operations</h4>
                    <ul className="space-y-4 text-color-charcoal/40 font-body font-light text-[10px] uppercase tracking-[0.3em]">
                        <li><Link to="/track-order" className="hover:text-color-gold transition-colors">Track Possession</Link></li>
                        <li><Link to="/checkout" className="hover:text-color-gold transition-colors">Secure Checkout</Link></li>
                        <li><Link to="/" className="hover:text-color-gold transition-colors">Vetted Catalog</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-xs font-heading text-black font-bold mb-8 tracking-[0.3em] uppercase">Social</h4>
                    <div className="flex space-x-6">
                        <a href="#" className="text-color-charcoal/40 hover:text-color-gold transition-colors transform hover:scale-110">
                            <InstagramIcon size={20} />
                        </a>
                        <a href="#" className="text-color-charcoal/40 hover:text-color-gold transition-colors transform hover:scale-110">
                            <PinterestIcon size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-color-sand mt-16 pt-8 text-center text-color-charcoal/30 text-[10px] font-body uppercase tracking-[0.5em]">
                &copy; {new Date().getFullYear()} LUSTRAX ELITE RETAIL. ALL RIGHTS RESERVED.
            </div>
        </footer>
    )
}

export default Footer
