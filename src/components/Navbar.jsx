import { Link, useLocation } from 'react-router-dom'
import { Menu01Icon, Cancel01Icon, ShoppingBag03Icon, Search01Icon } from 'hugeicons-react'
import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Track Order', path: '/track-order' },
        { name: 'Cart', path: '/cart' },
    ]

    const { cartCount } = useCart();
    const isHome = location.pathname === '/'

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-color-bg/90 backdrop-blur-xl border-b border-color-sand py-4' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <h1 className="text-2xl md:text-3xl font-heading font-black tracking-[0.3em] text-black italic transition-all group-hover:text-color-gold">
                            LUSTRAX
                        </h1>
                        <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-color-gold transition-all duration-500 group-hover:w-full" />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-12">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Shop', path: '/shop' },
                        { name: 'Track Order', path: '/track-order' },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-[10px] font-body font-black uppercase tracking-[0.4em] transition-all relative group py-2 ${location.pathname === link.path
                                    ? 'text-color-gold'
                                    : 'text-color-charcoal/60 hover:text-color-gold'
                                }`}
                        >
                            {link.name}
                            <span className={`absolute bottom-0 left-0 h-[1px] bg-color-gold transition-all duration-500 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                }`} />
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="hidden lg:flex items-center space-x-8">
                    <button className={`hover:text-color-gold transition-colors duration-300 ${scrolled || !isHome ? 'text-black' : 'text-black'}`}>
                        <Search01Icon size={20} />
                    </button>
                    <Link to="/cart" className={`relative hover:text-color-gold transition-colors duration-300 ${scrolled || !isHome ? 'text-black' : 'text-black'}`}>
                        <ShoppingBag03Icon size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-color-gold text-[8px] flex items-center justify-center text-white border border-white font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button & Cart */}
                <div className="lg:hidden flex items-center gap-4">
                    <Link to="/cart" className="relative text-black hover:text-color-gold transition-colors">
                        <ShoppingBag03Icon size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-color-gold text-[8px] flex items-center justify-center text-white border border-white font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        className="z-50 p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <Cancel01Icon size={28} className="text-black" /> : <Menu01Icon size={28} className="text-black" />}
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            <div className={`fixed inset-0 bg-color-bg flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col space-y-12 text-center animate-slide-up">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-3xl font-heading transition-colors tracking-[0.2em] ${location.pathname === item.path
                                    ? 'text-color-gold'
                                    : 'text-black hover:text-color-gold'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
