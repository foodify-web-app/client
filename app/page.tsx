'use client';

import { HeroSection } from '@/components/home/hero-section';
import { CategoriesCarousel } from '@/components/home/categories-carousel';
import { FeaturedRestaurants } from '@/components/home/featured-restaurants';
import { PopularFoods } from '@/components/home/popular-foods';
import { Testimonials } from '@/components/home/testimonials';
import { Footer } from '@/components/footer';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
export default function Home() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  })
  return (
    <div className=" w-full">
      <HeroSection />
      <CategoriesCarousel />
      <FeaturedRestaurants />
      <PopularFoods />
      <Testimonials />
      <Footer />
    </div>
  );
}
