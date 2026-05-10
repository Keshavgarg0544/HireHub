import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ChevronLeft, Loader2, Mail, MapPin, Briefcase, 
    Calendar, CheckCircle2, Clock, Users, ArrowLeft,
    CheckCircle, AlertCircle, Zap, Star, XCircle,
    ArrowRight, MessageSquare, Download
} from 'lucide-react';
import { getJobById } from '../../services/job.service';
import api from '../../services/api.js';

const JobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobResponse = await getJobById(id);
                setJob(jobResponse.data);

                const appResponse = await api.get(`/applications/job/${id}`);
                setApplications(appResponse.data?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleStatusChange = async (applicationId, status) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status });
            setApplications(applications.map(app => 
                app.id === applicationId ? { ...app, status } : app
            ));
        } catch (error) {
            console.error('Failed to update application', error);
        }
    };

    const getStatusTheme = (status) => {
        switch(status) {
            case 'APPLIED': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
            case 'SHORTLISTED': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Star };
            case 'INTERVIEW': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: Zap };
            case 'HIRED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle };
            case 'REJECTED': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: XCircle };
            default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: Clock };
        }
    };

    const filteredApplications = applications.filter(app => 
        filter === 'ALL' ? true : app.status === filter
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="space-y-4 text-center">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Loading candidates...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            {/* Header */}
            <section className="pt-16 pb-12 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors group mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                        Back to management
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Users className="w-3 h-3" />
                                <span>ATS Dashboard</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {job?.company?.logoUrl ? (
                                    <img src={job.company.logoUrl} alt={job.company.name} className="w-12 h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-100 p-1" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-lg">
                                        {job?.company?.name?.[0] || 'C'}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-5xl font-black text-slate-900 leading-tight">{job?.title}</h1>
                                    <div className="flex items-center gap-4 text-slate-500 font-bold text-lg">
                                        <p className="text-blue-600">{job?.company?.name}</p>
                                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                        <p>{applications.length} Applicants total</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <Link to={`/jobs/${id}`} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-black shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all">
                                View Posting
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 pt-12">
                {/* Filters */}
                <div className="flex gap-2 mb-12 flex-wrap pb-4 border-b border-slate-100">
                    {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                filter === status 
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
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

                {/* Applications List */}
                <div className="space-y-6">
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map((app, i) => {
                            const theme = getStatusTheme(app.status);
                            const StatusIcon = theme.icon;
                            return (
                                <div key={app.id} className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-100/50 transition-all relative overflow-hidden">
                                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-16 h-16 ${['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'][i % 4]} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-100`}>
                                                        {app.applicant?.name[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{app.applicant?.name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <a href={`mailto:${app.applicant?.email}`} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1.5">
                                                                <Mail className="w-4 h-4" /> {app.applicant?.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${theme.bg} ${theme.border} ${theme.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                                                </div>
                                            </div>

                                            {app.coverLetter && (
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group/msg">
                                                    <MessageSquare className="absolute top-4 right-4 w-5 h-5 text-slate-200 group-hover/msg:text-blue-600 transition-colors" />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Candidate Pitch</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed italic">"{app.coverLetter}"</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 pt-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-700 transition-colors">
                                                    <Download className="w-3.5 h-3.5" /> Resume.pdf
                                                </button>
                                            </div>
                                        </div>

                                        <div className="lg:w-72 flex flex-col gap-3 justify-center">
                                            {app.status === 'APPLIED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                                    >
                                                        Shortlist Candidate
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                                        className="w-full py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                                                    >
                                                        Reject Application
                                                    </button>
                                                </>
                                            )}
                                            {app.status === 'SHORTLISTED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                                                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 hover:-translate-y-0.5 transition-all"
                                                    >
                                                        Schedule Interview
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                                        className="w-full py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {app.status === 'INTERVIEW' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'HIRED')}
                                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                                                    >
                                                        Finalize Hire
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                                        className="w-full py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {(app.status === 'HIRED' || app.status === 'REJECTED') && (
                                                <div className={`p-6 rounded-[2rem] border-2 text-center space-y-2 ${theme.bg} ${theme.border}`}>
                                                    <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${theme.bg} border-2 ${theme.border} ${theme.color}`}>
                                                        <StatusIcon className="w-6 h-6" />
                                                    </div>
                                                    <p className={`font-black uppercase tracking-widest text-[10px] ${theme.color}`}>Process Finalized</p>
                                                    <p className="font-black text-slate-900">{app.status === 'HIRED' ? 'Candidate Hired' : 'Application Rejected'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                                <Users className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900">No applicants found.</h3>
                                <p className="text-slate-500 font-medium">Try adjusting your filters or wait for more candidates to apply.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
