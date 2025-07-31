import { useEffect, useState } from "react";
import axios from "axios";
import './AddDoctor.css'
import { useNavigate } from "react-router-dom";


const AddDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    doctorName: "",
    email: "",
    deptId: "",
    address: "",
    phoneNumber: "",
    consultFee: ""
  });
  const navigate = useNavigate();
  
  const [departments,setDepartments] = useState([]);
  //Fetch Departments
  useEffect(() =>{
    axios.get("https://localhost:7144/api/Doctors/departments")
    .then((res) =>{
      setDepartments(res.data);
    })
    .catch((err)=>{
      console.log("Department fetch error:",err);
    });
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(doctorData)

    try {
      const response = await axios.post(
        "https://localhost:7144/api/Doctors/addDoctor",
        doctorData
      );

      if (response.data.doctorAdded) {
        alert("Doctor Added")
        navigate('/')
      } else {
        alert("Failed to add doctor.");
      }
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply</h2>

      <input type="text" name="doctorName" placeholder="Full Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <select name ="deptId" onChange={handleChange}required>
        <option value="">--Select Specialization--</option>
        {departments.map((d)=>(
          <option key={d.deptId} value={d.deptId}>
            {d.deptName}
          </option>
        ))}
      </select>
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <input type ="number" name="consultFee" placeholder="Enter Amount" onChange={handleChange} required/>
      <button type="submit">Submit</button>
    </form>
    
  );
};

export default AddDoctor;