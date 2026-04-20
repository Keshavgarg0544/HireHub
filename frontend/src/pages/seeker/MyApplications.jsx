import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Briefcase, Clock, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { getMyApplications } from '../../services/application.service';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'REVIEWING': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-100';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 text-left">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> {error}
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
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-gray-900">{app.job?.title}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-blue-600 font-medium">{app.company?.name}</p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" /> {app.job?.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-1" /> {app.job?.employmentType?.replace('_', ' ')}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <Link 
                                to={`/jobs/${app.job?.id}`}
                                className="flex items-center text-blue-600 font-bold hover:translate-x-1 transition-transform"
                            >
                                View Job <ChevronRight className="h-5 w-5 ml-1" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
