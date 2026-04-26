import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VfxBackground from './components/VfxBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AppShell from './pages/AppShell';
import Docs from './pages/Docs';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/session');
                const data = await res.json();
                setIsAuthenticated(data.authenticated);
            } catch (e) {
                console.error("Auth check failed:", e);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) return null;

    return (
        <Router>
            <VfxBackground />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/docs" element={<Docs />} />
                {/* Legacy support for .html extension mentioned by user */}
                <Route path="/docs.html" element={<Navigate to="/docs" replace />} />
                <Route 
                    path="/app" 
                    element={
                        (isAuthenticated || new URLSearchParams(window.location.search).get('mode') === 'local') 
                            ? <AppShell /> 
                            : <Navigate to="/login" />
                    } 
                />
                {/* Support for direct local bridge access via query params */}
                <Route path="/bridge" element={<AppShell mode="local" />} />
                {/* Catch-all for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};


export default App;
