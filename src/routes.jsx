import React, { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import { Dashboard } from "./components/LoginSignup";

const RouterComponent = () => {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouterComponent;
