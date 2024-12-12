import "./App.css";
import ServiceWorker from "./components/ServiceWorker";
import HomePage from "./components/HomePage";
import TopCategory from "./components/TopCategory";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ComplainCreation from "./components/ComplainCreation";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import History from "./components/History";
import BillDetails from "./components/BillDetails";
import Admin from "./components/Admin";

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage />
                <TopCategory />
              </>
            }
          />
          <Route
            path="/ServiceWorker"
            element={
              <ProtectedRoute roleType={"vendor"}>
                <ServiceWorker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/History"
            element={
              <ProtectedRoute roleType={"user"}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ComplainCreation"
            element={
              <ProtectedRoute roleType={"user"}>
                <ComplainCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/BillDetails"
            element={
              <ProtectedRoute roleType={["user", "vendor"]}>
                <BillDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleType={"admin"}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} exact />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer
        autoClose={1000}
        pauseOnHover={false}
        limit={1}
        hideProgressBar={false}
        closeButton={false}
        position="top-center"
      />
    </>
  );
}

export default App;

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </a>
    </div>
  );
}

const getAuthDetails = () => {
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("userRole");
  return { token, role };
};

const ProtectedRoute = ({ children, roleType }) => {
  const { token, role } = getAuthDetails();

  if (!token) {
    toast.error("You need to login first");
    return <Navigate to="/" replace />;
  }

  if (Array.isArray(roleType)) {
    if (!roleType.includes(role)) {
      toast.error("Access denied");
      return <Navigate to="/" replace />;
    }
  } else if (role !== roleType) {
    toast.error("Access denied");
    return <Navigate to="/" replace />;
  }

  return children;
};

