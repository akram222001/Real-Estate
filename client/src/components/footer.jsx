import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiInformatica } from "react-icons/si";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Footer({ footerData = [] }) {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Logo + Tagline */}
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <h2 className="font-bold text-2xl">
              <span className="text-white">Home</span>
              <span className="text-blue-400">Spot</span>
            </h2>
          </Link>
          <p className="text-sm text-gray-400 mt-3 leading-6">
            Find your dream property with ease. HomeSpot brings you verified and
            trusted real-estate listings across India.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-5 mt-5">
            <a
              href="https://akram222001.github.io/ak-website/"
              className="hover:text-blue-400 text-xl"
            >
              <SiInformatica />
            </a>
            <a
              href="https://www.instagram.com/er_akramansari"
              className="hover:text-pink-400 text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/akram_ansarii"
              className="hover:text-blue-300 text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/akram-ansari-4a3462217/"
              className="hover:text-blue-500 text-xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-blue-400 transition">
                Search Properties
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Popular Categories */}
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Popular Categories
          </h3>
          <ul className="space-y-3 text-gray-300">
            {footerData?.map((cat, index) => (
              <li key={index}>
                <Link to={cat.link} className="hover:text-blue-400 transition">
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
         <div className="flex flex-row justify-between md:hidden lg:hidden">
          {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-blue-400 transition">
                Search Properties
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Popular Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Popular Categories
          </h3>
          <ul className="space-y-3 text-gray-300">
            {footerData?.map((cat, index) => (
              <li key={index}>
                <Link to={cat.link} className="hover:text-blue-400 transition">
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-400 mt-1" />
              <span>HomeSpot Headquarters, Madhubani, Bihar, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-400" />
              <span>+91 966139....</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-400" />
              <span>support@homespot.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-400 font-semibold">HomeSpot</span> — All
        Rights Reserved.
      </div>
    </footer>
  );
}
Footer.propTypes = {
  footerData: PropTypes.array,
};
