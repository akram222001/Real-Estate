
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

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

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((s) => s.user);

  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile states
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Listings states
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  
  // Create/Edit Listing states
  const [listingFiles, setListingFiles] = useState([]);
  const [listingFormData, setListingFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  // UPLOAD PROFILE IMAGE
  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  // LOAD LISTING DATA FOR EDITING
  useEffect(() => {
    if (editingListing) {
      const fetchListing = async () => {
        try {
          const res = await fetch(`/api/listing/get/${editingListing}`);
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

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = Date.now() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setFormData({ ...formData, avatar: url })
        );
      }
    );
  };

  // HANDLE PROFILE FORM INPUTS
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  // HANDLE PROFILE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  // DELETE ACCOUNT
  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // SIGN OUT
  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    await fetch("/api/auth/signout");
    dispatch(deleteUserSuccess());
  };

  // DELETE LISTING
  const handleListingDelete = async (listingId) => {
     if (!window.confirm("Are you sure you want to delete your List Item?"))
      return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // FETCH USER LISTINGS
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  // CREATE/EDIT LISTING FUNCTIONS
  const handleImageSubmit = () => {
    if (listingFiles.length > 0 && listingFiles.length + listingFormData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < listingFiles.length; i++) {
        promises.push(storeImage(listingFiles[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setListingFormData({
            ...listingFormData,
            imageUrls: listingFormData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setListingFormData({
      ...listingFormData,
      imageUrls: listingFormData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleListingChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setListingFormData({
        ...listingFormData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setListingFormData({
        ...listingFormData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setListingFormData({
        ...listingFormData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (listingFormData.imageUrls.length < 1)
        return setListingError('You must upload at least one image');
      if (+listingFormData.regularPrice < +listingFormData.discountPrice)
        return setListingError('Discount price must be lower than regular price');
      
      setListingLoading(true);
      setListingError(false);

      // Determine if we're creating or updating
      const url = editingListing ? `/api/listing/update/${editingListing}` : '/api/listing/create';
      const method = editingListing ? 'POST' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...listingFormData,
          userRef: currentUser._id,
        }),
      });
      
      const data = await res.json();
      setListingLoading(false);
      
      if (data.success === false) {
        setListingError(data.message);
      } else {
        // Reset form and handle success
        if (editingListing) {
          // Refresh listings if editing
          handleShowListings();
          setEditingListing(null);
          setActiveTab("listings");
        } else {
          navigate(`/listing/${data._id}`);
        }
      }
    } catch (error) {
      setListingError(error.message);
      setListingLoading(false);
    }
  };

  // HANDLE EDIT LISTING
  const handleEditListing = (listingId) => {
    setEditingListing(listingId);
    setActiveTab("create-listing");
  };

  // RESET LISTING FORM FOR NEW LISTING
  const handleNewListing = () => {
    setEditingListing(null);
    setListingFormData({
      imageUrls: [],
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    });
    setActiveTab("create-listing");
  };

  return (
    <div className="max-w-6xl px-6 mx-auto py-8 flex gap-4">
      {/* ------------------ SIDEBAR ------------------ */}
      <aside className="w-64 bg-white shadow-lg rounded-xl p-6 h-max sticky top-10">
        <div className="text-center mb-6">
          <img
            src={currentUser.avatar}
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

      {/* ------------------ CONTENT AREA ------------------ */}
      <div className="flex-1 bg-white shadow-lg rounded-xl p-8">
        {/* ---- PROFILE SECTION ---- */}
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

              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                className="h-24 w-24 rounded-full cursor-pointer object-cover"
                alt="profile"
              />

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
                {/* DELETE BUTTON - LEFT */}
                <button
                  onClick={handleDeleteUser}
                  type="button"
                  className="bg-red-600 text-white py-2 rounded-lg flex-1"
                >
                  Delete Account
                </button>

                {/* UPDATE BUTTON - RIGHT */}
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

        {/* ---- USER LISTINGS ---- */}
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
                      src={list.imageUrls[0]}
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
                      <RiDeleteBin3Fill size={24}/>
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

        {/* ---- CREATE/EDIT LISTING ---- */}
        {activeTab === "create-listing" && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {editingListing ? 'Update Listing' : 'Create a Listing'}
            </h1>
            <form onSubmit={handleListingSubmit} className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-4 flex-1'>
                <input
                  type='text'
                  placeholder='Name'
                  className='border p-3 rounded-lg'
                  id='name'
                  maxLength='62'
                  minLength='10'
                  required
                  onChange={handleListingChange}
                  value={listingFormData.name}
                />
                <textarea
                  type='text'
                  placeholder='Description'
                  className='border p-3 rounded-lg'
                  id='description'
                  required
                  onChange={handleListingChange}
                  value={listingFormData.description}
                />
                <input
                  type='text'
                  placeholder='Address'
                  className='border p-3 rounded-lg'
                  id='address'
                  required
                  onChange={handleListingChange}
                  value={listingFormData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      id='sale'
                      className='w-5'
                      onChange={handleListingChange}
                      checked={listingFormData.type === 'sale'}
                    />
                    <span>Sell</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      id='rent'
                      className='w-5'
                      onChange={handleListingChange}
                      checked={listingFormData.type === 'rent'}
                    />
                    <span>Rent</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      id='parking'
                      className='w-5'
                      onChange={handleListingChange}
                      checked={listingFormData.parking}
                    />
                    <span>Parking spot</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      id='furnished'
                      className='w-5'
                      onChange={handleListingChange}
                      checked={listingFormData.furnished}
                    />
                    <span>Furnished</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      id='offer'
                      className='w-5'
                      onChange={handleListingChange}
                      checked={listingFormData.offer}
                    />
                    <span>Offer</span>
                  </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                  <div className='flex items-center gap-2'>
                    <input
                      type='number'
                      id='bedrooms'
                      min='1'
                      max='10'
                      required
                      className='p-3 border border-gray-300 rounded-lg'
                      onChange={handleListingChange}
                      value={listingFormData.bedrooms}
                    />
                    <p>Beds</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input
                      type='number'
                      id='bathrooms'
                      min='1'
                      max='10'
                      required
                      className='p-3 border border-gray-300 rounded-lg'
                      onChange={handleListingChange}
                      value={listingFormData.bathrooms}
                    />
                    <p>Baths</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input
                      type='number'
                      id='regularPrice'
                      min='50'
                      max='10000000'
                      required
                      className='p-3 border border-gray-300 rounded-lg'
                      onChange={handleListingChange}
                      value={listingFormData.regularPrice}
                    />
                    <div className='flex flex-col items-center'>
                      <p>Regular price</p>
                      {listingFormData.type === 'rent' && (
                        <span className='text-xs'>($ / month)</span>
                      )}
                    </div>
                  </div>
                  {listingFormData.offer && (
                    <div className='flex items-center gap-2'>
                      <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='10000000'
                        required
                        className='p-3 border border-gray-300 rounded-lg'
                        onChange={handleListingChange}
                        value={listingFormData.discountPrice}
                      />
                      <div className='flex flex-col items-center'>
                        <p>Discounted price</p>
                        {listingFormData.type === 'rent' && (
                          <span className='text-xs'>($ / month)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>
                  Images:
                  <span className='font-normal text-gray-600 ml-2'>
                    The first image will be the cover (max 6)
                  </span>
                </p>
                <div className='flex gap-4'>
                  <input
                    onChange={(e) => setListingFiles(e.target.files)}
                    className='p-3 border border-gray-300 rounded w-full'
                    type='file'
                    id='images'
                    accept='image/*'
                    multiple
                  />
                  <button
                    type='button'
                    disabled={uploading}
                    onClick={handleImageSubmit}
                    className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                <p className='text-red-700 text-sm'>
                  {imageUploadError && imageUploadError}
                </p>
                {listingFormData.imageUrls.length > 0 &&
                  listingFormData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className='flex justify-between p-3 border items-center'
                    >
                      <img
                        src={url}
                        alt='listing image'
                        className='w-20 h-20 object-contain rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                <button
                  disabled={listingLoading || uploading}
                  className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                  {listingLoading ? (editingListing ? 'Updating...' : 'Creating...') : (editingListing ? 'Update listing' : 'Create listing')}
                </button>
                {listingError && <p className='text-red-700 text-sm'>{listingError}</p>}
                
                {editingListing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingListing(null);
                      setActiveTab("listings");
                    }}
                    className="p-3 bg-gray-500 text-white rounded-lg uppercase hover:opacity-95"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}