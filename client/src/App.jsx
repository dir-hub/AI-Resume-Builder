import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Layout from "./pages/Layout.jsx";
import { useDispatch } from "react-redux";
import api from "./configs/api.js";
import { setLoading, login } from "./app/features/authSlice.js";
import {Toaster} from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          const { data } = await api.get("/api/users/data", {
            headers: { Authorization: token },
          });
          if (data.user) {
            dispatch(login({ user: data.user, token }));
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getUserData();
  }, [dispatch]);

  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
