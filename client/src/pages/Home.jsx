// import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css/bundle";
// import ListingItem from "../components/ListingItem";
// import { useOutletContext } from "react-router-dom";
// import { API_BASE } from "../../config";

// export default function Home() {
//   const [offerListings, setOfferListings] = useState([]);
//   const [saleListings, setSaleListings] = useState([]);
//   const [rentListings, setRentListings] = useState([]);
//   const { setFooterData } = useOutletContext();

//   useEffect(() => {
//     setFooterData([
//       { title: "🔥 Hot Property Deals", link: "/search?offer=true" },
//       { title: "🏡 Homes for Rent", link: "/search?type=rent" },
//       { title: "🏘️ Properties for Sale", link: "/search?type=sale" },
//     ]);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const offer = await fetch(`${API_BASE}/api/listing/get?offer=true&limit=4`);
//         setOfferListings(await offer.json());

//         const rent = await fetch(`${API_BASE}/api/listing/get?type=rent&limit=4`);
//         setRentListings(await rent.json());

//         const sale = await fetch(`${API_BASE}/api/listing/get?type=sale&limit=4`);
//         setSaleListings(await sale.json());
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="bg-white">
//       {/* HERO SECTION */}
//       <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 bg-gradient-to-r from-[#F7EFFB] via-[#E4F2FF] to-[#E8FFF5] text-slate-800">
//         <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
//           {/* LEFT TEXT SECTION */}
//           <div className="text-center lg:text-left">
//             <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
//               Your Ideal Home <br /> Awaits You
//             </h1>

//             <p className="text-gray-500 mt-5 text-sm md:text-base max-w-md mx-auto lg:mx-0">
//               Browse premium homes, apartments and exclusive listings from
//               verified property owners.
//             </p>

//             <Link
//               to="/search"
//               className="inline-block mt-7 px-7 py-3 bg-slate-800 text-white rounded-xl font-medium shadow-md hover:bg-slate-700 transition"
//             >
//               Start Exploring
//             </Link>
//           </div>

//           {/* RIGHT IMAGE SLIDER */}
//           <div>
//             <Swiper
//               navigation
//               pagination={{ clickable: true }}
//               modules={[Navigation, Pagination]}
//               className="rounded-2xl overflow-hidden shadow-lg w-full"
//             >
//               {offerListings.map((listing) => (
//                 <SwiperSlide key={listing._id}>
//                   <img
//                     src={listing.imageUrls[0]}
//                     className="h-[300px] md:h-[380px] w-full object-cover"
//                     alt="listing"
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         </div>
//       </section>

//       {/* LISTING SECTIONS */}
//       <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 space-y-16">
//         {offerListings.length > 0 && (
//           <ListingSection
//             title="🔥 Hot Property Deals"
//             link="/search?offer=true"
//             data={offerListings}
//           />
//         )}

//         {rentListings.length > 0 && (
//           <ListingSection
//             title="🏡 Homes for Rent"
//             link="/search?type=rent"
//             data={rentListings}
//           />
//         )}

//         {saleListings.length > 0 && (
//           <ListingSection
//             title="🏘️ Properties for Sale"
//             link="/search?type=sale"
//             data={saleListings}
//           />
//         )}
//       </section>
//     </div>
//   );
// }

// /* REUSABLE SECTION COMPONENT */
// function ListingSection({ title, link, data }) {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
//           {title}
//         </h2>

