import React from 'react'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import FeaturedCollections from '../components/FeaturedCollections'
import PrivateConsultation from '../components/PrivateConsultation'
import PowerStatement from '../components/PowerStatement'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const HomePage = () => {
    return (
        <div className="bg-color-bg min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <FeaturedProducts />
                <PowerStatement />
                <FeaturedCollections />
                <PrivateConsultation />
            </main>
            <Footer />
        </div>
    )
}

export default HomePage
