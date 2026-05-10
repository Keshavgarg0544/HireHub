import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Mail, CheckCircle, Clock, AlertCircle, Trash2, Loader2, 
    Bell, Zap, Star, ChevronRight, Inbox as InboxIcon,
    Filter, ArrowRight, Briefcase
} from 'lucide-react';
import { getMyApplications } from '../../services/application.service';

const Inbox = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchNotifications = async () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user?.role === 'RECRUITER') {
                setLoading(false);
                return;
            }
            
            try {
                const response = await getMyApplications();
                const apps = response.data;
                
                const notifs = apps
                    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                    .map(app => ({
                        id: `${app.id}-${app.status}`,
                        appId: app.id,
                        jobId: app.job?.id,
                        title: app.job?.title,
                        company: app.job?.company?.name,
                        logoUrl: app.job?.company?.logoUrl,
                        status: app.status,
                        timestamp: new Date(app.appliedAt),
                        read: app.status === 'APPLIED',
                        type: getNotificationType(app.status),
                    }))
                    .reverse();
                
                setNotifications(notifs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const getNotificationType = (status) => {
        switch (status) {
            case 'SHORTLISTED': return 'SHORTLIST';
            case 'INTERVIEW': return 'INTERVIEW';
            case 'HIRED': return 'HIRED';
            case 'REJECTED': return 'REJECTED';
            default: return 'UPDATE';
        }
    };

    const getTheme = (type) => {
        switch (type) {
            case 'SHORTLIST': return { icon: Star, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', shadow: 'shadow-blue-100' };
            case 'INTERVIEW': return { icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', shadow: 'shadow-purple-100' };
            case 'HIRED': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'shadow-emerald-100' };
            case 'REJECTED': return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', shadow: 'shadow-red-100' };
            default: return { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', shadow: 'shadow-slate-100' };
        }
    };

    const getTitle = (type, company) => {
        switch (type) {
            case 'SHORTLIST': return `Shortlisted by ${company}`;
            case 'INTERVIEW': return `Interview Invitation: ${company}`;
            case 'HIRED': return `Congratulations, you're hired! 🎉`;
            case 'REJECTED': return `Application Status Update`;
            default: return `Update from ${company}`;
        }
    };

    const getMessage = (type, company, jobTitle) => {
        switch (type) {
            case 'SHORTLIST': return `Great news! Your application for ${jobTitle} at ${company} has been shortlisted.`;
            case 'INTERVIEW': return `${company} would like to interview you for the ${jobTitle} position.`;
            case 'HIRED': return `You've been selected for the ${jobTitle} role at ${company}. Welcome aboard!`;
            case 'REJECTED': return `Thank you for your interest in the ${jobTitle} role at ${company}. Unfortunately, it wasn't a match.`;
            default: return `There's a new update regarding your application for ${jobTitle} at ${company}.`;
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'ALL') return true;
        if (filter === 'UNREAD') return !n.read;
        if (filter === 'UPDATES') return n.type !== 'UPDATE';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="space-y-4 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Opening inbox...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Bell className="w-3 h-3" />
                                <span>Notifications</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 leading-tight">Your <span className="text-blue-600">Inbox.</span></h1>
                            <p className="text-slate-500 font-medium text-lg max-w-md">Stay updated on your application status and interview requests.</p>
                        </div>
                        
                        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Unread</p>
                            <p className="text-3xl font-black text-blue-600 leading-none">{unreadCount}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 pt-12">
                {/* Filters */}
                <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'ALL', label: 'All Activity', count: notifications.length },
                        { id: 'UNREAD', label: 'Unread', count: unreadCount },
                        { id: 'UPDATES', label: 'Priority', count: notifications.filter(n => n.type !== 'UPDATE').length }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 ${
                                filter === btn.id 
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                        >
                            {btn.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === btn.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                                {btn.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-6">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                            <InboxIcon className="h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900">Your inbox is clear.</h3>
                            <p className="text-slate-500 font-medium">We'll notify you as soon as there's an update on your applications.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((notif) => {
                            const theme = getTheme(notif.type);
                            const Icon = theme.icon;
                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => notif.jobId && navigate(`/jobs/${notif.jobId}`)}
                                    className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-6 items-start ${notif.read ? 'bg-white border-slate-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-slate-100' : 'bg-white border-blue-100 shadow-xl shadow-blue-50/50'}`}
                                >
                                    <div className={`w-14 h-14 ${theme.bg} ${theme.border} border-2 rounded-2xl flex items-center justify-center ${theme.color} flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden bg-white`}>
                                        {notif.logoUrl ? (
                                            <img src={notif.logoUrl} alt={notif.company} className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <h3 className={`text-xl font-black ${notif.read ? 'text-slate-900' : 'text-blue-600'}`}>
                                                {getTitle(notif.type, notif.company)}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                {notif.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                                            {getMessage(notif.type, notif.company, notif.title)}
                                        </p>
                                        
                                        <div className="pt-4 flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Briefcase className="w-3 h-3" />
                                                {notif.title}
                                            </div>
                                            {notif.jobId && (
                                                <div className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    View Details <ArrowRight className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(notif.id, e)}
                                        className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
