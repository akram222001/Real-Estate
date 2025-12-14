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
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
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
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              className="rounded-2xl overflow-hidden shadow-lg w-full"
            >
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <img
                    src={listing.imageUrls[0]}
                    className="h-[300px] md:h-[380px] w-full object-cover"
                    alt="listing"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* LISTING SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 space-y-16">
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
          {title}
        </h2>

        <Link to={link} className="text-blue-700 text-sm hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 place-items-stretch">
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
