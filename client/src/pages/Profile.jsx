import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  signOutUserStart,
} from "../redux/user/userSlice";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { API_BASE } from "../../config";
import toast, { Toaster } from "react-hot-toast";

// ==================== HELPER FUNCTIONS ====================

// Get authentication token from multiple sources
const getAuthToken = () => {
  // 1. Check Redux persist state
  try {
    const state = JSON.parse(localStorage.getItem("persist:root") || "{}");
    if (state?.user) {
      const userState = JSON.parse(state.user);
      if (userState.currentUser?.token) {
        return userState.currentUser.token;
      }
    }
  } catch (error) {
    console.error("Error parsing Redux state:", error);
  }

  // 2. Check localStorage
  const lsToken = localStorage.getItem("token");
  if (lsToken) return lsToken;

  // 3. Check cookies
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  return cookieToken || null;
};

// Make authenticated fetch request
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Remove credentials temporarily to avoid CORS issues
  const config = {
    ...options,
    headers,
    // credentials: 'include', // Temporarily disabled for CORS
  };

  console.log(`📡 API Call: ${url}`);

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please login again.");
    }

    return response;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
};

// Make authenticated FormData request (for file uploads)
const authFetchFormData = async (url, formData) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // No Content-Type for FormData (browser sets it automatically)
    },
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please login again.");
  }

  return response;
};

