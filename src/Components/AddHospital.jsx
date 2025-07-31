import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const AddDept = () => {
    const [passcode,setPasscode] = useState('')
    const [DeptName, setDeptName] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState('')
    const [message,setMessage] = useState('')
    const navigate = useNavigate();

    const handlePassCodeCheck = () => {
        if(passcode === 'Admin@2025'){
            setIsAuthenticated(true)
            setMessage('')
        }
        else{
            setMessage('Invalid Admin Passcode')
    } 
}
const handleAddDept = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('https://localhost:7144/api/Admin/addDept',{
            DeptName: DeptName
        });
        
        setMessage(response.data.message || 'Department Added Successfully!')
        navigate('/')
    }catch (error){
        setMessage(error.response?.data?.message||'Error Adding Department')

    }
}

  return (
    <div className="formGroup">
      <h2>Add Department</h2>

      {!isAuthenticated ? (
        <>
          <input
            type="password"
            placeholder="Enter Admin Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button onClick={handlePassCodeCheck}>Verify</button>
        </>
      ) : (
        <form onSubmit={handleAddDept}>
          <input
            type="text"
            placeholder="Enter Department Name"
            value={DeptName}
            onChange={(e) => setDeptName(e.target.value)}
            required
          />
          <button type="submit">Add Department</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  )
}
export default AddDept