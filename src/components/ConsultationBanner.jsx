import React from 'react'

const ConsultationBanner = () => {
    return (
        <section className="py-20 bg-black text-center relative overflow-hidden border-t border-color-gold/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />

            <div className="relative z-10 container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-heading text-color-gold mb-6 animate-pulse-slow">
                    Exquisite Taste Deserves Personal Attention
                </h2>
                <p className="text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                    Book a private consultation with our jewelry experts to discover pieces that resonate with your unique story.
                </p>

                <button className="px-10 py-4 border border-color-gold text-color-gold hover:bg-color-gold hover:text-white transition-all duration-300 uppercase tracking-widest font-semibold rounded-sm">
                    Schedule Private View
                </button>
            </div>
        </section>
    )
}

export default ConsultationBanner