// ==================== MAIN COMPONENT ====================

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((s) => s.user);

  // State declarations
  const [activeTab, setActiveTab] = useState("profile");
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingFiles, setListingFiles] = useState([]);
  const [listingFormData, setListingFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    category: "",
    area: "",
    builtYear: "",
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    amenities: [],
    nearbyPlaces: [],
    featured: false,
    views: 0,
    status: "Available",
    type: "rent",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [selectedPreviews, setSelectedPreviews] = useState([]);

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  useEffect(() => {
    if (editingListing) {
      const fetchListing = async () => {
        try {
          const res = await fetch(
            `${API_BASE}/api/listing/get/${editingListing}`
          );
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          setListingFormData(data);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchListing();
    }
  }, [editingListing]);

  // ==================== PROFILE FUNCTIONS ====================

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authFetchFormData(
        `${API_BASE}/api/user/update/${currentUser._id}`,
        formData
      );

      const data = await res.json();

      if (data.success === false) {
        alert(data.message);
        return;
      }

      setFormData((prev) => ({ ...prev, avatar: data.avatar }));
      dispatch(updateUserSuccess(data));
      setFilePerc(100);
      alert("✅ Photo uploaded successfully!");
    } catch (error) {
      alert("Upload failed: " + error.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await authFetch(
        `${API_BASE}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      alert("Update failed: " + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      dispatch(deleteUserStart());

      const res = await authFetch(
        `${API_BASE}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

const handleSignOut = async () => {
  dispatch(signOutUserStart());

  try {
    const token = getAuthToken();

    if (token) {
      await fetch(`${API_BASE}/api/auth/signout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // ✅ SUCCESS TOAST
    toast.success("Logged out successfully 👋");

  } catch (error) {
    console.log("Signout error:", error);

    // ❌ ERROR TOAST
    toast.error("Logout failed. Please try again.");
  }

  dispatch(deleteUserSuccess());

  setTimeout(() => {
    navigate("/");
  }, 1000);
};


  // ==================== LISTING FUNCTIONS ====================

  const handleListingDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete your List Item?"))
      return;

    try {
      const res = await authFetch(
        `${API_BASE}/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        alert("Delete failed: " + data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      alert("✅ Listing deleted successfully!");
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await authFetch(
        `${API_BASE}/api/user/listings/${currentUser._id}`
      );
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        alert("Error: " + data.message);
        return;
      }

      setUserListings(data);
    } catch (error) {
      console.error("❌ Listings fetch error:", error);
      setShowListingsError(true);
      alert("Failed to load listings: " + error.message);
    }
  };

  const handleImageSubmit = async () => {
    if (
      listingFiles.length > 0 &&
      listingFiles.length + listingFormData.imageUrls.length < 7
    ) {
      setUploading(true);
      setImageUploadError(false);

      try {
        const formData = new FormData();
        for (let i = 0; i < listingFiles.length; i++) {
          formData.append("images", listingFiles[i]);
        }

        const res = await authFetchFormData(
          `${API_BASE}/api/listing/upload-images`,
          formData
        );

        const data = await res.json();

        if (data.success === false) {
          throw new Error(data.message || "Image upload failed");
        }

        const urls = data.imageUrls || [];
        setListingFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        setImageUploadError(false);
      } catch (error) {
        console.error("❌ Image upload error:", error);
        setImageUploadError(error.message);
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setListingFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleListingChange = (e) => {
    const { id, type, value, checked, name } = e.target;

    if (name === "type" && (value === "sale" || value === "rent")) {
      setListingFormData((prev) => ({ ...prev, type: value }));
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setListingFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (
      type === "number" ||
      type === "text" ||
      type === "textarea" ||
      type === "select-one" ||
      e.target.tagName === "SELECT"
    ) {
      setListingFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (listingFormData.imageUrls.length < 1) {
        return setListingError("You must upload at least one image");
      }
      if (+listingFormData.regularPrice < +listingFormData.discountPrice) {
        return setListingError(
          "Discount price must be lower than regular price"
        );
      }

      setListingLoading(true);
      setListingError(false);

      const url = editingListing
        ? `${API_BASE}/api/listing/update/${editingListing}`
        : `${API_BASE}/api/listing/create`;

      const method = "POST"; // Both create and update use POST

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({
          ...listingFormData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setListingLoading(false);

      if (data.success === false) {
        setListingError(data.message);
        alert("Error: " + data.message);
      } else {
        if (editingListing) {
          handleShowListings();
          setEditingListing(null);
          setActiveTab("listings");
          alert("✅ Listing updated successfully!");
        } else {
          navigate(`/listing/${data._id}`);
        }
      }
    } catch (error) {
      console.error("❌ Listing submit error:", error);
      setListingError(error.message);
      setListingLoading(false);
      alert("Failed to save listing: " + error.message);
    }
  };

  const handleEditListing = (listingId) => {
    setEditingListing(listingId);
    setActiveTab("create-listing");
  };

  const handleNewListing = () => {
    setEditingListing(null);
    setListingFormData({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      category: "",
      area: "",
      builtYear: "",
      regularPrice: 0,
      discountPrice: 0,
      offer: false,
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: false,
      amenities: [],
      nearbyPlaces: [],
      featured: false,
      views: 0,
      status: "Available",
      type: "rent",
    });
    setActiveTab("create-listing");
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      setImageUploadError("You can upload maximum 6 images");
      return;
    }

    setListingFiles(files);
    setImageUploadError(false);

    // local preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);
  };

  return (
    <div className="max-w-6xl md:px-6 px-2 mx-auto py-8 flex md:flex-row flex-col gap-4">
       <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <aside className="md:w-64 bg-white shadow-lg rounded-xl p-6 h-max top-10">
        <div className="text-center mb-6">
          <img
            src={
              currentUser.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="h-20 w-20 mx-auto rounded-full border object-cover"
          />
          <h2 className="font-bold text-lg mt-2">{currentUser.username}</h2>
          <p className="text-gray-500 text-sm">{currentUser.email}</p>
        </div>

        <ul className="space-y-3">
          <li
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              activeTab === "profile"
                ? "bg-slate-800 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>

          <li
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              activeTab === "listings"
                ? "bg-slate-800 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("listings");
              handleShowListings();
            }}
          >
            My Listings
          </li>

          <li
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              activeTab === "create-listing"
                ? "bg-slate-800 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={handleNewListing}
          >
            {editingListing ? "Edit Listing" : "Create Listing"}
          </li>

          <li
            onClick={handleSignOut}
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-center"
          >
            Logout
          </li>
        </ul>
      </aside>

      <div className="flex-1 bg-white shadow-lg rounded-xl md:p-8 p-6">
        {activeTab === "profile" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="file"
                ref={fileRef}
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />

              <div
                className="relative group w-24 h-24 md:w-24 md:h-24"
                onClick={() => fileRef.current.click()}
              >
                <img
                  // onClick={() => fileRef.current.click()}
                  src={
                    formData.avatar || currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="md:h-24 md:w-24 h-24 w-24 rounded-full cursor-pointer object-cover"
                  alt="profile"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xl">📤</span>
                </div>
              </div>

              <p className="text-sm">
                {filePerc > 0 && filePerc < 100 && (
                  <span>Uploading {filePerc}%...</span>
                )}
                {filePerc === 100 && (
                  <span className="text-green-600">Uploaded successfully!</span>
                )}
              </p>

              <input
                id="username"
                type="text"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                id="email"
                type="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                id="password"
                type="password"
                placeholder="New Password"
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <div className="flex gap-4 mt-3">
                <button
                  onClick={handleDeleteUser}
                  type="button"
                  className="bg-red-600 text-white py-2 rounded-lg flex-1"
                >
                  Delete Account
                </button>

                <button
                  disabled={loading}
                  type="submit"
                  className="bg-slate-800 text-white py-2 rounded-lg flex-1"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>

              {updateSuccess && (
                <p className="text-green-600 mt-3">
                  Profile updated successfully!
                </p>
              )}
            </form>
          </>
        )}

        {activeTab === "listings" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Your Listings</h1>

            {showListingsError && (
              <p className="text-red-600">Error loading listings</p>
            )}

            <div className="space-y-4">
              {userListings.map((list) => (
                <div
                  key={list._id}
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <Link
                    to={`/listing/${list._id}`}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={list.imageUrls[0] ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png" }
                      className="h-16 w-16 object-cover rounded"
                    />
                    <p className="font-semibold text-gray-700 truncate">
                      {list.name}
                    </p>
                  </Link>

                  <div className="flex gap-2 items-end">
                    <button
                      onClick={() => handleListingDelete(list._id)}
                      className="text-red-600 text-sm"
                    >
                      <RiDeleteBin3Fill size={24} />
                    </button>

                    <button
                      onClick={() => handleEditListing(list._id)}
                      className="text-green-600 text-sm mt-1"
                    >
                      <FaEdit size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "create-listing" && (
          <div className="max-w-6xl mx-auto md:px-4">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {editingListing
                  ? "Update Property Listing"
                  : "Create New Property Listing"}
              </h1>
              <p className="text-gray-600">
                {editingListing
                  ? "Update your property details to reach more potential clients"
                  : "Fill in the details below to list your property for sale or rent"}
              </p>
            </div>

            {/* Form Progress Indicator */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      listingFormData.name && listingFormData.description
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Basic Info</span>
                </div>
                <div className="w-16 h-1 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      listingFormData.address && listingFormData.city
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Location</span>
                </div>
                <div className="w-16 h-1 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      listingFormData.regularPrice > 0
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Pricing</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleListingSubmit} className="">
              {/* Form Container with Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mx-2 md:-mx-0">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">🏠</span> Property Details
                    </h2>

                    <div className="space-y-4">
                      {/* Name Input */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="name"
                        >
                          Property Title *
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Modern 3-Bedroom Apartment with Sea View"
                          maxLength="62"
                          minLength="10"
                          required
                          onChange={handleListingChange}
                          value={listingFormData.name}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            Minimum 10 characters
                          </span>
                          <span className="text-xs text-gray-500">
                            {listingFormData.name.length}/62
                          </span>
                        </div>
                      </div>

                      {/* Description Textarea */}
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="description"
                        >
                          Description *
                        </label>
                        <textarea
                          id="description"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                          placeholder="Describe your property in detail..."
                          required
                          onChange={handleListingChange}
                          value={listingFormData.description}
                        />
                      </div>

                      {/* Category and Area */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="category"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            onChange={handleListingChange}
                            value={listingFormData.category}
                          >
                            <option value="">Select Cate..</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                          </select>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="area"
                          >
                            Area (sq ft)
                          </label>
                          <input
                            type="number"
                            id="area"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., 1200"
                            onChange={handleListingChange}
                            value={listingFormData.area}
                          />
                        </div>
                      </div>

                      {/* Built Year */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="builtYear"
                          >
                            Year Built
                          </label>
                          <input
                            type="number"
                            id="builtYear"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., 2020"
                            min="1900"
                            max={new Date().getFullYear()}
                            onChange={handleListingChange}
                            value={listingFormData.builtYear}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="status"
                          >
                            Status
                          </label>
                          <select
                            id="status"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            onChange={handleListingChange}
                            value={listingFormData.status}
                          >
                            <option value="">Select Status</option>
                            <option value="Rechable">Rechable</option>
                            <option value="Unrechable">Unrechable</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Type & Features */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">✨</span> Property Type & Features
                    </h2>

                    <div className="space-y-4">
                      {/* Listing Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Listing Type *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="type"
                              value="rent"
                              className="hidden peer"
                              onChange={handleListingChange}
                              checked={listingFormData.type === "rent"}
                            />
                            <div className="p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all duration-200">
                              <span className="text-lg font-medium">
                                For Rent
                              </span>
                            </div>
                          </label>
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="type"
                              value="sale"
                              className="hidden peer"
                              onChange={handleListingChange}
                              checked={listingFormData.type === "sale"}
                            />
                            <div className="p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all duration-200">
                              <span className="text-lg font-medium">
                                For Sale
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Features
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              id="parking"
                              className="w-4 h-4 text-blue-600 mr-3"
                              onChange={handleListingChange}
                              checked={listingFormData.parking}
                            />
                            <span>Parking</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              id="furnished"
                              className="w-4 h-4 text-blue-600 mr-3"
                              onChange={handleListingChange}
                              checked={listingFormData.furnished}
                            />
                            <span>Furnished</span>
                          </label>
                          <label className="flex items-center ">
                            <input
                              type="checkbox"
                              id="offer"
                              className="w-4 h-4 text-blue-600 mr-3"
                              onChange={handleListingChange}
                              checked={listingFormData.offer}
                            />
                            <span>Offer</span>
                          </label>
                        </div>
                      </div>

                      {/* Bedrooms & Bathrooms */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="bedrooms"
                          >
                            Bedrooms
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="bedrooms"
                              min="1"
                              max="10"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              onChange={handleListingChange}
                              value={listingFormData.bedrooms}
                            />
                            <span className="absolute right-3 top-3 text-gray-500">
                              beds
                            </span>
                          </div>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="bathrooms"
                          >
                            Bathrooms
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="bathrooms"
                              min="1"
                              max="10"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              onChange={handleListingChange}
                              value={listingFormData.bathrooms}
                            />
                            <span className="absolute right-3 top-3 text-gray-500">
                              baths
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Location & Pricing */}
                <div className="space-y-6">
                  {/* Location Information */}
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">📍</span> Location Details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="address"
                        >
                          Full Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter complete address"
                          required
                          onChange={handleListingChange}
                          value={listingFormData.address}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="city"
                          >
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="City"
                            required
                            onChange={handleListingChange}
                            value={listingFormData.city}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="state"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="State"
                            onChange={handleListingChange}
                            value={listingFormData.state}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="country"
                          >
                            Country
                          </label>
                          <select
                            id="country"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleListingChange}
                            value={listingFormData.country}
                          >
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">💰</span> Pricing Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="regularPrice"
                        >
                          Regular Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            id="regularPrice"
                            min="50"
                            max="10000000"
                            required
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            onChange={handleListingChange}
                            value={listingFormData.regularPrice}
                          />
                          <span className="absolute right-3 top-3 text-gray-500 text-sm">
                            {listingFormData.type === "rent" ? "/month" : ""}
                          </span>
                        </div>
                      </div>

                      {listingFormData.offer && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <label
                            className="block text-sm font-medium text-yellow-700 mb-1"
                            htmlFor="discountPrice"
                          >
                            Discounted Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-yellow-600">
                              ₹
                            </span>
                            <input
                              type="number"
                              id="discountPrice"
                              min="0"
                              max="10000000"
                              required
                              className="w-full pl-8 pr-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white"
                              onChange={handleListingChange}
                              value={listingFormData.discountPrice}
                            />
                            <span className="absolute right-3 top-3 text-yellow-600 text-sm">
                              {listingFormData.type === "rent" ? "/month" : ""}
                            </span>
                          </div>
                          <p className="text-xs text-yellow-600 mt-2">
                            Special offer price will be displayed prominently to
                            users
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-pink-50 p-4 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">📸</span> Property Images
                    </h2>

                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors duration-200">
                        <div className="mb-4">
                          <span className="text-4xl">📁</span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          Drag & drop images here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload up to 6 images. First image will be cover.
                        </p>
                        {selectedPreviews.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Selected Images
                            </p>
                            <div className="space-y-3 my-4">
                              {selectedPreviews.map((src, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg"
                                >
                                  {/* Left: Image */}
                                  <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />

                                  {/* Right: Image Name */}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {listingFiles[index]?.name ||
                                        `Image ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(
                                        listingFiles[index]?.size / 1024
                                      ).toFixed(1)}{" "}
                                      KB
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-4 justify-center">
                          <label htmlFor="images" className="cursor-pointer">
                            <div className="md:px-6 px-2 md:py-2 py-1 sm:text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200">
                              Browse Files
                            </div>
                            {/* <input
                              onChange={(e) => setListingFiles(e.target.files)}
                              className="hidden"
                              type="file"
                              id="images"
                              accept="image/*"
                              multiple
                            /> */}
                            <input
                              type="file"
                              id="images"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>

                          <button
                            type="button"
                            disabled={uploading || !listingFiles}
                            onClick={handleImageSubmit}
                            className={`md:px-6 px-2 md:py-2 py-1 sm:text-sm rounded-lg transition-colors duration-200 ${
                              uploading || !listingFiles
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {uploading ? (
                              <span className="flex items-center">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Uploading...
                              </span>
                            ) : (
                              "Upload Images"
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Image Upload Error */}
                      {imageUploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-600 text-sm flex items-center">
                            <span className="mr-2">⚠️</span>
                            {imageUploadError}
                          </p>
                        </div>
                      )}

                      {/* Uploaded Images Preview */}
                      {listingFormData.imageUrls.length > 0 && (
                        <div>
                          {/* Debug: Show the actual array */}
                          <div className="hidden">
                            {console.log(
                              "Image URLs:",
                              listingFormData.imageUrls
                            )}
                          </div>

                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Uploaded Images ({listingFormData.imageUrls.length}
                            /6)
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            {listingFormData.imageUrls.map((url, index) => (
                              <div
                                key={`${url}-${index}`} // Added index to key for better uniqueness
                                className="relative group rounded-lg overflow-hidden border border-gray-200"
                              >
                                {/* Debug: Check if URL is valid */}
                                {console.log("Rendering image:", url)}

                                <img
                                  src={url}
                                  alt={`Property image ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    console.error("Image failed to load:", url);
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = `
                <div class="w-full h-32 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-500">Image failed to load</span>
                </div>
              `;
                                  }}
                                  onLoad={() =>
                                    console.log(
                                      "Image loaded successfully:",
                                      url
                                    )
                                  }
                                />

                                {index === 0 && (
                                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Cover
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  {editingListing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingListing(null);
                        setActiveTab("listings");
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel Edit
                    </button>
                  )}

                  <button
                    disabled={listingLoading || uploading}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      listingLoading || uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {listingLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        {editingListing ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-2">🚀</span>
                        {editingListing ? "Update Listing" : "Publish Listing"}
                      </span>
                    )}
                  </button>
                </div>

                {/* Form Error Message */}
                {listingError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm flex items-center">
                      <span className="mr-2">⚠️</span>
                      {listingError}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
