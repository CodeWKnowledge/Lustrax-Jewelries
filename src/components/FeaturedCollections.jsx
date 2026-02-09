import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from 'hugeicons-react'

const collections = [
    {
        id: 1,
        name: 'Statement Chains',
        image: '/assets/Images/necklace.jpg',
        desc: 'Precision engineered weight.'
    },
    {
        id: 2,
        name: 'Titan Rings',
        image: '/assets/Images/ring.jpg',
        desc: 'Symbols of dominance.'
    },
    {
        id: 3,
        name: 'Artisan Watches',
        image: '/assets/Images/watch.jpg',
        desc: 'Mastery of time.'
    },
    {
        id: 4,
        name: 'Elite Bracelets',
        image: '/assets/Images/bracelet.jpg',
        desc: 'Bold wrist architecture.'
    },
]

const FeaturedCollections = () => {
    return (
        <section id="collections" className="py-16 bg-color-bg border-y border-color-sand">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="animate-slide-up">
                        <span className="text-color-gold uppercase tracking-[0.4em] text-[10px] font-black mb-3 block">Signature Lines</span>
                        <h2 className="text-3xl md:text-5xl font-heading text-black font-black">THE COLLECTIONS</h2>
                    </div>
                    <Link to="/shop" className="text-color-charcoal/40 hover:text-color-gold tracking-[0.3em] uppercase text-[10px] transition-colors border-b border-color-sand hover:border-color-gold pb-1 font-bold">
                        Browse All Catalog &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {collections.map((col) => (
                        <Link
                            key={col.id}
                            to="/shop"
                            className="group relative h-[420px] overflow-hidden bg-color-sand/20"
                        >
                            {/* Image with zoom */}
                            <img
                                src={col.image}
                                alt={col.name}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                            />

                            {/* Minimal Overlay - Light Theme */}
                            <div className="absolute inset-0 bg-gradient-to-t from-color-bg via-color-bg/5 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-color-gold/0 group-hover:bg-color-gold/5 transition-colors duration-500" />

                            {/* Content Bottom Left */}
                            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-color-gold uppercase tracking-[0.3em] text-[10px] font-bold block mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    Explore Selection
                                </span>
                                <h3 className="text-2xl font-heading text-black tracking-wider mb-2">
                                    {col.name}
                                </h3>
                                <p className="text-color-charcoal/40 text-xs uppercase tracking-widest font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                                    {col.desc}
                                </p>
                            </div>

                            {/* Sharp Border Animation */}
                            <div className="absolute inset-0 border border-color-gold/0 group-hover:border-color-gold/30 transition-all duration-500" />
                            <div className="absolute top-0 left-0 w-0 h-[1px] bg-color-gold group-hover:w-full transition-all duration-700" />
                            <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-color-gold group-hover:w-full transition-all duration-700" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCollections
