import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { AlertCircleIcon } from 'hugeicons-react'

const NotFoundPage = () => {
    return (
        <Layout>
            <div className="pt-20 bg-color-bg min-h-screen flex flex-col items-center justify-center text-center px-6">
                <div className="animate-slide-up space-y-8">
                    <div className="relative">
                        <span className="text-[120px] md:text-[200px] font-heading font-black text-color-sand/30 leading-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertCircleIcon size={48} className="text-color-gold animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-heading text-color-charcoal tracking-widest font-black uppercase italic">Out of Bounds</h1>
                        <p className="text-color-charcoal/40 font-body text-xs md:text-sm tracking-[0.4em] uppercase max-w-md mx-auto leading-relaxed">
                            The asset you are looking for has been moved or purged from the registry.
                        </p>
                    </div>

                    <div className="pt-10">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-12 py-5 bg-color-charcoal text-white font-body font-black text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all"
                        >
                            Return to Registry
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NotFoundPage
