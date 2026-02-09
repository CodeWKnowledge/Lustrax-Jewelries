import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

import { CustomerServiceIcon } from 'hugeicons-react'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen font-body text-color-charcoal selection:bg-color-gold selection:text-black">
            <Navbar />
            <main>{children}</main>
            <Footer />

            {/* Universal Concierge CTA */}
            <button
                className="fixed bottom-8 right-8 z-[60] bg-color-charcoal text-color-gold p-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-color-gold/30 group hover:scale-110 active:scale-95 transition-all duration-500"
                aria-label="Contact Concierge"
            >
                <CustomerServiceIcon size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute right-full mr-4 bg-color-charcoal text-color-gold px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-color-gold/20 backdrop-blur-md">
                    Private Concierge
                </span>
            </button>
        </div>
    )
}

export default Layout
