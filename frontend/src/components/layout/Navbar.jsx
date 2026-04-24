import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, FileText, Home, Briefcase, Building, ChevronDown, Search, ListTodo, Inbox } from 'lucide-react';
import { logout, getCurrentUser } from '../../services/auth.service';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600', 'bg-indigo-600', 'bg-teal-600'];
    const hash = name?.charCodeAt(0) || 0;
    return colors[hash % colors.length];
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch applied jobs count for job seekers
  useEffect(() => {
    if (user?.role === 'JOB_SEEKER' && isAuthenticated) {
      const fetchAppliedCount = async () => {
        try {
          const { getMyApplications } = await import('../../services/application.service');
          const response = await getMyApplications();
          setAppliedJobsCount(response.data?.length || 0);
        } catch (error) {
          console.error('Failed to fetch applied jobs count:', error);
        }
      };
      fetchAppliedCount();
    }
  }, [user?.id, user?.role, isAuthenticated]);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo on Left */}
          <div className="flex items-center flex-shrink-0">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-blue-600">HireHub</Link>
          </div>
          
          {/* Navigation and Profile on Right */}
          <div className="flex items-center space-x-6 text-sm font-medium">
            {!isAuthenticated ? (
              // NOT LOGGED IN - Show Sign In / Get Started
              <>
                <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Get Started
                </button>
              </>
            ) : (
              // LOGGED IN - Show navigation and profile
              <>
                <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Home className="h-5 w-5 mr-1" /> Home
                </Link>

                {user?.role === 'JOB_SEEKER' && (
                  <>
                    <button
                      onClick={() => navigate('/browse-jobs')}
                      className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-colors ${
                        location.pathname === '/browse-jobs'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <Search className="h-5 w-5" />
                      Browse All Jobs
                    </button>
                    <button
                      onClick={() => navigate('/applications')}
                      className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-colors ${
                        location.pathname === '/applications'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <ListTodo className="h-5 w-5" />
                      Applied ({appliedJobsCount})
                    </button>
                    <button
                      onClick={() => navigate('/inbox')}
                      className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-colors ${
                        location.pathname === '/inbox'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <Inbox className="h-5 w-5" />
                      Inbox
                    </button>
                  </>
                )}

                {user?.role === 'RECRUITER' && (
                  <>
                    <Link to="/recruiter/jobs" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Briefcase className="h-5 w-5 mr-1" /> Manage Jobs
                    </Link>
                    <Link to="/recruiter/create-company" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Building className="h-5 w-5 mr-1" /> Company
                    </Link>
                    <Link 
                      to="/recruiter/create-job" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Building className="h-4 w-4 mr-1" /> Post a Job
                    </Link>
                  </>
                )}

                <div className="h-8 w-px bg-gray-200"></div>

                {/* Profile Avatar */}
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`w-10 h-10 ${getAvatarColor(user?.name)} text-white rounded-full flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer`}
                    title={user?.name}
                  >
                    {getInitials(user?.name)}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="font-semibold text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-600 mt-1 truncate">{user?.email}</div>
                        <div className="text-xs text-blue-600 mt-1 capitalize font-semibold">
                          {user?.role === 'JOB_SEEKER' ? '👤 Job Seeker' : '🏢 Recruiter'}
                        </div>
                      </div>

                      <div className="py-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
