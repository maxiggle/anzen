import HomeNavbar from "../components/Home/Navbar";
import HomeFooter from "../components/Home/Footer";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-koi flex-col justify-between">
      <div>
        <header>
          <HomeNavbar />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <footer>
        <HomeFooter />
      </footer>
    </div>
  );
}
