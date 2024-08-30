export default function Footer() {
  return (
    <div className="bg-indigo-950 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">© 2023 Your Company. All rights reserved.</p>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
