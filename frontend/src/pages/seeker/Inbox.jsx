import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Clock, AlertCircle, Trash2, Loader2, Bell } from 'lucide-react';
import { getMyApplications } from '../../services/application.service';

const Inbox = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, UPDATES

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getMyApplications();
                const apps = response.data;
                
                // Create notifications from applications
                const notifs = apps
                    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                    .map(app => ({
                        id: `${app.id}-${app.status}`,
                        appId: app.id,
                        jobId: app.job?.id,
                        title: app.job?.title,
                        company: app.job?.company?.name,
                        status: app.status,
                        timestamp: new Date(app.appliedAt),
                        read: app.status === 'APPLIED', // Assume only new status updates are unread
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

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'SHORTLIST': return <AlertCircle className="h-5 w-5 text-blue-600" />;
            case 'INTERVIEW': return <Clock className="h-5 w-5 text-purple-600" />;
            case 'HIRED': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'REJECTED': return <AlertCircle className="h-5 w-5 text-red-600" />;
            default: return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    const getNotificationTitle = (type, company, title) => {
        switch (type) {
            case 'SHORTLIST': return `Congratulations! You're shortlisted at ${company}`;
            case 'INTERVIEW': return `Interview scheduled at ${company}`;
            case 'HIRED': return `You're hired! 🎉 ${company}`;
            case 'REJECTED': return `Application rejected from ${company}`;
            default: return `New update from ${company}`;
        }
    };

    const getNotificationMessage = (type) => {
        switch (type) {
            case 'SHORTLIST': return 'You passed the initial screening. The next step is an interview.';
            case 'INTERVIEW': return 'You have been selected for an interview. Check your email for details.';
            case 'HIRED': return 'Great news! You have been hired. Congratulations on the new opportunity!';
            case 'REJECTED': return 'Unfortunately, your application was not selected. Keep trying!';
            default: return 'There is an update on your application.';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'SHORTLIST': return 'bg-blue-50 border-blue-200';
            case 'INTERVIEW': return 'bg-purple-50 border-purple-200';
            case 'HIRED': return 'bg-green-50 border-green-200';
            case 'REJECTED': return 'bg-red-50 border-red-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const handleDelete = (id) => {
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
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                </div>
                <p className="text-gray-500">Updates on your job applications and interviews</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'ALL' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('UNREAD')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'UNREAD' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button
                    onClick={() => setFilter('UPDATES')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'UPDATES' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Important Updates
                </button>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-300 text-center">
                    <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No notifications</h3>
                    <p className="text-gray-500 mt-2">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-6 rounded-2xl border-2 transition-all hover:shadow-md cursor-pointer ${getNotificationColor(notif.type)} ${!notif.read ? 'border-l-4' : 'border'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="pt-1 flex-shrink-0">
                                    {getNotificationIcon(notif.type)}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {getNotificationTitle(notif.type, notif.company, notif.title)}
                                    </h3>
                                    <p className="text-gray-600 mt-2">
                                        {getNotificationMessage(notif.type)}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <p className="text-sm text-gray-500">
                                            {notif.title} • {notif.timestamp.toLocaleDateString()}
                                        </p>
                                        {notif.jobId && (
                                            <Link 
                                                to={`/jobs/${notif.jobId}`}
                                                className="text-sm text-blue-600 font-medium hover:underline"
                                            >
                                                View Job →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleDelete(notif.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;
