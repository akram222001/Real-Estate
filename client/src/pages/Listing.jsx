// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import { useSelector } from 'react-redux';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css/bundle';
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from 'react-icons/fa';
// import Contact from '../components/Contact';

// // https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

// export default function Listing() {
//   SwiperCore.use([Navigation]);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false);
//   const params = useParams();
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         console.log("res list",res)
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
//       {error && (
//         <p className='text-center my-7 text-2xl'>Something went wrong!</p>
//       )}
//       {listing && !loading && !error && (
//         <div>
//           <Swiper navigation>
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className='h-[550px]'
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: 'cover',
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
//             <FaShare
//               className='text-slate-500'
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => {
//                   setCopied(false);
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
//               Link copied!
//             </p>
//           )}
//           <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
//             <p className='text-2xl font-semibold'>
//               {listing.name} - ${' '}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString('en-US')
//                 : listing.regularPrice.toLocaleString('en-US')}
//               {listing.type === 'rent' && ' / month'}
//             </p>
//             <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
//               <FaMapMarkerAlt className='text-green-700' />
//               {listing.address}
//             </p>
//             <div className='flex gap-4'>
//               <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                 {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
//               </p>
//               {listing.offer && (
//                 <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                   ${+listing.regularPrice - +listing.discountPrice} OFF
//                 </p>
//               )}
//             </div>
//             <p className='text-slate-800'>
//               <span className='font-semibold text-black'>Description - </span>
//               {listing.description}
//             </p>
//             <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBed className='text-lg' />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds `
//                   : `${listing.bedrooms} bed `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBath className='text-lg' />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths `
//                   : `${listing.bathrooms} bath `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaParking className='text-lg' />
//                 {listing.parking ? 'Parking spot' : 'No Parking'}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaChair className='text-lg' />
//                 {listing.furnished ? 'Furnished' : 'Unfurnished'}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button
//                 onClick={() => setContact(true)}
//                 className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
//               >
//                 Contact landlord
//               </button>
//             )}
//             {contact && <Contact listing={listing} />}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { API_BASE } from "../../config";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-white">
      {loading && <p className="text-center text-xl mt-10">Loading...</p>}
      {error && (
        <p className="text-center text-xl mt-10 text-red-600">
          Something went wrong!
        </p>
      )}

      {listing && !loading && !error && (
        <div className="pb-10">
          {/* IMAGE SLIDER */}
          <Swiper navigation>
            {listing.imageUrls.map((url, i) => (
              <SwiperSlide key={i}>
                <div
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* SHARE BUTTON */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-xl cursor-pointer">
            <FaShare
              className="text-slate-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[22%] right-[5%] z-10 rounded-md bg-slate-200 p-2 shadow">
              Link copied!
            </p>
          )}

          {/* DETAILS */}
          <div className="max-w-5xl mx-auto p-5 space-y-5 mt-8 bg-white rounded-xl">
            {/* TITLE + PRICE */}
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {listing.name}
              </h1>
              <p className="text-3xl font-bold text-blue-800">
                ₹{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-IN")
                  : listing.regularPrice.toLocaleString("en-IN")}
                {listing.type === "rent" && (
                  <span className="text-lg text-slate-600"> / month</span>
                )}
              </p>
            </div>

            {/* LOCATION */}
            <p className="flex items-center gap-2 text-slate-600 text-lg">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-600 text-white px-4 py-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.offer && (
                <span className="bg-green-700 text-white px-4 py-1 rounded-md">
                  ₹ {+listing.regularPrice - +listing.discountPrice} OFF
                </span>
              )}
              {listing.featured && (
                <span className="bg-yellow-500 text-black px-4 py-1 rounded-md font-semibold">
                  ⭐ Featured
                </span>
              )}
              <span className="bg-slate-200 px-4 py-1 rounded-md text-sm">
                👁 {listing.views} Views
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-slate-50 border p-5 rounded-lg leading-relaxed text-slate-800">
              <span className="font-semibold text-black">Description —</span>{" "}
              {listing.description}
            </div>

            {/* BASIC FEATURES */}
            <ul className="flex flex-wrap gap-6 text-green-900 font-semibold text-lg">
              <li className="flex items-center gap-1">
                <FaBed /> {listing.bedrooms} Bedrooms
              </li>
              <li className="flex items-center gap-1">
                <FaBath /> {listing.bathrooms} Bathrooms
              </li>
              <li className="flex items-center gap-1">
                <FaParking /> {listing.parking ? "Parking Available" : "No Parking"}
              </li>
              <li className="flex items-center gap-1">
                <FaChair /> {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* PROPERTY DETAILS */}
            <div className="bg-slate-50 p-5 rounded-lg border space-y-1">
              <h3 className="text-xl font-semibold mb-2">🏠 Property Details</h3>
              <p><b>Category:</b> {listing.category}</p>
              <p><b>Area:</b> {listing.area} sqft</p>
              {listing.builtYear && <p><b>Built Year:</b> {listing.builtYear}</p>}
              <p><b>Status:</b> {listing.status}</p>
            </div>

            {/* AMENITIES */}
            {listing.amenities.length > 0 && (
              <div className="bg-slate-50 p-5 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">✨ Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((item, i) => (
                    <span
                      key={i}
                      className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* NEARBY PLACES */}
            {listing.nearbyPlaces.length > 0 && (
              <div className="bg-slate-50 p-5 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3">📌 Nearby Places</h3>
                <ul className="space-y-1">
                  {listing.nearbyPlaces.map((p, i) => (
                    <li key={i}>
                      ➤ <b>{p.place}</b> — {p.distance}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CONTACT LANDLORD */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-blue-700 text-white p-3 mt-4 rounded-lg text-lg w-full hover:bg-blue-800 transition"
              >
                Contact Landlord
              </button>
            )}

            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
