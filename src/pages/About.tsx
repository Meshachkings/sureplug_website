import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-[#F8FFE9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 bg-[#019B5F]/10 text-[#019B5F] rounded-full text-sm font-medium">
                About Us
              </span>
              <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connecting skilled professionals with customers, making service booking simple, secure, and reliable.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Trust",
                  description: "We verify all service providers to ensure quality and reliability",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: "Innovation",
                  description: "Using technology to make service booking seamless and efficient",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Community",
                  description: "Building strong relationships between providers and customers",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-[#019B5F] mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-[#F8FFE9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the people driving our mission forward
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "John Smith",
                  role: "CEO & Founder",
                  image: "https://randomuser.me/api/portraits/men/1.jpg"
                },
                {
                  name: "Sarah Johnson",
                  role: "CTO",
                  image: "https://randomuser.me/api/portraits/women/2.jpg"
                },
                {
                  name: "Michael Chen",
                  role: "Head of Operations",
                  image: "https://randomuser.me/api/portraits/men/3.jpg"
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-[#019B5F]/10"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About; 