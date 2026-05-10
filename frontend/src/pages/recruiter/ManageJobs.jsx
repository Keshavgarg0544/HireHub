import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Plus, Briefcase, MapPin, IndianRupee, Edit, 
    Trash2, Loader2, Zap, LayoutDashboard, Search,
    ChevronRight, Users, CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import { getJobs, deleteJob } from '../../services/job.service';
import { getCurrentUser } from '../../services/auth.service';

const ManageJobs = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchMyJobs = async () => {
        setLoading(true);
        try {
            const response = await getJobs({ postedBy: user.id });
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== 'RECRUITER') {
            navigate('/');
            return;
        }
        fetchMyJobs();
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        
        setDeletingId(id);
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="space-y-4 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Accessing your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <LayoutDashboard className="w-3 h-3" />
                                <span>Recruitment Hub</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 leading-tight">Job <span className="text-blue-600">Management.</span></h1>
                            <p className="text-slate-500 font-medium text-lg max-w-xl">Monitor your active listings, track candidate progress, and hire the best talent.</p>
                        </div>
                        
                        <Link 
                            to="/recruiter/create-job" 
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" /> Post Opportunity
                        </Link>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 pt-12">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Listings</p>
                        <p className="text-4xl font-black text-slate-900 leading-none">{jobs.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Roles</p>
                        <p className="text-4xl font-black text-slate-900 leading-none">{jobs.filter(j => !j.isClosed).length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Candidates</p>
                        <p className="text-4xl font-black text-slate-900 leading-none">--</p>
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <div className="py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-8 px-12">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-xl shadow-slate-100/50">
                            <Briefcase className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">Your job board is empty.</h3>
                            <p className="text-slate-500 font-medium">Ready to grow your team? Post your first job and start attracting world-class talent.</p>
                        </div>
                        <Link to="/recruiter/create-job" className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all">
                            Create First Posting <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4 mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Listings</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</p>
                        </div>
                        
                        {jobs.map((job, i) => (
                            <div 
                                key={job.id} 
                                onClick={() => navigate(`/recruiter/applications/${job.id}`)}
                                className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-100/50 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 text-slate-50 text-8xl font-black opacity-0 group-hover:opacity-10 transition-opacity">
                                    {i + 1}
                                </div>

                                <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-4">
                                            {job.company?.logoUrl ? (
                                                <img src={job.company.logoUrl} alt={job.company.name} className="w-14 h-14 rounded-2xl object-contain bg-white shadow-xl shadow-slate-100 p-2 border border-slate-50" />
                                            ) : (
                                                <div className={`w-14 h-14 ${['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'][i % 4]} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-100`}>
                                                    {job.title[0]}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-blue-600 font-bold">{job.company?.name}</p>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-6 items-center pt-2">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                <MapPin className="w-4 h-4 text-slate-300" /> {job.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                <Briefcase className="w-4 h-4 text-slate-300" /> {job.employmentType.replace('_', ' ')}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                                                <IndianRupee className="w-4 h-4 text-slate-300" /> ₹{job.salary?.min?.toLocaleString()} - ₹{job.salary?.max?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link 
                                            to={`/recruiter/applications/${job.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-6 py-3 bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
                                        >
                                            <Users className="w-4 h-4" /> Applicants
                                        </Link>
                                        <Link 
                                            to={`/recruiter/edit/${job.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all shadow-sm"
                                            title="Edit Posting"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button 
                                            onClick={(e) => handleDelete(job.id, e)}
                                            disabled={deletingId === job.id}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
                                            title="Delete Posting"
                                        >
                                            {deletingId === job.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        </button>
                                        <div className="ml-4 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
