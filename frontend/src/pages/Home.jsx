import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Search, MapPin, Briefcase, Plus, TrendingUp, Users, 
    ChevronRight, Inbox, ListTodo, Star, CheckCircle2, 
    ArrowRight, Building2, Zap, ShieldCheck, Globe
} from 'lucide-react';
import { getJobs } from '../services/job.service';
import { getMyApplications } from '../services/application.service';
import { getCurrentUser } from '../services/auth.service';

const Home = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        employmentType: ''
    });

    const fetchJobs = useCallback(async (filterObj) => {
        try {
            const response = await getJobs(filterObj);
            setJobs(response.data);
            localStorage.setItem('cachedJobs', JSON.stringify(response.data));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAppliedJobs = useCallback(async () => {
        try {
            const response = await getMyApplications();
            setAppliedJobs(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'RECRUITER') {
            navigate('/recruiter/jobs', { replace: true });
            return;
        }

        const cached = localStorage.getItem('cachedJobs');
        if (cached) {
            try {
                setJobs(JSON.parse(cached));
            } catch (e) {
                console.error('Cache parse error:', e);
            }
        }
        
        setLoading(true);
        fetchJobs(filters);
        
        if (user?.role === 'JOB_SEEKER') {
            fetchAppliedJobs();
        }
    }, [user?.id, user?.role, navigate]); 

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setLoading(true);
            fetchJobs(filters);
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [filters, fetchJobs]);

    const stats = [
        { 
            number: appliedJobs.length.toString(), 
            label: 'My Applications', 
            icon: ListTodo, 
            color: 'text-blue-600', 
            bgColor: 'bg-blue-50' 
        },
        { 
            number: jobs.length.toString(), 
            label: 'Jobs For You', 
            icon: Briefcase, 
            color: 'text-indigo-600', 
            bgColor: 'bg-indigo-50' 
        },
        { 
            number: appliedJobs.filter(a => a.status === 'INTERVIEW').length.toString(), 
            label: 'Interviews', 
            icon: Users, 
            color: 'text-emerald-600', 
            bgColor: 'bg-emerald-50' 
        },
        { 
            number: 'New', 
            label: 'Recommendations', 
            icon: Zap, 
            color: 'text-amber-600', 
            bgColor: 'bg-amber-50' 
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
           
            <section className="pt-24 pb-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'User'}</span> 
                            </h1>
                            <p className="text-slate-500 font-medium">Here's what's happening with your job search today.</p>
                        </div>
                        
                        <div className="flex-1 max-w-xl group">
                            <div className="flex items-center gap-6 mb-6 ml-2">
                                <img src="/logo.png" alt="HireHub" className="h-20 w-auto" />
                                <div className="h-10 w-px bg-slate-200"></div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Command Center</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input 
                                    type="text"
                                    placeholder="Search jobs, companies, or roles..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none shadow-sm group-hover:shadow-md"
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                   
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.number}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        
                      
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Recommended for you
                                </h2>
                                <Link to="/browse-jobs" className="text-blue-600 font-black text-sm hover:underline">View all</Link>
                            </div>

                            <div className="grid gap-4">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
                                    ))
                                ) : jobs.length === 0 ? (
                                    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="font-bold text-slate-400">No matching jobs found</p>
                                    </div>
                                ) : (
                                    jobs.slice(0, 6).map((job) => (
                                        <div 
                                            key={job.id} 
                                            onClick={() => navigate(`/jobs/${job.id}`)}
                                            className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer group flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white border border-slate-50 shadow-sm p-2 group-hover:scale-110 transition-transform">
                                                    {job.company?.logoUrl ? (
                                                        <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200/50">
                                                            {job.company?.name?.[0] || 'J'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight mb-1">{job.title}</h3>
                                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                                                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company?.name}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:flex flex-col items-end gap-2">
                                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{job.employmentType}</span>
                                                <p className="text-slate-900 font-black text-sm">₹{(job.salary?.min/100000).toFixed(0)}L - {(job.salary?.max/100000).toFixed(0)}L</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        
                        <div className="space-y-8">
                            
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                    <ListTodo className="w-5 h-5 text-blue-600" />
                                    Active Status
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Applied', count: appliedJobs.length, color: 'bg-blue-600' },
                                        { label: 'Shortlisted', count: appliedJobs.filter(a => a.status === 'SHORTLISTED').length, color: 'bg-indigo-600' },
                                        { label: 'Interviews', count: appliedJobs.filter(a => a.status === 'INTERVIEW').length, color: 'bg-emerald-600' }
                                    ].map((status, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                                                <span className="font-bold text-slate-600 text-sm">{status.label}</span>
                                            </div>
                                            <span className="font-black text-slate-900">{status.count}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => navigate('/applications')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors">
                                    View All Applications
                                </button>
                            </div>

                        
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-2xl font-black leading-tight">Get the best <br /> roles first.</h3>
                                    <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-90">Enable push notifications to receive real-time alerts for jobs that match your skills.</p>
                                    <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">Enable Notifications</button>
                                </div>
                            </div>

                         
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                    <Star className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-900">Premium Profile</p>
                                    <p className="text-slate-400 text-xs font-bold px-4 leading-relaxed">Your profile is currently at 85% completion. Add a portfolio to reach 100%.</p>
                                </div>
                                <button onClick={() => navigate('/profile')} className="text-blue-600 font-black text-sm hover:underline">Complete Profile</button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
