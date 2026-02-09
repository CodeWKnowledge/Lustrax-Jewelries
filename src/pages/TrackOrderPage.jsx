import React, { useState } from 'react'
import Layout from '../components/Layout'
import { PackageIcon, TruckIcon, CheckmarkCircle02Icon, Search01Icon, CustomerServiceIcon } from 'hugeicons-react'

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('')
    const [trackingData, setTrackingData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleTrack = (e) => {
        e.preventDefault()
        if (!orderId) return

        setLoading(true)
        // Mock API call
        setTimeout(() => {
            setTrackingData({
                id: orderId.toUpperCase(),
                status: 'In Transit',
                expectedDelivery: 'Feb 12, 2026',
                lastLocation: 'Premium Logistics Center, Zurich',
                steps: [
                    { name: 'Order Confirmed', date: 'Feb 08', completed: true },
                    { name: 'Quality Inspection', date: 'Feb 09', completed: true },
                    { name: 'In Transit', date: 'Feb 10', completed: true },
                    { name: 'Delivered', date: '--', completed: false },
                ]
            })
            setLoading(false)
        }, 1200)
    }

    return (
        <Layout>
            <div className="pt-32 pb-24 bg-color-bg min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="text-color-gold uppercase tracking-[0.5em] text-[10px] font-black block mb-4">Post-Purchase Registry</span>
                        <h1 className="text-4xl md:text-6xl font-heading text-color-charcoal font-black uppercase italic">Track Your Asset</h1>
                        <div className="w-24 h-[1px] bg-color-sand mx-auto mt-8" />
                    </div>

                    <div className="bg-white border border-color-sand p-8 md:p-12 mb-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="ENTER ORDER REFERENCE (e.g. LUSTRAX-777)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="flex-1 bg-color-sand/10 border border-color-sand px-6 py-4 text-xs tracking-widest uppercase focus:outline-none focus:border-color-gold transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-color-charcoal text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'SEARCHING...' : 'INITIATE TRACKING'}
                            </button>
                        </form>

                        {!trackingData && !loading && (
                            <div className="text-center py-12 border-2 border-dashed border-color-sand/30">
                                <Search01Icon className="mx-auto text-color-sand mb-4" size={32} />
                                <p className="text-color-charcoal/40 text-[10px] uppercase tracking-widest font-black">Waiting for reference input...</p>
                            </div>
                        )}

                        {trackingData && (
                            <div className="animate-slide-up space-y-12">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-color-sand pb-8 gap-6">
                                    <div>
                                        <p className="text-color-gold text-[10px] font-black tracking-widest mb-1 uppercase">Order Identified</p>
                                        <h2 className="text-2xl font-heading text-color-charcoal uppercase tracking-tighter font-black">{trackingData.id}</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-color-charcoal/40 text-[10px] font-black tracking-widest mb-1 uppercase">Status</p>
                                        <span className="px-4 py-1 bg-color-gold/10 text-color-gold text-[10px] font-black tracking-widest uppercase rounded-full border border-color-gold/20">
                                            {trackingData.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        {trackingData.steps.map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-6">
                                                <div className="relative pt-1">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${step.completed ? 'bg-color-gold border-color-gold' : 'border-color-sand bg-white'}`}>
                                                        {step.completed && <CheckmarkCircle02Icon size={12} className="text-white" />}
                                                    </div>
                                                    {idx !== trackingData.steps.length - 1 && (
                                                        <div className={`absolute top-5 left-2 w-[1px] h-10 ${step.completed ? 'bg-color-gold' : 'bg-color-sand'}`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-[10px] font-black tracking-widest uppercase ${step.completed ? 'text-color-charcoal' : 'text-color-charcoal/20'}`}>
                                                        {step.name}
                                                    </p>
                                                    <p className="text-[10px] font-body text-color-gold tracking-widest uppercase opacity-60">
                                                        {step.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-color-sand/10 p-8 space-y-6 border border-color-sand">
                                        <h3 className="text-xs font-heading font-black tracking-widest uppercase border-b border-color-sand pb-4">Logistics Insight</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[9px] text-color-charcoal/40 font-black uppercase tracking-widest mb-1">Last Transmission</p>
                                                <p className="text-[11px] text-color-charcoal font-black uppercase tracking-widest flex items-center gap-2">
                                                    <TruckIcon size={14} className="text-color-gold" /> {trackingData.lastLocation}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-color-charcoal/40 font-black uppercase tracking-widest mb-1">Expected Possession</p>
                                                <p className="text-[11px] text-color-charcoal font-black uppercase tracking-widest flex items-center gap-2">
                                                    <PackageIcon size={14} className="text-color-gold" /> {trackingData.expectedDelivery}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Support CTA on Page */}
                    <div className="bg-color-charcoal p-10 text-center space-y-6">
                        <CustomerServiceIcon size={40} className="text-color-gold mx-auto" />
                        <h3 className="text-white font-heading text-xl md:text-2xl tracking-[0.2em] font-black uppercase italic">Require Concierge Support?</h3>
                        <p className="text-white/40 font-body text-[10px] tracking-[0.4em] uppercase max-w-sm mx-auto leading-relaxed">
                            Our agents are standing by to assist with your private acquisition inquiries.
                        </p>
                        <div className="pt-4">
                            <button className="border border-color-gold text-color-gold px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-color-gold hover:text-black transition-all">
                                Connect with Specialist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default TrackOrderPage
