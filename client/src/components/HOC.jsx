import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "./Header";
import Sidebar from "./SideBar";
import { checkCookieSession } from "../services/auth.js";
import { sessionState } from "../features/auth/authSlice";

const withAuth = (Component) => {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
      let active = true;
      let toastShown = false;

      const clearSession = () => {
        localStorage.removeItem("wasLoggedIn");
        sessionStorage.removeItem("Logout");
        localStorage.removeItem("user");
      };

      const verifySession = async () => {
        try {
          const res = await checkCookieSession();
          if (res && active) {
            if (["noSession", "sessionExpired"].includes(res.customStatus) && !toastShown) {
              dispatch(sessionState(false));
              clearSession();
              navigate("/user/auth");
              toast.warning("Your session has expired. Please log in again!");
              toastShown = true;
            } else if (res.customStatus === "sessionActive") {
              dispatch(sessionState(true));
              localStorage.setItem("wasLoggedIn", true);
            }
          } else if (!res && active && !toastShown) {
            toast.warning("Unable to connect to the server!");
            toastShown = true;
          }
        } catch (error) {
          console.error("Session check failed:", error);
          if (active && !toastShown) {
            toast.error("An error occurred!");
            toastShown = true;
          }
        }
      };

      verifySession();
      return () => {
        active = false;
      };
    }, [navigate, dispatch]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    return (
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleSidebar={toggleSidebar}
          toggleMobileMenu={toggleMobileMenu}
        />
        <div
          className={`flex flex-col w-full ${
            isSidebarOpen && !isMobileMenuOpen ? "md:pl-64" : "md:pl-20"
          } transition-all duration-300 ease-in-out`}
        >
          <Header
            isSidebarOpen={isSidebarOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
          <div className="bg-slate-200 min-h-screen">
            <main className="flex-grow p-3">
              <div className="max-w-6xl mx-auto">
                <Component {...props} />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  };
};

export default withAuth;
