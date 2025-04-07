import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

// Add logo import
const siteLogo = "https://res.cloudinary.com/dujux4xcs/image/upload/v1743514302/Group_21_zddu9f.svg";

// Sample profile images from Unsplash
const profileImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
];

// Placeholder app screenshot
const mockAppScreenshot = 'https://res.cloudinary.com/dujux4xcs/image/upload/v1743594973/Group_1171275932_nndggn.png';

// Add store badges
const storeBadges = {
  googlePlay: {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 512 512" fill="currentColor">
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
      </svg>
    ),
    text: {
      top: "GET IT ON",
      bottom: "Google Play"
    }
  },
  appStore: {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 384 512" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
    ),
    text: {
      top: "Download on the",
      bottom: "App Store"
    }
  }
};

const LandingPage = () => {
  return (
    <Layout>
      <div className="landing-page font-montserrat bg-[#F8FFE9]">
        {/* Header with Logo */}
        <header className="fixed w-full top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-[#019B5F]/20">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center">
                <img src={siteLogo} alt="SurePlug" className="h-8 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/about" className="text-gray-600 hover:text-[#019B5F] transition-colors duration-200">
                  About
                </Link>
                <Link to="/services" className="text-gray-600 hover:text-[#019B5F] transition-colors duration-200">
                  Services
                </Link>
                <Link to="/contact" 
                  className="bg-gradient-to-r from-[#019B5F] to-[#8FDB34] text-white px-6 py-2.5 rounded-full font-medium 
                  hover:shadow-lg hover:shadow-[#019B5F]/30 transition-all duration-200 transform hover:-translate-y-0.5">
                  Contact us
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section - Sleek Design */}
        <section className="pt-24 pb-12 relative overflow-hidden">
          {/* Background Elements - More subtle */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-[#019B5F] rounded-full blur-[120px] opacity-[0.07]"></div>
            <div className="absolute -left-40 top-1/2 w-[500px] h-[500px] bg-[#8FDB34] rounded-full blur-[120px] opacity-[0.07]"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                    #1 Service Provider Platform
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    Find professional
                    <span className="block mt-2 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] bg-clip-text text-transparent">
                      services in your area
                    </span>
                  </h1>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Connect with verified service providers and get your tasks done with confidence.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {Object.entries(storeBadges).map(([store, { icon, text }]) => (
                    <a 
                      key={store}
                      href="#" 
                      className="flex items-center gap-3 px-6 py-3 bg-[#019B5F] hover:bg-[#019B5F]/90 
                        text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="text-2xl">
                        {icon}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs opacity-80">{text.top}</span>
                        <span className="text-base font-medium -mt-0.5">{text.bottom}</span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Stats - Simplified */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-[#019B5F]/10 overflow-hidden"
                        >
                          <img 
                            src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#019B5F]">10K+</span> users
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#019B5F]">★★★★★</span>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">4.9/5</span> ratings
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - App Preview */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative bg-gradient-to-b from-[#F8FFE9] to-white/80 rounded-2xl p-4 max-w-[280px] border border-[#019B5F]/10">
                  <img 
                    src={mockAppScreenshot}
                    alt="App interface" 
                    className="rounded-xl w-full h-auto"
                  />
                  
                  {/* Floating cards - More compact */}
                  {profileImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`absolute z-20 ${getProfilePosition(index)} 
                        ${index % 2 ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-[floatReverse_3.5s_ease-in-out_infinite]'}`}
                    >
                      <div className="bg-white/95 backdrop-blur-md rounded-lg p-2 border border-[#019B5F]/10
                        hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={image} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#019B5F]/20"
                          />
                          <div className="space-y-1">
                            <div className="h-1.5 w-14 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"></div>
                            <div className="h-1 w-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Modern Cards */}
        <section className="py-16 bg-gradient-to-b from-[#F8FFE9] to-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-bold">
                The Platform that Works for You
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                We've built the most comprehensive platform for connecting service providers with customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Easy to Find",
                  description: "Find verified service providers in your area with just a few clicks"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Secure Payments",
                  description: "Safe and secure payment processing for all services"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  title: "Quality Service",
                  description: "All service providers are vetted and reviewed by our community"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300
                    border border-gray-100 hover:border-[#019B5F]/20 hover:-translate-y-1"
                >
                  <div className="text-[#019B5F] mb-4 p-3 bg-[#019B5F]/10 rounded-xl inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] 
                    group-hover:w-full transition-all duration-300 rounded-b-2xl">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 mb-4 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                Simple Process
              </span>
              <h2 className="text-3xl font-bold">How SurePlug Works</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Get started in minutes with our simple three-step process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#019B5F]/20 to-[#8FDB34]/20"></div>
              
              {[
                {
                  number: "01",
                  title: "Search Services",
                  description: "Browse through our extensive list of verified service providers in your area"
                },
                {
                  number: "02",
                  title: "Choose Provider",
                  description: "Select the best match based on reviews, ratings, and detailed profiles"
                },
                {
                  number: "03",
                  title: "Book & Pay",
                  description: "Schedule your service and pay securely through our platform"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#019B5F] to-[#8FDB34] bg-clip-text text-transparent mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Modern Design */}
        <section className="py-24 bg-gradient-to-b from-[#F8FFE9] via-white to-[#F8FFE9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 mb-4 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                Testimonials
              </span>
              <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Homeowner",
                  image: "https://randomuser.me/api/portraits/women/1.jpg",
                  quote: "Found a great plumber within minutes. The whole process was smooth and professional.",
                  rating: 5,
                  service: "Plumbing Service",
                  date: "2 days ago"
                },
                {
                  name: "Michael Chen",
                  role: "Business Owner",
                  image: "https://randomuser.me/api/portraits/men/2.jpg",
                  quote: "SurePlug has transformed how we hire contractors. Reliable and efficient service.",
                  rating: 5,
                  service: "Electrical Work",
                  date: "1 week ago"
                },
                {
                  name: "Emma Davis",
                  role: "Property Manager",
                  image: "https://randomuser.me/api/portraits/women/3.jpg",
                  quote: "The quality of service providers on this platform is exceptional. Highly recommended!",
                  rating: 5,
                  service: "Home Cleaning",
                  date: "3 days ago"
                }
              ].map((testimonial, index) => (
                <div key={index} 
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 
                    border border-gray-100 hover:border-[#019B5F]/20 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#019B5F]/10"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4 text-[#019B5F] flex gap-1">
                    {Array(testimonial.rating).fill('★').map((star, i) => (
                      <span key={i} className="text-lg">{star}</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-[#019B5F]">{testimonial.service}</span>
                    <span className="text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Services Section - Modern Design */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5"></div>
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 mb-4 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                Our Services
              </span>
              <h2 className="text-4xl font-bold mb-4">Popular Categories</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  ),
                  name: "Plumbing",
                  count: "250+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  name: "Electrical",
                  count: "180+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  name: "Cleaning",
                  count: "320+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  ),
                  name: "Painting",
                  count: "150+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  name: "Carpentry",
                  count: "200+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ),
                  name: "Gardening",
                  count: "120+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z M9 7h6 M9 11h6 M9 15h4" />
                    </svg>
                  ),
                  name: "Auto Service",
                  count: "160+ Providers"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  name: "Home Security",
                  count: "90+ Providers"
                }
              ].map((category, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#019B5F]/20 
                    hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#019B5F] to-[#8FDB34] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="text-[#019B5F] mb-6 group-hover:scale-110 transition-transform duration-300 bg-[#019B5F]/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#019B5F] text-white 
                rounded-full font-medium hover:shadow-lg hover:shadow-[#019B5F]/20 transition-all duration-200 group">
                Explore All Categories
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#019B5F]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied users who have found reliable service providers through SurePlug
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-[#019B5F] px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
                Download App
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Helper function to position profile cards - Adjusted positions
const getProfilePosition = (index: number): string => {
  const positions = [
    '-left-20 top-8',
    '-right-16 top-1/3',
    '-left-12 bottom-16'
  ];
  return positions[index] || '';
};

export default LandingPage; 