import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Mail, MapPin, Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';
import { getJobById } from '../../services/job.service';
import api from '../../services/api.js';

const JobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, APPLIED, SHORTLISTED, INTERVIEW, HIRED, REJECTED

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
            alert(error.response?.data?.message || 'Failed to update application');
        }
    };

    const filteredApplications = applications.filter(app => 
        filter === 'ALL' ? true : app.status === filter
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'APPLIED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'SHORTLISTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'INTERVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'HIRED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'HIRED': return <CheckCircle className="h-4 w-4" />;
            case 'APPLIED': return <Clock className="h-4 w-4" />;
            default: return null;
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
                <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            {/* Job Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
                <p className="text-blue-600 font-semibold mt-2">{job?.company?.name}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {job?.location}</div>
                    <div className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> {job?.employmentType?.replace('_', ' ')}</div>
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> Posted {new Date(job?.createdAt).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 flex-wrap">
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

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{app.applicant?.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <a href={`mailto:${app.applicant?.email}`} className="flex items-center text-blue-600 hover:underline">
                                            <Mail className="h-4 w-4 mr-1" /> {app.applicant?.email}
                                        </a>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(app.status)}`}>
                                    {getStatusIcon(app.status)}
                                    {app.status}
                                </span>
                            </div>

                            {app.coverLetter && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                                    <p className="text-gray-600 text-sm">{app.coverLetter}</p>
                                </div>
                            )}

                            <div className="flex gap-3 flex-wrap">
                                {app.status === 'APPLIED' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {app.status === 'SHORTLISTED' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                        >
                                            Schedule Interview
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {app.status === 'INTERVIEW' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'HIRED')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            Hire
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {app.status === 'HIRED' && (
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium cursor-not-allowed"
                                    >
                                        ✓ Hired
                                    </button>
                                )}
                                {app.status === 'REJECTED' && (
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium cursor-not-allowed"
                                    >
                                        ✕ Rejected
                                    </button>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 mt-4">
                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg">No applications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;
