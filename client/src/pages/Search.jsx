import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { API_BASE } from "../../config";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${API_BASE}/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${API_BASE}/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      {/* <div className="p-5 border-b md:border-r md:min-h-screen md:w-[240px] bg-white shadow-sm"> */}
      <div
        className="p-5 border-b md:border-r md:w-[240px] bg-white shadow-sm
     md:sticky md:top-0 h-screen overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Type Filter */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-700">
              Property Type
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="all"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />
                <span>Rent & Sale</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                <span>Rent</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                />
                <span>Sale</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer Available</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-700">
              Amenities
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furnished</span>
              </label>
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-700">
              Sort By
            </h3>
            <select
              id="sort_order"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full text-sm"
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price: High → Low</option>
              <option value="regularPrice_asc">Price: Low → High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Button */}
          <button className="bg-slate-700 text-white py-2 rounded-lg uppercase hover:bg-slate-800 transition text-sm">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 bg-gray-50">
        {/* Title */}
        <div className="border-b px-5 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Listing Results
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Explore the best properties based on your search
          </p>
        </div>

        {/* Listing Grid */}
        <div className="p-4">
          {/* No listing */}
          {!loading && listings.length === 0 && (
            <div className="w-full text-center py-10">
              <p className="text-xl font-semibold text-gray-600">
                😕 No listings found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="w-full text-center py-10">
              <p className="text-lg text-gray-600 animate-pulse">
                Loading results...
              </p>
            </div>
          )}

          {/* Listings Grid */}
          {!loading && listings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More Button */}
          {showMore && !loading && (
            <div className="flex justify-center mt-10">
              <button
                onClick={onShowMoreClick}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-medium"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
