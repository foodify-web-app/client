'use client';

import { HeroSection } from '@/components/home/hero-section';
import { CategoriesCarousel } from '@/components/home/categories-carousel';
import { FeaturedRestaurants } from '@/components/home/featured-restaurants';
import { PopularFoods } from '@/components/home/popular-foods';
import { Testimonials } from '@/components/home/testimonials';
import { Footer } from '@/components/footer';

export default function Home() {
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
