import React, { useState, useEffect } from 'react'
import { QuoteUpIcon, ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react'

const testimonials = [
    {
        id: 1,
        text: "Lustrax defines elegance. The necklace I purchased is not just jewelry; it's a masterpiece that turns heads every time I wear it.",
        author: "Elena V.",
        role: "Verified Buyer"
    },
    {
        id: 2,
        text: "The custom ring design process was impeccable. They brought my vision to life with such precision and artistry. Truly world-class.",
        author: "James Sterling",
        role: "Private Client"
    },
    {
        id: 3,
        text: "I've never seen such brilliance in diamonds. Their collection curation is simply unmatched in the market.",
        author: "Sophia Laurent",
        role: "Fashion Editor"
    }
]

const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="py-24 bg-gray-50 text-black text-center relative">
            <div className="container mx-auto px-6 max-w-4xl">
                <QuoteUpIcon size={48} className="text-color-gold mx-auto mb-8 opacity-50" />

                <div className="relative overflow-hidden h-64 flex items-center justify-center">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${index === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        >
                            <p className="text-2xl md:text-3xl font-heading font-light italic mb-8 leading-relaxed">
                                "{item.text}"
                            </p>
                            <div>
                                <h5 className="font-bold font-body tracking-wide">{item.author}</h5>
                                <span className="text-sm text-gray-500 uppercase tracking-widest">{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
                        className="p-2 border border-black/10 hover:border-color-gold rounded-full hover:bg-color-gold hover:text-white transition-all"
                    >
                        <ArrowLeft01Icon size={20} />
                    </button>
                    <button
                        onClick={() => setCurrent((current + 1) % testimonials.length)}
                        className="p-2 border border-black/10 hover:border-color-gold rounded-full hover:bg-color-gold hover:text-white transition-all"
                    >
                        <ArrowRight01Icon size={20} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
