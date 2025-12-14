export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:py-10 py-6">
        {/* Header */}
        <div className="text-center md:mb-10 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
            About <span className="text-blue-600">HomeSpot</span>
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            A modern real-estate platform designed to simplify your property
            search experience.
          </p>
        </div>

        {/* Main Content */}
        <div className="md:space-y-10 space-y-4">
          {/* Intro */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              <span className="font-semibold">HomeSpot</span> is a modern real
              estate platform designed to make finding your perfect home simple,
              fast, and stress-free. Whether you are looking to buy, rent, or
              explore exclusive property deals, HomeSpot brings all the best
              listings to one place — verified, updated, and designed for easy
              browsing.
            </p>

            <p className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              Our platform offers a wide range of property options including
              premium homes, rental apartments, best home offers, and properties
              with amenities like private parking. We focus on delivering a
              seamless user experience that helps you make confident real-estate
              decisions.
            </p>
          </div>

          {/* Why HomeSpot */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">
              Why HomeSpot?
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 text-base sm:text-lg">
              <li>✔ Easy search for buying & renting homes</li>
              <li>✔ Verified property listings with real photos</li>
              <li>✔ Exclusive offers & best deals</li>
              <li>✔ Parking-friendly homes & modern amenities</li>
              <li>✔ Clean and user-friendly interface</li>
              <li>✔ Fast, secure & mobile-responsive platform</li>
            </ul>
          </div>

          {/* Developer Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              Developed by Akram
            </h2>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              My name is <span className="font-semibold">Akram</span>, and I built
              HomeSpot with the vision of making real-estate searching easier for
              everyone. Using modern web technologies, I crafted this platform
              to be fast, clean, and user-friendly — ensuring a smooth property
              search experience from start to finish.
            </p>

            <p className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              Thank you for choosing{" "}
              <span className="font-semibold">HomeSpot</span>. Your perfect home
              is just a few clicks away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
