import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FileText, MapPin, Briefcase, Clock, Loader2, ChevronRight, 
    AlertCircle, IndianRupee, CheckCircle, Star, Zap,
    Filter, LayoutDashboard, ArrowRight
} from 'lucide-react';
import { getMyApplications } from '../../services/application.service';

const MyApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getMyApplications();
                setApplications(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load your applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusTheme = (status) => {
        switch (status) {
            case 'APPLIED': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
            case 'SHORTLISTED': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Star };
            case 'INTERVIEW': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: Zap };
            case 'HIRED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle };
            case 'REJECTED': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertCircle };
            default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: Clock };
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case 'APPLIED': return 'Application received and pending review.';
            case 'SHORTLISTED': return 'Congratulations! You have been shortlisted.';
            case 'INTERVIEW': return 'Interview scheduled. Check your email for details.';
            case 'HIRED': return 'Hired! Welcome to the team.';
            case 'REJECTED': return 'Application not selected at this time.';
            default: return 'Processing your application.';
        }
    };

    const filteredApplications = applications.filter(app => 
        filter === 'ALL' ? true : app.status === filter
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="space-y-4 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Fetching applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <LayoutDashboard className="w-3 h-3" />
                            <span>My Journey</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 leading-tight">My <span className="text-blue-600">Applications.</span></h1>
                        <p className="text-slate-500 font-medium text-lg max-w-xl">Track your progress and manage your professional opportunities in one place.</p>
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 pt-12">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm text-red-600 font-black">{error}</p>
                    </div>
                )}

                {/* Filter Pills */}
                {applications.length > 0 && (
                    <div className="flex gap-2 mb-12 flex-wrap pb-4 border-b border-slate-50">
                        {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                    filter === status 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-50' 
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                }`}
                            >
                                {status}
                                {status !== 'ALL' && (
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${filter === status ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                                        {applications.filter(a => a.status === status).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-8 px-12">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-xl shadow-slate-100/50">
                            <FileText className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">No applications yet.</h3>
                            <p className="text-slate-500 font-medium">Your next big role is just one application away. Start exploring today.</p>
                        </div>
                        <Link to="/browse-jobs" className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                            Browse Opportunities <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100">
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No applications found with this status</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredApplications.map((app, i) => {
                            const theme = getStatusTheme(app.status);
                            const Icon = theme.icon;
                            return (
                                <div 
                                    key={app.id} 
                                    onClick={() => navigate(`/jobs/${app.job?.id}`)}
                                    className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-100/50 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-10 text-slate-50 text-8xl font-black opacity-0 group-hover:opacity-10 transition-opacity">
                                        {i + 1}
                                    </div>

                                    <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    {app.job?.company?.logoUrl ? (
                                                        <img src={app.job.company.logoUrl} alt={app.job.company.name} className="w-14 h-14 rounded-2xl object-contain bg-white shadow-xl shadow-slate-100 p-2 border border-slate-50" />
                                                    ) : (
                                                        <div className={`w-14 h-14 ${['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'][i % 4]} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-100`}>
                                                            {app.job?.company?.name?.[0] || 'J'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                            {app.job?.title}
                                                        </h3>
                                                        <p className="text-blue-600 font-bold text-lg">{app.job?.company?.name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-6 items-center pt-2">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                    <MapPin className="w-4 h-4 text-slate-300" /> {app.job?.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                    <Briefcase className="w-4 h-4 text-slate-300" /> {app.job?.employmentType?.replace('_', ' ')}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                                                    <IndianRupee className="w-4 h-4 text-slate-300" /> ₹{app.job?.salary?.min?.toLocaleString()} - ₹{app.job?.salary?.max?.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-slate-300" />
                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                                    Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="lg:w-80 space-y-4">
                                            <div className={`${theme.bg} ${theme.border} border-2 p-8 rounded-3xl space-y-4 relative overflow-hidden group/status`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 ${theme.bg} border-2 ${theme.border} rounded-xl flex items-center justify-center ${theme.color} group-hover/status:scale-110 transition-transform`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className={`font-black uppercase tracking-widest text-[10px] ${theme.color}`}>Status</p>
                                                        <p className="font-black text-slate-900 text-lg">{app.status}</p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 font-medium text-xs leading-relaxed">
                                                    {getStatusDescription(app.status)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                                Click to view job details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
