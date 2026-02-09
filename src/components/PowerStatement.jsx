import React from 'react'

const PowerStatement = () => {
    return (
        <section className="py-24 bg-black flex items-center justify-center text-center overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl animate-slide-up">
                <div className="relative inline-block mb-10">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-color-gold/30" />
                    <span className="text-color-gold font-black italic tracking-[0.8em] text-[10px] uppercase">The Manifesto</span>
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.2] mb-10">
                    JEWELRY IS NOT <br />
                    <span className="text-color-gold">DECORATION.</span> <br />
                    IT’S A <span className="italic">STATEMENT.</span>
                </h2>

                <div className="w-24 h-[1px] bg-white/20 mx-auto mb-12" />

                <p className="text-gray-400 font-body text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto tracking-wide uppercase">
                    WE CURATE FOR THE ASSERTIVE. THE ELITE. THE ONES WHO COMMAND UNRELIABILITY THROUGH STATUS. EVERY PIECE IS SELECTED FROM THE WORLD’S MOST DOMINANT JEWELRY HOUSES.
                </p>
            </div>
        </section>
    )
}

export default PowerStatement
