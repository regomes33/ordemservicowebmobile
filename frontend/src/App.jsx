import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ServiceOrders from './pages/ServiceOrders';
import ServiceOrderForm from './pages/ServiceOrderForm';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function PrivateRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        );
    }

    if (!user) return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <PrivateRoute>
                            <Clients />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/service-orders"
                    element={
                        <PrivateRoute>
                            <ServiceOrders />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/service-orders/new"
                    element={
                        <PrivateRoute>
                            <ServiceOrderForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/service-orders/edit/:id"
                    element={
                        <PrivateRoute>
                            <ServiceOrderForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/budgets"
                    element={
                        <PrivateRoute>
                            <Budgets />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <PrivateRoute>
                            <Reports />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;

