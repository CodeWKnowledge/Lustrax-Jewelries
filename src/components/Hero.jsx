import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from 'hugeicons-react'


const Hero = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-color-bg flex flex-col lg:flex-row pt-20 lg:pt-0">
            {/* Left Content Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10 py-20 lg:py-0 mt-20" >
                <div className="animate-slide-up space-y-10">
                    <div className="space-y-4">
                        <span className="text-color-gold uppercase tracking-[0.5em] text-[10px] md:text-xs font-black block border-l-2 border-color-gold pl-6">
                            Exclusivity Defined
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading text-black font-black leading-[1.1] tracking-tighter italic">
                            LUSTRAX <br />
                            <span className="text-color-gold not-italic">Jewelries</span>
                        </h1>
                    </div>

                    <p className="text-color-charcoal/80 font-body font-light text-sm md:text-md max-w-md leading-loose uppercase tracking-widest">
                        The ultimate source for world-class luxury jewelry brands. Curated for men of status and precision.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                        <Link
                            to="/shop"
                            className="group relative inline-flex items-center justify-center px-12 py-5 bg-color-charcoal text-white font-body font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-300 hover:bg-color-gold"
                        >
                            Shop Collection
                            <ArrowRight01Icon size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-12 py-5 border border-color-sand text-color-charcoal/60 font-body font-bold text-[10px] tracking-[0.4em] uppercase hover:text-black hover:border-black transition-all"
                        >
                            Custom Pieces
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Image Grid Area - Irregular 5-image Grid */}
            <div className="w-full lg:w-1/2 h-[600px] lg:h-screen p-8 md:p-16 lg:p-24 flex items-center justify-center">
                <div className="h-full w-full max-w-2xl max-h-[80vh] grid grid-cols-6 grid-rows-6 gap-3 lg:gap-4">
                    {/* Image 1: Large Main */}
                    <div className="col-span-4 row-span-4 bg-zinc-900 overflow-hidden relative group">
                        <img src="/assets/Images/necklace.jpg" alt="Necklace" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    {/* Image 2: Small Top Square */}
                    <div className="col-span-2 row-span-2 bg-zinc-900 overflow-hidden relative group">
                        <img src="/assets/Images/ring.jpg" alt="Ring" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    {/* Image 3: Medium Side Vertical */}
                    <div className="col-span-2 row-span-4 bg-zinc-900 overflow-hidden relative group">
                        <img src="/assets/Images/watch.jpg" alt="Watch" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    {/* Image 4: Medium Bottom Horizontal */}
                    <div className="col-span-2 row-span-2 bg-zinc-900 overflow-hidden relative group">
                        <img src="/assets/Images/bracelet.jpg" alt="Bracelet" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    {/* Image 5: Small Accompanying */}
                    <div className="col-span-2 row-span-2 bg-zinc-900 overflow-hidden relative group">
                        <img src="/assets/Images/Watch-1.jpg" alt="Chrono" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                </div>
            </div>

            {/* Subtle Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-30">
                <span className="text-[8px] tracking-[0.5em] text-white uppercase">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    )
}

export default Hero
