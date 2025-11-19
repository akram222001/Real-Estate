// import { FaSearch } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';

// export default function Header() {
//   const { currentUser } = useSelector((state) => state.user);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const urlParams = new URLSearchParams(window.location.search);
//     urlParams.set('searchTerm', searchTerm);
//     const searchQuery = urlParams.toString();
//     navigate(`/search?${searchQuery}`);
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const searchTermFromUrl = urlParams.get('searchTerm');
//     if (searchTermFromUrl) {
//       setSearchTerm(searchTermFromUrl);
//     }
//   }, [location.search]);
//   return (
//     <header className='bg-slate-200 shadow-md'>
//       <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
//         <Link to='/'>
//           <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
//             <span className='text-slate-500'>Home</span>
//             <span className='text-slate-700'>Spot</span>
//           </h1>
//         </Link>
//         <form
//           onSubmit={handleSubmit}
//           className='bg-slate-100 p-3 rounded-lg flex items-center'
//         >
//           <input
//             type='text'
//             placeholder='Search...'
//             className='bg-transparent focus:outline-none w-24 sm:w-64'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button>
//             <FaSearch className='text-slate-600' />
//           </button>
//         </form>
//         <ul className='flex gap-4'>
//           <Link to='/'>
//             <li className='hidden sm:inline text-slate-700 hover:underline'>
//               Home
//             </li>
//           </Link>
//           <Link to='/about'>
//             <li className='hidden sm:inline text-slate-700 hover:underline'>
//               About
//             </li>
//           </Link>
//           <Link to='/profile'>
//             {currentUser ? (
//               <img
//                 className='rounded-full h-7 w-7 object-cover'
//                 src={currentUser.avatar}
//                 alt='profile'
//               />
//             ) : (
//               <li className=' text-slate-700 hover:underline'> Sign in</li>
//             )}
//           </Link>
//         </ul>
//       </div>
//     </header>
//   );
// }

import { FaSearch, FaUser, FaHome, FaInfoCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("searchTerm", searchTerm.trim());
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={closeMobileMenu}
            >
              <div className="flex flex-col">
                <h1 className="font-bold text-sm sm:text-xl flex">
                  <span className="text-slate-500">Home</span>
                  <span className="text-slate-700">Spot</span>
                </h1>
                <span className="text-xs text-gray-500 font-medium hidden sm:block">
                  Find Your Perfect Space
                </span>
              </div>
            </Link>

            {/* Search Bar - Hidden on mobile, visible on medium screens and up */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSubmit} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties, locations..."
                    className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                      Search
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FaHome className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/about"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FaInfoCircle className="h-4 w-4" />
                <span>About</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {currentUser ? (
                  <>
                    <img
                      className="rounded-full h-8 w-8 object-cover border-2 border-white"
                      src={currentUser.avatar}
                      alt="Profile"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-blue-100">View Profile</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FaUser className="h-4 w-4" />
                    <span className="font-semibold">Sign In</span>
                  </>
                )}
              </Link>
            </nav>

            {/* Mobile Search Icon & Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* Mobile Search Bar */}
              <div className="md:hidden flex flex-1 max-w-2xl mx-4">
                <form onSubmit={handleSubmit} className="relative w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search properties, locations..."
                      className="w-full px-4 py-1 pl-4 pr-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white text-center"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FaSearch className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <FaBars className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            ></div>

            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Menu
                    </h2>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 p-4 space-y-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
                    onClick={closeMobileMenu}
                  >
                    <FaHome className="h-5 w-5" />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/about"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
                    onClick={closeMobileMenu}
                  >
                    <FaInfoCircle className="h-5 w-5" />
                    <span>About</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium mt-8"
                    onClick={closeMobileMenu}
                  >
                    <FaUser className="h-5 w-5" />
                    <span>{currentUser ? "My Profile" : "Sign In"}</span>
                  </Link>

                  {currentUser && (
                    <div className="p-3 border-t border-gray-200 mt-4">
                      <div className="flex items-center space-x-3">
                        <img
                          className="rounded-full h-10 w-10 object-cover"
                          src={currentUser.avatar}
                          alt="Profile"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
