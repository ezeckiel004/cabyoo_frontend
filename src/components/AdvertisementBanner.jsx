import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { adminAPI } from "../api/admin";

const AdvertisementBanner = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAdvertisements();
  }, []);

  const fetchActiveAdvertisements = async () => {
    try {
      const response = await adminAPI.getActiveAdvertisements();
      if (response.data.success) {
        setAdvertisements(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || advertisements.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        className="rounded-xl overflow-hidden"
      >
        {advertisements.map((ad) => (
          <SwiperSlide key={ad.id}>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
            >
              {ad.image ? (
                <img
                  src={`/storage/${ad.image}`}
                  alt={ad.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
              ) : (
                <div className="w-full h-48 md:h-64 bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                      style={{ backgroundColor: ad.badgeColor }}
                    >
                      {ad.badge}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {ad.title}
                    </h3>
                    <p className="text-sm md:text-base opacity-90">
                      {ad.description}
                    </p>
                  </div>
                </div>
              )}
              {ad.badge && (
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: ad.badgeColor }}
                >
                  {ad.badge}
                </span>
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdvertisementBanner;