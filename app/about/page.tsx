'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
    Mountain, 
    Leaf, 
    Award, 
    Users, 
    Heart, 
    Shield, 
    Sparkles, 
    Target, 
    CheckCircle,
    Quote,
    Star,
    ArrowRight,
    Zap,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState('purity');

  const coreValues = [
    {
      id: 'purity',
      title: 'Purity',
      icon: <Leaf className="w-8 h-8" />,
      description: 'Sourced from pristine Himalayan heights at 16,000+ feet',
      details: 'Every batch is 3rd party lab-tested for heavy metals, contaminants, and authenticity. We maintain the highest standards of purity from source to shelf.',
      stats: '100% Pure'
    },
    {
      id: 'science',
      title: 'Science',
      icon: <Award className="w-8 h-8" />,
      description: 'Ancient wisdom meets modern scientific validation',
      details: 'Our formulations are backed by extensive research and clinical studies, combining traditional Ayurvedic knowledge with contemporary nutritional science.',
      stats: '200+ Studies'
    },
    {
      id: 'purpose',
      title: 'Purpose',
      icon: <Target className="w-8 h-8" />,
      description: 'Awakening the fire within for holistic wellness',
      details: 'We believe true vitality comes from balance - physical energy, mental clarity, and emotional resilience working in harmony.',
      stats: 'Holistic Approach'
    }
  ];



  const teamValues = [
    {
      title: 'Authenticity',
      description: 'We source only genuine, traditional ingredients from their native regions',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Innovation',
      description: 'Combining ancient wisdom with modern convenience and scientific rigor',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Sustainability',
      description: 'Ethical sourcing practices that respect both nature and local communities',
      icon: <Leaf className="w-6 h-6" />
    },
    {
      title: 'Excellence',
      description: 'Uncompromising quality standards in every aspect of our products',
      icon: <Star className="w-6 h-6" />
    }
  ];

  const impactStats = [
    { number: '50,000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { number: '16,000+', label: 'Feet Altitude Sourcing', icon: <Mountain className="w-6 h-6" /> },
    { number: '100%', label: 'Lab Tested Purity', icon: <Shield className="w-6 h-6" /> },
    { number: '98%', label: 'Customer Satisfaction', icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <main className="min-h-screen bg-black relative">
      {/* Universal background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dsejv31js/image/upload/v1767090389/agnishila/bg/vd.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-24 h-24 border-l-2 border-t-2 border-primary-400/20"></div>
          <div className="absolute bottom-16 right-16 w-24 h-24 border-r-2 border-b-2 border-primary-400/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-primary-400"
              ></motion.div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-[0.2em]">
                Our Story
              </span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-primary-400"
              ></motion.div>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
              ABOUT AGNISHILA
              <span className="block text-primary-400">THE FIRE WITHIN</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              In the untouched silence of the Himalayas, where the mountains breathe purity and the winds carry ancient wisdom, something extraordinary was born — <span className="text-primary-400 font-semibold">Agnishila</span>.
            </p>
            
            <p className="text-lg text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              A name that means "The Fire Stone," it symbolizes the spark of life that exists in all of us — a fire that fuels our energy, clarity, and purpose.
            </p>
            
            <p className="text-lg text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              At Agnishila, we believe true vitality doesn't come from haste or hype — it comes from harmony.
            </p>
            
            <p className="text-lg text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              That's why every Agnishila product is crafted not just to energize your body, but to awaken your inner balance — the strength to move, the calm to focus, and the resilience to rise.
            </p>
          </motion.div>

          {/* Brand Story Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
              <Mountain className="w-12 h-12 text-primary-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">🔥 Our Origin</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
             Rooted in reverence for Ayurveda, we journeyed through Himalayan traditions to rediscover powerful natural ingredients. By uniting ancient wisdom with modern science and clean extraction, we deliver pure, potent, and consistent wellness in every form. </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
              <Sparkles className="w-12 h-12 text-primary-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">🌄 Our Promise</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
              Every Agnishila product is 100% pure and third-party lab tested, responsibly sourced from the Himalayas. Scientifically balanced formulations unite Ayurveda with modern nutrition, crafted for modern lifestyles — not just supplements, but a daily ritual of renewal.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
              <Heart className="w-12 h-12 text-primary-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">⚡ Our Purpose</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
           In a fast-moving world, Agnishila reminds you that real energy isn’t about doing more, but being more. Whether you seek focus, strength, calm, or clarity, we help awaken your natural inner fire — steady, grounded, and enduring. </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-jet-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white-to-mauve mb-6 uppercase tracking-wider">
              Our Impact
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Numbers that reflect our commitment to quality, purity, and customer satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center">
                    <div className="text-primary-400">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Interactive Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 border border-primary-400/10 rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-primary-300/10 rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white-to-mauve mb-6 uppercase tracking-wider">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The principles that guide every decision we make and every product we create.
            </p>
          </motion.div>

          {/* Value Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {coreValues.map((value) => (
              <button
                key={value.id}
                onClick={() => setActiveValue(value.id)}
                className={`flex items-center space-x-2 px-6 py-3 border transition-all duration-300 ${
                  activeValue === value.id
                    ? 'bg-primary-400 text-black border-primary-400'
                    : 'bg-transparent text-white border-white/20 hover:border-primary-400/50'
                }`}
              >
                <div className={activeValue === value.id ? 'text-black' : 'text-primary-400'}>
                  {value.icon}
                </div>
                <span className="font-bold uppercase tracking-wider text-sm">{value.title}</span>
              </button>
            ))}
          </div>

          {/* Active Value Details */}
          <motion.div
            key={activeValue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-jet-900 border border-white/20 p-8 lg:p-12"
          >
            {coreValues.filter(v => v.id === activeValue).map((value) => {
              // Map value IDs to images
              const valueImages: { [key: string]: string } = {
                'purity': 'https://res.cloudinary.com/dsejv31js/image/upload/v1767090414/agnishila/first/purity.jpg',
                'science': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop&auto=format',
                'purpose': 'https://res.cloudinary.com/dsejv31js/image/upload/v1767113685/agnishila/agnishila/purpose.jpg'
              };

              return (
                <div key={value.id} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-primary-400">
                        {value.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white uppercase tracking-wider">
                        {value.title}
                      </h3>
                    </div>
                    
                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                      {value.description}
                    </p>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      {value.details}
                    </p>

                    <div className="bg-primary-400/10 border border-primary-400/20 p-4">
                      <div className="text-primary-400 font-bold text-lg mb-1">{value.stats}</div>
                      <div className="text-gray-400 text-sm uppercase tracking-wider">Our Standard</div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-jet-800 border border-primary-400/30 overflow-hidden relative flex items-center justify-center">
                      <img 
                        src={valueImages[value.id]} 
                        alt={value.title}
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>



      {/* Team Values */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white-to-mauve mb-6 uppercase tracking-wider">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The values that shape our culture and guide our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {teamValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden group hover:border-primary-400/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/30 group-hover:border-t-primary-400/50 transition-all duration-300"></div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary-400/20 border border-primary-400/30 flex items-center justify-center">
                    <div className="text-primary-400">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {value.title}
                  </h3>
                </div>
                
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gradient-to-br from-primary-400/10 to-primary-600/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote className="w-16 h-16 text-primary-400 mx-auto mb-8" />
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white-to-mauve mb-8 uppercase tracking-wider">
              💫 Our Philosophy
            </h2>
            
            <div className="space-y-6 text-xl text-gray-300 leading-relaxed mb-12">
              <p>
                From the mountains to your moment, every Agnishila creation carries the same essence:
              </p>
              <p className="text-3xl font-bold text-primary-400">
                Purity of nature. Power of science. Purpose of self.
              </p>
              <p className="text-2xl font-semibold text-white">
                Because energy isn't found — it's awakened.
              </p>
              <p className="text-lg">
                And your journey to it starts here — with Agnishila.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-400 text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                onClick={() => window.location.href = '/products'}
              >
                Explore Products
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                onClick={() => window.location.href = '/benefits'}
              >
                Learn Benefits
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

        <Footer />
      </div>
    </main>
  );
}