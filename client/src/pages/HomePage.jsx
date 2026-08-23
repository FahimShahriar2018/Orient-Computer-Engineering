import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import CategoryGrid from '../components/Home/CategoryGrid';
import FlashDeals from '../components/Home/FlashDeals';
import ProductTabSection from '../components/Home/ProductTabSection';
import api from '../services/api';

export default function HomePage() {
  const [featuredData, setFeaturedData] = useState({
    featured: [],
    dealOfTheDay: null,
    newArrivals: [],
    bestSellers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await api.get('/products/featured');
        if (res.data.success) {
          setFeaturedData(res.data);
        }
      } catch (err) {
        console.error('Error loading homepage featured items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. Hero Carousel Banner */}
      <HeroBanner />

      {/* 2. Hardware Departments Grid */}
      <CategoryGrid />

      {/* 3. Flash Deal / Deal of the Day with Countdown */}
      <FlashDeals dealProduct={featuredData.dealOfTheDay} />

      {/* 4. Tabbed Product Collections (Featured / Best Sellers / New Arrivals) */}
      <ProductTabSection
        featured={featuredData.featured}
        bestSellers={featuredData.bestSellers}
        newArrivals={featuredData.newArrivals}
      />
    </div>
  );
}
