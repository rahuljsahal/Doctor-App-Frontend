import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Consult.css';
import { useNavigate } from 'react-router-dom';

const Consult = () => {
    // --- State for Form Inputs ---
    const [patientAadhar, setPatientAadhar] = useState('');
    const [patientName, setPatientName] = useState('');
    const [consultationDate, setConsultationDate] = useState('');

    // --- State for Dropdowns & Search ---
    const [allDepartments, setAllDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [searchDepartmentQuery, setSearchDepartmentQuery] = useState('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(''); // Stores GUID (or string ID) of selected dept
    const [selectedDepartmentName, setSelectedDepartmentName] = useState(''); // Stores Name of selected dept for DTO

    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Doctors filtered by selected department
    const [selectedDoctorId, setSelectedDoctorId] = useState(''); // Stores GUID (or string ID) of selected doctor
    const [selectedDoctorName, setSelectedDoctorName] = useState(''); 
    const navigate = useNavigate();

    // --- State for Consultation Fee & Summary ---
    const [consultationFee, setConsultationFee] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('https://localhost:7144/api/Consult/department')
            .then(res => {
                setAllDepartments(res.data);
                setFilteredDepartments(res.data);
            })
            .catch(err => console.error("Error fetching departments:", err));
    }, []);

    // --- 2. Fetch all Doctors on Mount ---
    useEffect(() => {
        axios.get('https://localhost:7144/api/Consult/doctors')
            .then(res => {
                console.log("Fetched ALL doctors data:", res.data); // Log to verify fee is present
                setAllDoctors(res.data);
            })
            .catch(err => console.error("Error fetching doctors:", err));
    }, []);

    // --- 3. Filter Departments based on Search Query ---
    useEffect(() => {
        const lowerCaseQuery = searchDepartmentQuery.toLowerCase();
        const results = allDepartments.filter(dept =>
            dept.deptName?.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredDepartments(results);
    }, [searchDepartmentQuery, allDepartments]);

    // --- 4. Filter Doctors based on Selected Department ---
    useEffect(() => {
        if (selectedDepartmentId) {
            const doctorsInDept = allDoctors.filter(doctor =>
                doctor.deptId === selectedDepartmentId
            );
            setFilteredDoctors(doctorsInDept);
            setSelectedDoctorId(''); // Reset doctor selection if department changes
            setSelectedDoctorName('');
            setConsultationFee(0); // Reset fee
        } else {
            setFilteredDoctors([]);
            setSelectedDoctorId('');
            setSelectedDoctorName('');
            setConsultationFee(0);
        }
    }, [selectedDepartmentId, allDoctors]);


    // --- Handlers for Input Changes ---
    const handleAadharChange = (e) => setPatientAadhar(e.target.value);
    const handleNameChange = (e) => setPatientName(e.target.value);
    const handleDateChange = (e) => setConsultationDate(e.target.value);
    const handleSearchDepartmentChange = (e) => setSearchDepartmentQuery(e.target.value);

    const handleDepartmentSelect = (e) => {
        const id = e.target.value;
        setSelectedDepartmentId(id);
        const selectedDept = allDepartments.find(d => d.deptId === id);
        setSelectedDepartmentName(selectedDept ? selectedDept.deptName : '');
    };

    const handleDoctorSelect = (e) => {
        const id = e.target.value;
        setSelectedDoctorId(id);
        const selectedDoc = allDoctors.find(d => d.doctorId === id);
        
        if (selectedDoc) {
            setSelectedDoctorName(selectedDoc.doctorName);
            console.log("Selected doctor object for fee extraction:", selectedDoc);
            setConsultationFee(selectedDoc.consultFee);
            
        } else {
            setSelectedDoctorName('');
            setConsultationFee(0);
        }
    };
    

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Basic validation
        if (!patientAadhar || !patientName || !selectedDepartmentId || !selectedDoctorId || !consultationDate || consultationFee <= 0) {
            setMessage("Please fill all required fields and select a doctor with a valid fee.");
            return;
        }

        const consultRequest = {
            Aadhar: parseInt(patientAadhar), // Convert to long
            Name: patientName,
            ConsultingDept: selectedDepartmentName, // Sending Name as per DTO
            ConsultingDoctor: selectedDoctorName,   // Sending Name as per DTO
            Date: new Date(consultationDate).toISOString(), // Convert to ISO string for backend DateTime
            ConsultFee: consultationFee // Already a number
        };
        

        console.log("Sending consultation request:", consultRequest); // For debugging

        try {
            const response = await axios.post(
                'https://localhost:7144/api/Consult/consult',
                consultRequest
                
            );
            console.log(response);

           if (response.data.isSucess) {
    const consultationId = response.data.consultationId || 'N/A'; // fallback if ID missing


    navigate('/receipt', {
        state: {
            consultationId,
            name: patientName,
            consultingDept: selectedDepartmentName,
            consultingDoctor: selectedDoctorName,
            date: consultationDate
        }
    });

    // Optional: Reset form after navigation
    setPatientAadhar('');
    setPatientName('');
    setSelectedDepartmentId('');
    setSelectedDepartmentName('');
    setSelectedDoctorId('');
    setSelectedDoctorName('');
    setConsultationDate('');
    setConsultationFee(0);
    setSearchDepartmentQuery('');
} else {
    setMessage(`Failed to register consultation: ${response.data.message}`);
}

        } catch (error) {
            console.error("Consultation registration error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error registering consultation. Please try again.');
        }
    };

    return (
        <div className="consult-container">
            <h2>Book a Consultation</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient Aadhar Number:</label>
                    <input type="number" value={patientAadhar} onChange={handleAadharChange} required />
                </div>
                <div className="form-group">
                    <label>Patient Name:</label>
                    <input type="text" value={patientName} onChange={handleNameChange} required />
                </div>

                {/* Department Search and Selection */}
                <div className="form-group">
                    <label>Search Department:</label>
                    <input
                        type="text"
                        placeholder="Type to search departments..."
                        value={searchDepartmentQuery}
                        onChange={handleSearchDepartmentChange}
                    />
                </div>
                <div className="form-group">
                    <label>Select Department:</label>
                    <select value={selectedDepartmentId} onChange={handleDepartmentSelect} required>
                        <option value="">-- Choose Department --</option>
                        {filteredDepartments.map(dept => (
                            <option key={dept.deptId} value={dept.deptId}>
                                {dept.deptName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doctor Selection (filtered by department) */}
                <div className="form-group">
                    <label>Select Doctor:</label>
                    <select value={selectedDoctorId} onChange={handleDoctorSelect} required disabled={!selectedDepartmentId}>
                        <option value="">-- Choose Doctor --</option>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                    {doctor.doctorName}
                                </option>
                            ))
                        ) : (
                            <option disabled>No doctors available for this department</option>
                        )}
                    </select>
                </div>

                {/* Consultation Date */}
                <div className="form-group">
                    <label>Consultation Date:</label>
                    <input type="date" value={consultationDate} onChange={handleDateChange} required />
                </div>

                {/* Summary */}
                <div className="consult-summary">
                    <h3>Consultation Details</h3>
                    <p>Patient: {patientName || 'N/A'}</p>
                    <p>Aadhar: {patientAadhar || 'N/A'}</p>
                    <p>Department: {selectedDepartmentName || 'N/A'}</p>
                    <p>Doctor: {selectedDoctorName || 'N/A'}</p>
                    <p>Date: {consultationDate || 'N/A'}</p>
                    <h4>Doctor Fee: Rs. {(consultationFee ?? 0).toFixed(2)}</h4>
                    <h4>Hospital Charge: Rs. 499.00</h4>
                    <h4>Total Payable: Rs. {(consultationFee + 499).toFixed(2)}</h4>
                </div>

                {message && <p className="message">{message}</p>}

                <button type="submit" disabled={!selectedDoctorId || consultationFee <= 0}>Confirm & Pay Now</button>
            </form>
        </div>
    );
};

export default Consult;