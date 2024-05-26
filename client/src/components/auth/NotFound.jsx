import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-blue-600">404</h1>
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mt-2">
        Oops! Page not found.
      </p>
      <p className="mt-2 text-xs md:text-xl text-gray-500">
        We can't seem to find the page you're looking for.
      </p>
      <Link
        to="/home"
        className="mt-6 text-blue-600 text-xs sm:text-sm md:text-base hover:underline"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;