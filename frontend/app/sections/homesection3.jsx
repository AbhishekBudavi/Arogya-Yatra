import AllInformation from "../sections/allInformation";
export default function Section3(){
    return(
        <>
        <section>
                <div className=" my-0 py-8 md:py-10 min-h-[300px] md:min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 px-4 sm:px-6 lg:px-8">
                  <header className="container mx-auto px-0 sm:px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16">
                        <img
                          loading="lazy"
                          decoding="async"
                          width="48"
                          height="51"
                          src="https://health-e.in/wp-content/uploads/2022/10/layer1.svg"
                          className="attachment-full size-full wp-image-186"
                          alt=""
                          sizes="100vw"
                        />
                      </div>
                    </div>
                  </header>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:px-20 leading-tight text-gray-700 mb-6 md:mb-8">
                      All Your Health Information in One Place, Accessible Anywhere,
                      Anytime
                    </h1>
                  </div>
                  <div className="text-gray-800 font-dmsans font-medium text-base sm:text-xl text-center mx-auto max-w-3xl">
                    <p>
                      No more carrying bulky medical records for doctor’s appointments!
                      Empower your caregiver with your entire medical history from a
                      single platform and get the best possible care in a timely manner.
                    </p>
                  </div>
                  <div className="md:py-14 py-10">
        
                  
                  <AllInformation />
                  </div>
                </div>
              </section>
        </>
    )
}