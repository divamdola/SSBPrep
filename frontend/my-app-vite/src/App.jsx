import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor } from "./store";
import MainLayout from "./components/layouts/MainLayouts.jsx";
import Home from "./components/home.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Exams from "./components/exams.jsx";
import Timeline from "./components/timeline.jsx";
import StudyMaterial from "./components/studyMaterial.jsx";
import About from "./components/about.jsx";
import ToppersHall from "./components/toppershall.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import NewPassword from "./components/newPassword.jsx";
import Test from "./components/test.jsx";

import { loadUser } from "./actions/userActions";
import MockList from "./components/mockList.jsx";
import Result from "./components/result.jsx";
import UserProfile from "./components/userProfile.jsx";

import AdminPanel from "./components/admin/adminPanel.jsx";
import UserDetails from "./components/admin/userDetails.jsx";
import EditBooks from "./components/admin/editBooks.jsx";
import EditExams from "./components/admin/editExams.jsx";
import ViewReports from "./components/admin/viewReports.jsx";

import './App.css'

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleBeforeLift = () => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(loadUser());
    }
  };

  return (
    <PersistGate loading={<h1>Loading...</h1>} persistor={persistor} onBeforeLift={handleBeforeLift}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          {/* Protected Routes */}
          <Route
            path="/timeline"
            element={user ? <Timeline /> : <Navigate to="/login" />}
          />
          <Route
            path="/:exam/:mockTest/test/:id"
            element={user ? <Test /> : <Navigate to="/login" />}
          />
          <Route
            path="/:exam"
            element={user ? <MainLayout><Exams /></MainLayout> : <Navigate to="/login" />}
          />
           <Route
            path="/:exam/:mockTest"
            element={user ? <MainLayout><MockList /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/:exam/:mockTest/test/result/:id"
            element={user ? <Result /> : <Navigate to="/login" />}
          />
           <Route
            path="/study-material"
            element={user ? <MainLayout><StudyMaterial /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/me"
            element={user ? <MainLayout><UserProfile /></MainLayout> : <Navigate to="/login" />}
          />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/hall-of-achiver" element={<MainLayout><ToppersHall /></MainLayout>} />

          {/* Admin Routes */}
          <Route
            path="/admin-panel"
            element={user && user.role === "admin" ? <MainLayout><AdminPanel /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-panel/users"
            element={user && user.role === "admin" ? <MainLayout><UserDetails /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-panel/books"
            element={user && user.role === "admin" ? <MainLayout><EditBooks /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-panel/exams"
            element={user && user.role === "admin" ? <MainLayout><EditExams /></MainLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-panel/reports"
            element={user && user.role === "admin" ? <MainLayout><ViewReports /></MainLayout> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  );
}

export default App;
