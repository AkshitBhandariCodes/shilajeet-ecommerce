import Navbar from '@/components/Navbar';
import CarouselHeroSection from '@/components/CarouselHeroSection';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import InnovativeCarousel from '@/components/InnovativeCarousel';
import CustomerReviews from '@/components/CustomerReviews';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import FAQSection from '@/components/FAQSection';
import CertificateOfAnalysis from '@/components/CertificateOfAnalysis';

export default function Home() {
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
        <CarouselHeroSection />
        <HeroSection />
        <FeaturedProducts />
        <HowItWorks />
        <InnovativeCarousel productName="AGNISHILA" />
        <CustomerReviews />
        <FAQSection />
        <CertificateOfAnalysis />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}