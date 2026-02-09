import React from 'react'

const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-black text-white relative overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                {/* Content */}
                <div className="w-full md:w-1/2 animate-slide-up">
                    <span className="text-color-gold tracking-widest uppercase font-semibold mb-4 block">Our Story</span>
                    <h2 className="text-4xl md:text-5xl font-heading mb-6 leading-tight">
                        Crafting Legacy Through <span className="text-color-gold italic">Timeless Artistry</span>
                    </h2>
                    <div className="w-16 h-1 bg-white/20 mb-8" />
                    <p className="text-gray-300 font-light text-lg mb-6 leading-relaxed">
                        Founded on the principles of uncompromising quality and visionary design, Lustrax Jewelries is more than a brand; it is a celebration of life's most precious moments.
                    </p>
                    <p className="text-gray-300 font-light text-lg mb-8 leading-relaxed">
                        Every gem is hand-selected, every setting rigorously inspected. We believe that true luxury lies in the details—the whisper of gold, the fire of a diamond, the weight of history in your hand.
                    </p>
                    <button className="text-white border-b border-color-gold pb-1 hover:text-color-gold transition-colors">
                        Read Our Full Story
                    </button>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1549480112-9c1c9c73b060?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Artisan Craftsmanship"
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-full h-full border border-color-gold/30 z-0" />
                    <div className="absolute -bottom-6 -left-6 w-full h-full border border-white/5 z-0" />
                </div>
            </div>
        </section>
    )
}

export default AboutSection
