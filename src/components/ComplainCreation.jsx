import React, { useContext, useState, useEffect } from "react";
import '../styles/ComplainCreation.css';
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ComplainForm = () => {
  const { id } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    photo: null,
    fieldType: "electrician",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id: id
    }))
  }, [id])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
      const form = new FormData();


      form.append("photo", formData.photo);
      form.append("id", formData.id);
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("description", formData.description);
      form.append("fieldType", formData.fieldType);
      form.append("lat",localStorage.getItem("lat"));
      form.append("lon",localStorage.getItem("lon"))

      console.log(form)
    
    try {
      const response = await fetch("http://localhost:5000/api/complain", {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" },
        body: form,
      });
      if (response.ok) {
        console.log(form);
        console.log("Complain submitted successfully");
        setFormData({
          id: id,
          name: "",
          phone: "",
          address: "",
          description: "",
          photo: null,
          fieldType: "electrician",
        });
        setImagePreview(null);
        toast.success("Complain submitted successfully");
      } else {
        toast.error("Failed to submit complain");
      }
    } catch (error) {
      console.error("Error submitting complain:", error);
    }
  };


  return (
    <div>
      <div className="complain">
        <div className="complain_area">
          <form className="complain_box" onSubmit={handleSubmit}>
            <div className="complain_photo">
              <h2>Photo</h2>
              <input
                type="file"
                name="photo"
                accept="image/*"
                id="photoInput"
                onChange={handleFileChange}
              />
            </div>

            <div className="complain_own_detail">
              <div className="complain_name">
                <h2>Name:</h2>
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="complain_phone">
                <h2>Phone Number:</h2>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="Enter your Contact Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="complain_address">
              <h2>Address:</h2>
              <input
                type="text"
                placeholder="Enter your address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="complain_description">
              <h2>Description:</h2>
              <textarea
                placeholder="Enter your problem description"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="complain_field_type">
              <h2>Field Type:</h2>
              <select
                name="fieldType"
                value={formData.fieldType}
                onChange={handleInputChange}
              >
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter</option>
                <option value="painter">Painter</option>
              </select>
            </div>

            <div className="complain_sendbutton">
              <button type="submit">Send</button>
            </div>
          </form>
        </div>

        <div className="complain_content">
          <div className="complain_rightup">
            <div className="complain_pic">
              {imagePreview && (
                <img src={imagePreview} alt="Selected preview" />
              )}
            </div>
          </div>

          <div className="complain_rightdown">
            <div className="complain_benfits">
              <h1>FixMate Promise</h1>
              <ul>
                <li>Verified Professionals</li>
                <li>Separate Charges Apply for Each Service Component</li>
                <li>No Hidden Costs – Clear Pricing for Every Service</li>
                <li>Commitment to Quality and Customer Satisfaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainForm;
