import React from 'react'

const Craftsmanship = () => {
    return (
        <section className="py-16 bg-black border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left: Texture Grid */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-neutral-900 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1627282541334-393dd12dfefb?q=80&w=2070&auto=format&fit=crop"
                                alt="Metal texture"
                                className="w-full h-full object-cover opacity-60 hover:scale-110 transition-transform duration-[2s]"
                            />
                        </div>
                        <div className="aspect-square bg-neutral-900 overflow-hidden mt-8">
                            <img
                                src="https://images.unsplash.com/photo-1610332858146-34ca540024f7?q=80&w=1974&auto=format&fit=crop"
                                alt="Gold detail"
                                className="w-full h-full object-cover opacity-60 hover:scale-110 transition-transform duration-[2s]"
                            />
                        </div>
                    </div>

                    {/* Right: Sharp Copy */}
                    <div className="w-full lg:w-1/2 space-y-8 animate-slide-up">
                        <span className="text-color-gold uppercase tracking-[0.5em] text-[10px] font-bold block">Sourcing Excellence</span>
                        <h2 className="text-3xl md:text-4xl font-heading text-white leading-tight">AUTHENTICATED <br />GLOBAL <span className="text-color-gold italic">BRANDS</span></h2>

                        <div className="space-y-6">
                            <p className="text-gray-400 font-body text-sm tracking-widest leading-loose uppercase">
                                WE DO NOT JUST SELL. WE VET AND CURATE.
                            </p>
                            <p className="text-gray-500 font-body text-sm font-light leading-loose max-w-md">
                                Lustrax operates as a premier house for the world's most aggressive jewelry brands. Every selection in our registry undergoes rigorous authentication and quality testing. Built for longevity. Sourced for dominance.
                            </p>
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/10">
                            <div>
                                <h4 className="text-color-gold text-xs font-heading font-bold mb-2 tracking-widest italic">50+ BRANDS</h4>
                                <p className="text-white/60 text-[10px] uppercase tracking-widest">Global Curated Selection</p>
                            </div>
                            <div>
                                <h4 className="text-color-gold text-xs font-heading font-bold mb-2 tracking-widest italic">100% AUTHENTIC</h4>
                                <p className="text-white/60 text-[10px] uppercase tracking-widest">Certified Brand Partnerships</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Craftsmanship
