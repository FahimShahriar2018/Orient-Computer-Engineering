import React, { useState, useEffect } from 'react';
import {
  Sun,
  Tv,
  Zap,
  BatteryCharging,
  Briefcase,
  Cpu,
} from 'lucide-react';
import HeroBanner from '../components/Home/HeroBanner';
import CategoryGrid from '../components/Home/CategoryGrid';
import FlashDeals from '../components/Home/FlashDeals';
import ProductTabSection from '../components/Home/ProductTabSection';
import BrandsSection from '../components/Home/BrandsSection';
import DepartmentShowcase from '../components/Home/DepartmentShowcase';
import api from '../services/api';

export default function HomePage() {
  const [featuredData, setFeaturedData] = useState({
    featured: [],
    dealOfTheDay: null,
    newArrivals: [],
    bestSellers: [],
  });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, productsRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products?limit=50'),
        ]);

        if (featuredRes.data.success) {
          setFeaturedData(featuredRes.data);
        }
        if (productsRes.data.success) {
          setAllProducts(productsRes.data.products || []);
        }
      } catch (err) {
        console.error('Error loading homepage featured items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Filter products for each department showcase
  const renewableProducts = allProducts.filter(
    (p) => p.category?.slug === 'renewable-energy' || p.categorySlug === 'renewable-energy'
  );
  const audioVisualProducts = allProducts.filter(
    (p) => p.category?.slug === 'audio-visual' || p.categorySlug === 'audio-visual'
  );
  const upsProducts = allProducts.filter(
    (p) => p.category?.slug === 'ups' || p.categorySlug === 'ups'
  );
  const batteryProducts = allProducts.filter(
    (p) => p.category?.slug === 'battery' || p.categorySlug === 'battery'
  );
  const officeProducts = allProducts.filter(
    (p) => p.category?.slug === 'office-equipment' || p.categorySlug === 'office-equipment'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. Hero Carousel Banner + Side Promo Ads */}
      <HeroBanner />

      {/* 2. Official Authorized Brands Showcase */}
      <BrandsSection />

      {/* 3. Hardware & Energy Departments Grid */}
      <CategoryGrid />

      {/* 4. Flash Deal / Deal of the Day with Countdown */}
      <FlashDeals dealProduct={featuredData.dealOfTheDay} />

      {/* 5. Audio Visual & 4K Interactive Flat Panels Department */}
      {audioVisualProducts.length > 0 && (
        <DepartmentShowcase
          title="Audio Visual & 4K Interactive Displays"
          subtitle="Official ViewSonic Google EDLA certified ViewBoard interactive panels and smart projectors."
          categorySlug="audio-visual"
          icon={Tv}
          products={audioVisualProducts}
          accentColor="text-purple-400"
        />
      )}

      {/* 6. Renewable Energy & Solar ESS Solutions Department */}
      {renewableProducts.length > 0 && (
        <DepartmentShowcase
          title="Renewable Energy & Solar ESS Solutions"
          subtitle="SAKO portable energy stations, hybrid solar inverters, and LiFePO4 battery storage."
          categorySlug="renewable-energy"
          icon={Sun}
          products={renewableProducts}
          accentColor="text-amber-400"
        />
      )}

      {/* 7. Tabbed Product Collections (Featured / Top Picks / New Arrivals) */}
      <ProductTabSection
        featured={featuredData.featured}
        bestSellers={featuredData.bestSellers}
        newArrivals={featuredData.newArrivals}
      />

      {/* 8. Online & Offline UPS Systems Department */}
      {upsProducts.length > 0 && (
        <DepartmentShowcase
          title="Enterprise UPS Systems"
          subtitle="Apollo & Kstar true online double conversion zero-transfer and line-interactive UPS units."
          categorySlug="ups"
          icon={Zap}
          products={upsProducts}
          accentColor="text-blue-400"
        />
      )}

      {/* 9. Industrial & Storage Batteries Department */}
      {batteryProducts.length > 0 && (
        <DepartmentShowcase
          title="Industrial & Storage Batteries"
          subtitle="Maintenance-free VRLA AGM batteries and 51.2V high-capacity Lithium storage units."
          categorySlug="battery"
          icon={BatteryCharging}
          products={batteryProducts}
          accentColor="text-cyan-400"
        />
      )}

      {/* 10. Office & Banking Automation Department */}
      {officeProducts.length > 0 && (
        <DepartmentShowcase
          title="Office & Banking Automation Equipment"
          subtitle="Futek vacuum-type money counters, banknote sorting machines, and high-speed document scanners."
          categorySlug="office-equipment"
          icon={Briefcase}
          products={officeProducts}
          accentColor="text-rose-400"
        />
      )}
    </div>
  );
}


