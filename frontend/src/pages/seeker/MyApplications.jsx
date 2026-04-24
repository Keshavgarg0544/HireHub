import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Briefcase, Clock, Loader2, ChevronRight, AlertCircle, IndianRupee, CheckCircle, Clock as ClockIcon, AlertCircle as AlertIcon } from 'lucide-react';
import { getMyApplications } from '../../services/application.service';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getMyApplications();
                console.log('Applications:', response.data);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'SHORTLISTED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'INTERVIEW': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'HIRED': return 'bg-green-50 text-green-700 border-green-100';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'HIRED': return <CheckCircle className="h-4 w-4" />;
            case 'INTERVIEW': return <ClockIcon className="h-4 w-4" />;
            case 'SHORTLISTED': return <AlertIcon className="h-4 w-4" />;
            default: return null;
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case 'APPLIED': return 'You applied for this job';
            case 'SHORTLISTED': return 'Congratulations! You are shortlisted';
            case 'INTERVIEW': return 'Interview scheduled - Check your email';
            case 'HIRED': return 'Congratulations! You are hired!';
            case 'REJECTED': return 'Application rejected';
            default: return status;
        }
    };

    const filteredApplications = applications.filter(app => 
        filter === 'ALL' ? true : app.status === filter
    );

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 text-left">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-500 mt-1">Track the status of your job applications and interview progress.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> {error}
                </div>
            )}

            {applications.length > 0 && (
                <div className="flex gap-2 mb-6 flex-wrap">
                    {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                filter === status 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status}
                            {status !== 'ALL' && ` (${applications.filter(a => a.status === status).length})`}
                        </button>
                    ))}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                        <FileText className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 max-w-xs mt-2">Browse jobs and start applying to find your next opportunity.</p>
                    <Link to="/" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                        Explore Jobs
                    </Link>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No applications in this status</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{app.job?.title}</h3>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                                            {getStatusIcon(app.status)}
                                            {app.status}
                                        </span>
                                    </div>
                                    
                                    <p className="text-blue-600 font-semibold text-lg mb-2">{app.job?.company?.name}</p>
                                    
                                    <p className="text-gray-600 mb-3 font-medium text-sm">{getStatusDescription(app.status)}</p>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1.5" /> {app.job?.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 mr-1.5" /> {app.job?.employmentType?.replace('_', ' ')}
                                        </div>
                                        <div className="flex items-center">
                                            <IndianRupee className="h-4 w-4 mr-1.5" /> ₹{app.job?.salary?.min} - ₹{app.job?.salary?.max}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1.5" /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <Link 
                                    to={`/jobs/${app.job?.id}`}
                                    className="flex items-center justify-center text-blue-600 font-bold hover:text-blue-700 px-6 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all whitespace-nowrap"
                                >
                                    View Job <ChevronRight className="h-5 w-5 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
