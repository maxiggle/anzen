import meet2 from "../../assets/imgs/ai2.png";

export default function Index() {
  return (
    <>
      <section>
        <div className="relative  text-white">
          <div className="relative p-3 z-10 mx-auto md:gap-[4.375rem] flex flex-col md:flex-row items-center">
            <div className="bg-blocks relative w-full rounded-md">
              <div className="absolute inset-0 bg-gradient-to-r pt-8 rounded-md from-purple-600/10 to-indigo-600/50 backdrop-blur-md"></div>
              <div className="relative flex md:flex-row flex-col items-center gap-8 container px-8 mx-auto z-10 lg:py-20">
                <div className="md:w-1/3 hidden md:flex items-center md:py-16 md:pt-24">
                  <div className="rounded-xl md:h-[35rem] border-8 border-white">
                    <img
                      src={meet2}
                      alt="AI HR System"
                      className="w-full rounded-xl  object-cover h-full"
                    />
                  </div>
                </div>
                <div className="pr-8 md:w-2/3 px-6 md:px-auto py-32 md:py-40">
                  <h1 className="text-4xl lg:text-[6em] leading-tight mb-4">
                    <span className="font-bold">AI-Powered</span> HR &{" "}
                    <span className="font-bold">Payroll</span> Solutions
                  </h1>
                  <p className="text-xl md:text-2xl max-w-[31.25rem] mb-8">
                    Streamline your contracts and payments with cutting-edge AI
                    technology
                  </p>
                  <button
                    onClick={() => (location.href = "/type")}
                    className="bg-white text-blue-700 text-xl font-bold py-3 active:bg-amber-700 px-6 md:py-6 md:px-12 rounded-lg hover:text-white hover:bg-indigo-600 transition duration-300"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="md:py-32 py-16">
        <h3 className="md:text-6xl text-2xl font-bold text-center mb-12 bg-blocks text-transparent bg-clip-text">
          Features
        </h3>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-blocks p-8 rounded-lg transition-all duration-300">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-2xl font-bold mb-4 text-center text-white">
                AI-Powered Contracts
              </h4>
              <p className="text-center text-white">
                Generate and review contracts with the help of AI, ensuring
                accuracy and efficiency.
              </p>
            </div>
            <div className="bg-blocks p-8 rounded-lg transition-all duration-300">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h4 className="text-2xl font-bold mb-4 text-center text-white">
                Blockchain Integration
              </h4>
              <p className="text-center text-white">
                Secure your HR processes with blockchain technology for
                transparency and trust.
              </p>
            </div>
            <div className="bg-blocks p-8 rounded-lg transition-all duration-300">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <h4 className="text-2xl font-bold mb-4 text-center text-white">
                Modular System
              </h4>
              <p className="text-center text-white">
                Customize the platform to suit your organizational needs with
                our modular system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
