import { useState } from 'react';
import { Link } from 'react-router-dom';

// Add logo imports
const siteLogo = "https://res.cloudinary.com/dujux4xcs/image/upload/v1743514302/Group_21_zddu9f.svg";
const whiteLogoUrl = "https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg";

interface LayoutProps {
  children: React.ReactNode;
}

const socialIcons = {
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  ),
  Twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
    </svg>
  )
};

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Made responsive */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-[#019B5F]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={siteLogo} 
                alt="SurePlug" 
                className="h-6 sm:h-8 w-auto" 
                width={120} 
                height={32} 
                loading="lazy"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link to="/about" className="text-gray-600 hover:text-[#019B5F] transition-colors duration-200">
                About
              </Link>
              <Link to="/services" className="text-gray-600 hover:text-[#019B5F] transition-colors duration-200">
                Services
              </Link>
              <Link to="/contact" 
                className="bg-gradient-to-r from-[#019B5F] to-[#8FDB34] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium 
                hover:shadow-lg hover:shadow-[#019B5F]/30 transition-all duration-200 transform hover:-translate-y-0.5">
                Contact us
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden fixed top-[60px] left-0 w-full bg-white/95 backdrop-blur-lg border-b border-[#019B5F]/20 
              shadow-lg transform transition-all duration-300 ease-in-out z-40 ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
            }`}
          >
            <nav className="px-4 py-6 space-y-6">
              <Link 
                to="/about" 
                className="block text-lg text-gray-600 hover:text-[#019B5F] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="block text-lg text-gray-600 hover:text-[#019B5F] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="block text-lg text-gray-600 hover:text-[#019B5F] transition-colors duration-200 mb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact us
              </Link>
              <Link 
                to="/contact" 
                className="block w-full bg-gradient-to-r from-[#019B5F] to-[#8FDB34] text-white px-6 py-3 
                  rounded-full font-medium text-center hover:shadow-lg hover:shadow-[#019B5F]/30 
                  transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Made responsive */}
      <footer className="bg-gray-900 text-white pt-12 sm:pt-20 pb-8 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-16">
            {/* Company Info */}
            <div className="space-y-4 sm:space-y-6">
              <img 
                src={whiteLogoUrl} 
                alt="SurePlug" 
                className="h-5 sm:h-6 w-auto" 
                width={120} 
                height={24} 
                loading="lazy"
              />
              <p className="text-gray-400 text-sm sm:text-base">
                Connecting you with trusted service providers in your area.
              </p>
              <div className="flex space-x-4">
                {Object.entries(socialIcons).map(([name, icon]) => (
                  <a 
                    key={name} 
                    href="#" 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center 
                      bg-gray-800 hover:bg-[#019B5F] transition-colors duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Footer Links - Made responsive */}
            <div className="mt-8 sm:mt-0">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">About Us</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Press</a></li>
              </ul>
            </div>

            <div className="mt-8 sm:mt-0">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Safety</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="mt-8 sm:mt-0">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="text-gray-400 text-sm sm:text-base">1234 Market St.</li>
                <li className="text-gray-400 text-sm sm:text-base">Suite 1000</li>
                <li className="text-gray-400 text-sm sm:text-base">San Francisco, CA 94103</li>
                <li><Link to="/contact" className="text-[#019B5F] hover:text-[#8FDB34] transition-colors text-sm sm:text-base">hello@sureplug.com</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-400 text-xs sm:text-sm border-t border-gray-800 pt-8">
            © 2024 SurePlug. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 