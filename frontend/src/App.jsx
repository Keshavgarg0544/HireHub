import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import BrowseCompanies from './pages/BrowseCompanies';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/recruiter/CreateJob';
import CreateCompany from './pages/recruiter/CreateCompany';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobApplications from './pages/recruiter/JobApplications';
import Onboarding from './pages/recruiter/Onboarding';
import TeamManagement from './pages/recruiter/TeamManagement';
import CompanyProfile from './pages/CompanyProfile';
import MyApplications from './pages/seeker/MyApplications';
import Inbox from './pages/seeker/Inbox';
import Profile from './pages/seeker/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import MembershipGuard from './components/MembershipGuard';
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/layout/Navbar';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial token on mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);

    // Listen for storage changes (when token is added/removed from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setIsAuthenticated(!!e.newValue);
      }
    };

    // Listen for custom auth-change event (same tab updates)
    const handleAuthChange = (e) => {
      setIsAuthenticated(e.detail.isAuthenticated);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        {/* Landing Page - Only show if not authenticated */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/browse-jobs" element={<BrowseJobs />} />
            <Route path="/browse-companies" element={<BrowseCompanies />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company/:id" element={<CompanyProfile />} />

            {/* Recruiter Routes */}
            <Route element={<MembershipGuard />}>
              <Route path="/recruiter/create-job" element={<CreateJob />} />
              <Route path="/recruiter/edit/:id" element={<CreateJob />} />
              <Route path="/recruiter/create-company" element={<CreateCompany />} />
              <Route path="/recruiter/edit-company/:id" element={<CreateCompany />} />
              <Route path="/recruiter/onboarding" element={<Onboarding />} />
              <Route path="/recruiter/jobs" element={<ManageJobs />} />
              <Route path="/recruiter/team" element={<TeamManagement />} />
              <Route path="/recruiter/applications/:id" element={<JobApplications />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
