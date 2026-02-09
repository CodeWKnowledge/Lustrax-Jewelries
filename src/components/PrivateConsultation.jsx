import React from 'react'
import { Link } from 'react-router-dom'

const PrivateConsultation = () => {
    return (
        <section className="py-20 bg-black overflow-hidden relative">
            <div className="absolute inset-0 bg-neutral-900/10 pointer-events-none" />

            <div className="container mx-auto px-6 text-center relative z-10 animate-slide-up">
                <h2 className="text-3xl md:text-5xl font-heading text-color-gold mb-6 tracking-[0.2em]">
                    PRIVATE <br />
                    <span className="text-white">CONCERNED CONSULTATION</span>
                </h2>

                <p className="text-gray-300 text-sm font-body uppercase tracking-[0.3em] font-light max-w-xl mx-auto mb-10 opacity-80">
                    For men whose vision transcends the standard collections. Experience the pinnacle of exclusivity.
                </p>

                <Link
                    to="/contact"
                    className="inline-block bg-color-gold text-black px-16 py-6 font-body font-black text-xs tracking-[0.4em] uppercase transition-all duration-300 hover:bg-white hover:tracking-[0.5em] shadow-[0_0_40px_rgba(201,162,77,0.2)]"
                >
                    Secure Your Session
                </Link>
            </div>
        </section>
    )
}

export default PrivateConsultation
