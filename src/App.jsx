import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import Records from './Components/Records';
import Consult from './Components/Consult';
import Navbar from './Components/Navbar';
import AddHospital from './Components/AddHospital';
import AddDoctor from './Components/AddDoctor';
import UserProfile from './Components/UserProfile';
import ProtectedRoute from './utils/ProtectedRoute';
import Receipt from './Components/Receipt';

function App() {
  return (
    <Layout>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/records" element={<Records />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/add-dept" element={<AddHospital />} />
        <Route path="/addDoctor" element={<AddDoctor />} />
        <Route path="/userprofile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
