import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { useOutletContext } from "react-router-dom";
import { API_BASE } from "../../config";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const { setFooterData } = useOutletContext();

  useEffect(() => {
    setFooterData([
      { title: "🔥 Hot Property Deals", link: "/search?offer=true" },
      { title: "🏡 Homes for Rent", link: "/search?type=rent" },
      { title: "🏘️ Properties for Sale", link: "/search?type=sale" },
    ]);
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offer = await fetch(`${API_BASE}/api/listing/get?offer=true&limit=4`);
        setOfferListings(await offer.json());

        const rent = await fetch(`${API_BASE}/api/listing/get?type=rent&limit=4`);
        setRentListings(await rent.json());

        const sale = await fetch(`${API_BASE}/api/listing/get?type=sale&limit=4`);
        setSaleListings(await sale.json());
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 bg-gradient-to-r from-[#F7EFFB] via-[#E4F2FF] to-[#E8FFF5] text-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center md:gap-0 gap-8">
          {/* LEFT TEXT SECTION */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
              Your Ideal Home <br /> Awaits You
            </h1>

            <p className="text-gray-500 mt-5 text-sm md:text-base max-w-md mx-auto lg:mx-0">
              Browse premium homes, apartments and exclusive listings from
              verified property owners.
            </p>

            <Link
              to="/search"
              className="inline-block mt-7 px-7 py-3 bg-slate-800 text-white rounded-xl font-medium shadow-md hover:bg-slate-700 transition"
            >
              Start Exploring
            </Link>
          </div>

          {/* RIGHT IMAGE SLIDER */}
          <div>
            <Swiper
  // 🔥 Mobile me hide, Desktop me show
  navigation={{
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    hideOnClick: true,
    enabled: window.innerWidth > 768 // 🔥 Only enable on desktop
  }}
  
  // 🔥 Mobile me hide dots
  pagination={{ 
    clickable: true,
    dynamicBullets: true,
    // Hide on mobile
    enabled: window.innerWidth > 768 // 🔥 Only enable on desktop
  }}
  
  modules={[Navigation, Pagination]}
  className="rounded-2xl overflow-hidden shadow-lg w-full"
  
  // 🔥 Responsive breakpoints
  breakpoints={{
    // Mobile (0px - 639px)
    0: {
      navigation: { enabled: false },
      pagination: { enabled: false }
    },
    // Tablet (640px - 767px)
    640: {
      navigation: { enabled: false },
      pagination: { enabled: true } // Dots show on tablet
    },
    // Desktop (768px+)
    768: {
      navigation: { enabled: true }, // Arrows show
      pagination: { enabled: true }  // Dots show
    }
  }}
>
  {offerListings.map((listing) => (
    <SwiperSlide key={listing._id}>
      <img
        src={listing.imageUrls[0]}
        className="h-[200px] md:h-[380px] w-full object-cover"
        alt="listing"
      />
    </SwiperSlide>
  ))}
</Swiper>
          </div>
        </div>
      </section>

      {/* LISTING SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:space-y-16 space-y-8">
        {offerListings.length > 0 && (
          <ListingSection
            title="🔥 Hot Property Deals"
            link="/search?offer=true"
            data={offerListings}
          />
        )}

        {rentListings.length > 0 && (
          <ListingSection
            title="🏡 Homes for Rent"
            link="/search?type=rent"
            data={rentListings}
          />
        )}

        {saleListings.length > 0 && (
          <ListingSection
            title="🏘️ Properties for Sale"
            link="/search?type=sale"
            data={saleListings}
          />
        )}
      </section>
    </div>
  );
}

/* REUSABLE SECTION COMPONENT */
function ListingSection({ title, link, data }) {
  return (
    <div className="px-2 md:px-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
          {title}
        </h2>
        <Link 
          to={link} 
          className="text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* 🔥 PERFECT GRID - Mobile: 2 columns with proper spacing */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
        {data.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

ListingSection.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