//         <Link to={link} className="text-blue-700 text-sm hover:underline">
//           View All →
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 place-items-stretch">
//         {data.map((listing) => (
//           <div key={listing._id} className="w-full flex">
//             <ListingItem listing={listing} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// ListingSection.propTypes = {
//   title: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { useOutletContext } from "react-router-dom";
import { API_BASE } from "../../config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CountUp from "react-countup";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const { setFooterData } = useOutletContext();

  const hasOffers = offerListings?.length > 0;

  useEffect(() => {
    setFooterData([
      { title: "🔥 Hot Property Deals", link: "/search?offer=true" },
      { title: "🏡 Homes for Rent", link: "/search?type=rent" },
      { title: "🏘️ Properties for Sale", link: "/search?type=sale" },
    ]);
  }, []);

  const statsData = [
    { end: 10000, label: "Properties", suffix: "+" },
    { end: 5000, label: "Happy Clients", suffix: "+" },
    { end: 100, label: "Cities", suffix: "+" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offer = await fetch(
          `${API_BASE}/api/listing/get?offer=true&limit=4`
        );
        setOfferListings(await offer.json());

        const rent = await fetch(
          `${API_BASE}/api/listing/get?type=rent&limit=4`
        );
        setRentListings(await rent.json());

        const sale = await fetch(
          `${API_BASE}/api/listing/get?type=sale&limit=4`
        );
        setSaleListings(await sale.json());
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  function HeroPlaceholder() {
    return (
      <div className="relative h-[220px] md:h-[380px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        {/* shimmer animation */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative z-10 text-center px-6">
          <p className="text-slate-700 text-sm uppercase tracking-wide">
            Premium Properties
          </p>
          <h3 className="mt-2 text-xl md:text-3xl font-bold text-slate-800">
            Homes you’ll love
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 bg-gradient-to-r from-[#F7EFFB] via-[#E4F2FF] to-[#E8FFF5] text-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center md:gap-0 gap-10">
          {/* LEFT TEXT SECTION */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
              Your Ideal Home <br /> Awaits You
            </h1>

            <p className="text-gray-500 mt-5 text-sm md:text-base max-w-md mx-auto lg:mx-0">
              Browse premium homes, apartments and exclusive listings from verified property owners.
            </p>

            {/* PRIMARY CTA */}
            <Link
              to="/search"
              className="inline-block mt-7 px-8 py-3 bg-slate-800 text-white rounded-xl font-medium shadow-md hover:bg-slate-700 transition"
            >
              Start Exploring
            </Link>

            {/* TRUST HIGHLIGHTS */}
            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-gray-600">
              <span className="bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
                🛡️ Verified Listings
              </span>
              <span className="bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
                📍 Prime Locations
              </span>
              <span className="bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
                💬 Zero Brokerage
              </span>
            </div>

            {/* QUICK STATS */}
            <div className="mt-7 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {statsData.map((stat, index) => (
                <div key={index}>
                  <p className="text-2xl font-bold text-slate-800">
                    <CountUp end={stat.end} duration={2} separator="," />
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE SLIDER  Desktop view */}
          <div className="relative">
            {hasOffers ? (
              <>
                <Swiper
                  navigation={{
                    nextEl: ".swiper-next-btn",
                    prevEl: ".swiper-prev-btn",
                  }}
                  loop
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination, Autoplay]}
                  className="rounded-2xl overflow-hidden shadow-lg w-full hidden md:block"
                >
                  {offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                      <img
                        src={listing.imageUrls?.[0]}
                        className="h-[220px] sm:h-[260px] md:h-[380px] w-full object-cover"
                        alt="listing"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Mobile view */}
                <Swiper
                  loop
                  centeredSlides
                  grabCursor
                  autoplay={{
                    delay: 0, // continuous
                    disableOnInteraction: false,
                  }}
                  speed={4000} // smooth motion
                  pagination={false}
                  navigation={{
                    nextEl: ".swiper-next-btn",
                    prevEl: ".swiper-prev-btn",
                  }}
                  breakpoints={{
                    0: {
                      slidesPerView: 1.6, // 👈 mobile preview
                      spaceBetween: 12,
                    },
                    480: {
                      slidesPerView: 1.4,
                      spaceBetween: 14,
                    },
                    768: {
                      slidesPerView: 1, // 👈 tablet & up normal
                      spaceBetween: 0,
                    },
                  }}
                  modules={[Autoplay, Navigation]}
                  className="overflow-hidden w-full md:hidden block"
                >
                  {offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                      <div className="overflow-hidden">
                        <img
                          src={listing.imageUrls?.[0]}
                          className="h-[150px] sm:h-[260px] w-full object-cover"
                          alt="listing"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* NAVIGATION (hide on mobile) */}
                <div className="hidden md:flex swiper-prev-btn absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 w-10 h-10 rounded-full items-center justify-center shadow">
                  <FaChevronLeft className="text-gray-800" />
                </div>

                <div className="hidden md:flex swiper-next-btn absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 w-10 h-10 rounded-full items-center justify-center shadow">
                  <FaChevronRight className="text-gray-800" />
                </div>
              </>
            ) : (
              <HeroPlaceholder />
            )}
          </div>
        </div>
      </section>

      {/* LISTING SECTIONS */}
      <section className="max-w-7xl mx-auto px-2 lg:px-6 py-12 md:space-y-16 space-y-8">
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
      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
        {data.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div> */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 place-items-stretch">
        {data.map((listing) => (
          <div key={listing._id} className="w-full flex">
            <ListingItem listing={listing} />
          </div>
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
