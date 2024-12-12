import { FaRegUser } from "react-icons/fa";
import { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaHeadset } from "react-icons/fa"; 
import '/src/styles/Navbar.css';
import emailjs from 'emailjs-com';
import questions from '../data/query';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [verfiyModalOpen, setVerfiyModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  


  const toggleSupportModal = () => {
    setIsSupportModalOpen(!isSupportModalOpen);
    setSearchQuery(""); 
    setFilteredQuestions([]);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

  
    const filtered = questions.filter(q =>
      q.question.toLowerCase().includes(query)
    );
    setFilteredQuestions(filtered);
  };

  const handleQuestionClick = (answer) => {

    toast.error(answer,{autoClose:5000});
    setIsSupportModalOpen(false); 
  };

  const handleSendQuery = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a query before sending.');
      return;
    }
    if (!isLoggedIn) {
      toast.error("You need to be logged in to send a query!");
      return;
    }
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;

    }

    const templateParams = {
      from_email: email, 
      message: searchQuery,
    };
    
    // emailjs.send('service_h6ncw2r', 'template_cjebj34', templateParams, '83LfTWpqVM10PMLvl')
    emailjs.send('service_5ppnex4', 'template_934qho3', templateParams, 'WLAcpHtLHPUJQks9C')
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            toast.success("Your query has been sent to the admin!");
            setUserQuery("");
            setIsSupportModalOpen(false)
        })
        .catch((err) => {
            console.error('FAILED...', err);
            toast.error("Failed to send your query. Please try again.");
        }); 
  };




  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("Select Location");
  const [error, setError] = useState(null);

  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [fieldsOfExpertise, setFieldsOfExpertise] = useState("electrician");

  const { handleLogin, handleLogout } = useContext(AuthContext);
  const [Vendor, setVendor] = useState(false); 
  const [isVen, setIsVen] = useState(false); 
  const path = useLocation();
  const [active, setActive] = useState(path.pathname);
  const [isAdmin, setIsAdmin] = useState(false);
  const [OTP,setOTP] = useState();
  
  useEffect(() => {
    setActive(path.pathname);
  }, [path.pathname]);

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    localStorage.setItem("lat", lat);
    localStorage.setItem("lon", lon);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setLocation(data.name);
      toast.success("Loaction updated");
      console.log(data);
    } catch (err) {
      setError("Unable to retrieve address.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      // Validate token
      fetch("http://localhost:5000/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Invalid token");
          }
        })
        .then((data) => {
          setIsLoggedIn(true);
          setUserName(data.name);
          setVendor(data.isVendor);
          setIsAdmin(data.isAdmin);

          if (token && role) {
            if (role === "vendor") {
              navigate("/ServiceWorker", { replace: true });
            } else if (role === "admin") {
              navigate("/admin", { replace: true });
            }
          }
      
        })
        .catch(() => {
          localStorage.removeItem("jwtToken");
        });
    }
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      setUserName("");
      handleLogout();
    } else {
      setIsSignInModalOpen(true);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setIsSignUpModalOpen(false);
        const { token, name, isVendor, id, fieldsOfExpertise, isAdmin: admin } = await response.json();
        localStorage.setItem("jwtToken", token);
        handleLogin(token, name, id,isVendor,fieldsOfExpertise);
        setVendor(isVendor);
        setUserName(name);
        setIsLoggedIn(true);
        setIsSignInModalOpen(false);
        setIsDropdownOpen(false);
        setIsAdmin(admin);

        let userRole = "user";
        if (admin) {
          userRole = "admin";
        } else if (isVendor) {
          userRole = "vendor";
        }
        localStorage.setItem("userRole", userRole);

        if (token && userRole) {
          if (userRole === "vendor") {
            navigate("/ServiceWorker", { replace: true });
          } else if (userRole === "admin") {
            navigate("/admin", { replace: true });
          }
        }

        toast.success("Logged in successfully");
      } else {
        const error = await response.json();
        toast.error(error.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignUp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      
      toast.error("Passwords do not match");
      return;
    }

    const vendorData = isVen ? { yearsOfExperience, fieldsOfExpertise } : {};

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          isVendor:isVen,
          ...vendorData,
        }),
      });
      if (response.ok) {
        toast.success("Please verify");
        setIsSignUpModalOpen(false);
        setVerfiyModalOpen(true);
      } else {
        toast.error("Account not verified");
        setVerfiyModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerify = async()=>{
    if(!OTP || OTP<=0) toast.error("OTP is invalid");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          OTP
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if(data.success){
          setVerfiyModalOpen(false);
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
          toast.success(data.message);
        }else toast.error(data.message);
      } else {
        toast.error("Account not verified");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const toggleVendorCheckbox = () => {
    setIsVen(!isVen);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const handleProtectedLink = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please sign in!");
    }
  };

  
  return (
    
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">FM</div>
        <span className="logo-text">FixMe</span>
      </Link>

      {/* Links */}
      <div className="navbar-links">
        {!Vendor && !isAdmin && <Link
          to="/"
          className={`${
            active == "/" ? "text-black" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Home
        </Link>}
        {!isAdmin && (Vendor && isLoggedIn ? (
          <Link
            to="/ServiceWorker"
            className={`${
              active == "/ServiceWorker"
                ? "text-black"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Services
          </Link>
        ) : (
          <>
            <Link
              to="/History"
              className={`${
                active == "/History"
                  ? "text-black"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={handleProtectedLink}
            >
              History
            </Link>
            <Link
              to="/ComplainCreation"
              className={`${
                active == "/ComplainCreation"
                  ? "text-black"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={handleProtectedLink}
            >
              Complain
            </Link>
          </>
        ))}
        {isAdmin && isLoggedIn && (
          <Link
            to="/admin"
            className={`${
              active == "/admin"
                ? "text-black"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Location and Search */}
      <div className="search">
        <div className="location" onClick={getLocation}>
          <span className="location-icon">📍</span>
          <span>{error ? error : location}</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        
      </div>

      {/* Icons */}
      <div className="navbar-icons" onClick={toggleDropdown}>
        {isLoggedIn ? (
          <span className="login-button">{userName}</span>
        ) : (
          <span className="login-button" onClick={handleLoginLogout}>
            Sign In
          </span>
        )}
        <FaRegUser  style={{ fontSize: "25px", marginLeft: "10px" }} /> 

        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', cursor: 'pointer' }}>
          <FaHeadset style={{ fontSize: "25px" }} onClick={toggleSupportModal} />
        </div>
              {/* Support Modal */}
              {isSupportModalOpen && (
                <div className="modal-overlay" onClick={toggleSupportModal}>
                    <div className="modal-content support-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Support</h2>
                        <input
                            type="text"
                            placeholder="Type your question..."
                            className="support-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="support-questions">
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((q, index) => (
                                    <div key={index} className="support-question" onClick={() => handleQuestionClick(q.answer)}>
                                        {q.question}
                                    </div>
                                ))
                            ) : (
                                <div>
                                  <button onClick={handleSendQuery} className="send-query-button">
                                      Send Query
                                  </button>
                              </div>

                            )}
                        </div>
                    </div>
                </div>
            )}
      </div>
      
      {/* Dropdown */}
      {isDropdownOpen && isLoggedIn && (
        <div className="dropdown-menu">
          {/* <a href="#" className="dropdown-item">
            Profile
          </a> */}
          <a
            href="#"
            className="dropdown-item"
            onClick={() => {
              setIsLoggedIn(false);
              setUserName("");
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("userRole");
              toast.info("Logged out successfully");
              navigate("/");
            }}
          >
            Logout
          </a>
        </div>
      )}

      {isSignInModalOpen && (
        <div className="modal-overlay" onClick={closeSignInModal}>
          <div
            className="modal-content sign-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Sign In</h2>
            <input
              type="text"
              placeholder="Enter your email"
              className="sign-in-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="sign-in-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="modal-button" onClick={openSignUpModal}>
              Sign Up
            </button>
            <button className="modal-button" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      )}

      {isSignUpModalOpen && (
        <div className="modal-overlay" onClick={closeSignUpModal}>
          <div
            className="modal-content sign-up-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Enter your full name"
              className="sign-up-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="sign-up-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="sign-up-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="sign-up-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="check_vendor">
              <input
                type="checkbox"
                id="isVendor"
                checked={isVen}
                onChange={toggleVendorCheckbox}
              />
              <label htmlFor="isVendor">Are you a Service Provider?</label>
            </div>

            {isVen && (
              <div>
                <input
                  type="number"
                  placeholder="Years of Experience"
                  className="sign-up-input"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                />
                <h4>Fields of Expertise:</h4>
                <select
                  className="sign-up-input select-expertise"
                  value={fieldsOfExpertise}
                  onChange={(e) => setFieldsOfExpertise(e.target.value)}
                >
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="painter">Painter</option>
                </select>
              </div>
            )}

            <button className="modal-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      )}

      {verfiyModalOpen && (
        <div className="modal-overlay" onClick={()=>setVerfiyModalOpen(false) }>
          <div
            className="modal-content sign-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Verify your account</h2>
            <input
              type="Number"
              placeholder="Enter your OTP"
              className="sign-in-input"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            />
            <button className="modal-button" onClick={()=>{
              setVerfiyModalOpen(false)
            }}>
              Cancel
            </button>
            <button className="modal-button" onClick={handleVerify}>
              Verify
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
