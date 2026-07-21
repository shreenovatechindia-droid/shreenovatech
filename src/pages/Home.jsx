import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Stats from '../components/Stats';
import HelpSection from '../components/HelpSection';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import EnquiryPopup from '../components/EnquiryPopup';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <MainLayout>
      <EnquiryPopup />
      <Hero />
      <Pricing />
      <WhyChooseUs />
      <Process />
      <Portfolio />
      <HelpSection />
      <Stats />
      <Testimonials />
      <Contact />
    </MainLayout>
  );
}
