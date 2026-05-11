import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LogOut, FileText, Home, Briefcase, Building, 
    ChevronDown, Search, ListTodo, Inbox, User, 
    Bell, Zap, LayoutDashboard, Compass, Send
} from 'lucide-react';
import { logout, getCurrentUser } from '../../services/auth.service';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(getCurrentUser());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [appliedJobsCount, setAppliedJobsCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const profileMenuRef = useRef(null);
    
    // Close menu on navigation
    useEffect(() => {
        setShowProfileMenu(false);
    }, [location]);

    // Sync user data on custom event or prop change
    useEffect(() => {
        const handleUserUpdate = () => {
            setUser(getCurrentUser());
        };
        window.addEventListener('user-updated', handleUserUpdate);
        window.addEventListener('auth-change', handleUserUpdate);
        return () => {
            window.removeEventListener('user-updated', handleUserUpdate);
            window.removeEventListener('auth-change', handleUserUpdate);
        };
    }, []);

    useEffect(() => {
        setUser(getCurrentUser());
    }, [isAuthenticated]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'];
        const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
        return colors[hash % colors.length];
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    }, [user, isAuthenticated]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-3 shadow-sm border-b border-slate-100' : 'bg-white py-5 border-b border-slate-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link to={isAuthenticated ? (user?.role === 'RECRUITER' ? "/recruiter/jobs" : "/dashboard") : "/"} className="flex items-center group">
                            <div className="h-12 w-52 overflow-hidden flex items-center justify-center relative">
                                <img src="/logo.png?v=2" alt="HireHub Logo" className="h-40 w-auto max-w-none object-contain scale-[1.25]" />
                            </div>
                        </Link>

                        {/* Desktop Nav Links (Authenticated) */}
                        {isAuthenticated && (
                            <div className="hidden lg:flex items-center gap-1">
                                {user?.role === 'JOB_SEEKER' ? (
                                    <>
                                        <Link 
                                            to="/dashboard" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </div>
                                        </Link>
                                        <Link 
                                            to="/browse-jobs" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/browse-jobs') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Compass className="w-4 h-4" /> Discover Jobs
                                            </div>
                                        </Link>
                                        <Link 
                                            to="/browse-companies" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/browse-companies') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4" /> Companies
                                            </div>
                                        </Link>
                                        <Link 
                                            to="/applications" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/applications') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Send className="w-4 h-4" /> Applied <span className="ml-1 px-1.5 py-0.5 bg-white rounded-md text-[10px] shadow-sm">{appliedJobsCount}</span>
                                            </div>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            to="/recruiter/jobs" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/recruiter/jobs') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            Job Management
                                        </Link>
                                        <Link 
                                            to="/recruiter/create-company" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/recruiter/create-company') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            My Company
                                        </Link>
                                        <Link 
                                            to="/recruiter/team" 
                                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive('/recruiter/team') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            Team
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-4">
                                    Login
                                </button>
                                <button 
                                    onClick={() => navigate('/signup')} 
                                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-slate-100 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    Join HireHub
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                {/* Notifications Toggle - Placeholder */}
                                <button 
                                    onClick={() => navigate('/inbox')}
                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>

                                {user?.role === 'RECRUITER' && (
                                    <Link 
                                        to="/recruiter/create-job" 
                                        className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-blue-50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Zap className="w-4 h-4 fill-white" /> Post Job
                                    </Link>
                                )}

                                <div className="h-8 w-px bg-slate-100 mx-2"></div>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileMenuRef}>
                                    <button 
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-3 p-1 pr-3 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                                    >
                                        <div className={`w-10 h-10 ${getAvatarColor(user?.name)} rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md transition-transform group-hover:scale-95`}>
                                            {getInitials(user?.name)}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role?.split('_')[1] || 'User'}</p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-6 border-b border-slate-50">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-12 h-12 ${getAvatarColor(user?.name)} rounded-2xl flex items-center justify-center text-white font-black text-lg`}>
                                                        {getInitials(user?.name)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-black text-slate-900 truncate">{user?.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                        {user?.role === 'JOB_SEEKER' ? 'Job Seeker Profile' : 'Recruiter Dashboard'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <Link 
                                                    to="/profile"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all"
                                                >
                                                    <User className="w-5 h-5 text-slate-400" /> My Portfolio
                                                </Link>
                                                <Link 
                                                    to="/inbox"
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all"
                                                >
                                                    <Inbox className="w-5 h-5 text-slate-400" /> Messages
                                                </Link>
                                                <div className="h-px bg-slate-50 my-2 mx-4"></div>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                                                >
                                                    <LogOut className="w-5 h-5" /> Log Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
