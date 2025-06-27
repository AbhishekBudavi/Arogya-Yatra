import Link from 'next/link'


export default function Section4(){
    return(
        <>
        <section className="my-20 py-25 min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 animate-gradient-shine">
                ArogyaYatra{" "}
              </h1>
              <h4 className="text-2xl  text-gray-600 sm:text-4xl md:text-5xl font-semibold leading-tight">
                Your Digital Health Your Access
              </h4>
              <p className="text-lg text-gray-600 max-w-lg pt-5">
                ArogyaYatra empowers your health journey through digital
                transformation. Experience seamless access, personalized care,
                and next-gen solutions all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                <Link href="/auth/register">
                <button className="px-8 py-3 bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                  Get Started
                </button>
                </Link>

                <button className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:scale-[1.03]">
                  Learn More
                </button>
              </div>

              <div className="pt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <img
                      key={item}
                      src={`https://randomuser.me/api/portraits/women/${item + 20}.jpg`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Trusted by 10,000+ customers
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-300 via-sky-400 to-blue-400 rounded-2xl opacity-30 blur-xl"></div>
                <div className="relative bg-white/20 backdrop-blur-md rounded-xl overflow-hidden border border-white/30 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Hero"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Glassmorphism Card */}
              <div className="absolute -bottom-6 -left-6 bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">+45% Efficiency</p>
                    <p className="text-xs text-gray-600">
                      Our solutions deliver
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
    )
}