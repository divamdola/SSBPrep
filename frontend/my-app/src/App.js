import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor } from "./store";
import MainLayout from "./components/layouts/MainLayouts";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";
import Exams from "./components/exams";
import Timeline from "./components/timeline";
import StudyMaterial from "./components/studyMaterial";
import About from "./components/about";
import ToppersHall from "./components/toppershall";
import ForgotPassword from "./components/forgotPassword";
import NewPassword from "./components/newPassword";
import Test from "./components/test";

import { loadUser } from "./actions/userActions";
import MockList from "./components/mockList";
import Result from "./components/result";
import UserProfile from "./components/userProfile";

import AdminPanel from "./components/admin/adminPanel";
import UserDetails from "./components/admin/userDetails";
import EditBooks from "./components/admin/editBooks";
import EditExams from "./components/admin/editExams";

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

        </Routes>
      </BrowserRouter>
    </PersistGate>
  );
}

export default App;
