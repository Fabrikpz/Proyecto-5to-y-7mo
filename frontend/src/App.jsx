import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EquipmentList from './pages/EquipmentList'
import LoanRequests from './pages/LoanRequests'
import Users from './pages/Users'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={["admin", "teacher", "student"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/equipments"
        element={
          <PrivateRoute roles={["admin", "teacher", "student"]}>
            <Layout>
              <EquipmentList />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/loans"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <LoanRequests />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
