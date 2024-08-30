import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className="px-3 fixed z-[1000] w-full">
      <div
        className={` right-0 left-0 py-6 md:py-8 transition-all duration-300 ${
          scrolled ? "bg-black bg-opacity-10 backdrop-blur-md" : ""
        }`}
      >
        <div className="container mx-auto md:px-auto flex w-full justify-between items-center">
          <div className="flex flex-row gap-8 items-center">
            <div className="flex items-center">
              <a className="inline-flex w-[150px] filter contrast-200 grayscale invert px-4 rounded-[30px] overflow-hidden">
                <img
                  src="/icons/hlogo.png"
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
            <div>
              <ul className="md:flex hidden space-x-6">
                <li>
                  <a
                    href="#our-solution"
                    className="text-white tracking-widest hover:text-gray-300"
                  >
                    Our Solution
                  </a>
                </li>
                <li>
                  <a
                    href="#resources"
                    className="text-white tracking-widest hover:text-gray-300"
                  >
                    Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#partners"
                    className="text-white tracking-widest hover:text-gray-300"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#contact-us"
                    className="text-white tracking-widest hover:text-gray-300"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <button className="bg-transparent hover:bg-white rounded-[30px] hover:text-blue-500 text-white font-semibold mr-2 py-2 px-4 outline outline-white hover:outline-transparent ">
              Login
            </button>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 rounded-[30px] mr-4 md:mr-auto text-white font-bold py-2 px-4  "
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
