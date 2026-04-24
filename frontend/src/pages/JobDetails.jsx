import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Calendar, Clock, ChevronLeft, Loader2, Edit, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getJobById, deleteJob } from '../services/job.service';
import { getCurrentUser } from '../services/auth.service';
import { applyToJob, getMyApplications } from '../services/application.service';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = getCurrentUser();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [applicationStatus, setApplicationStatus] = useState(null); // Track user's application status
    const [fetchingStatus, setFetchingStatus] = useState(false);

    const handleApply = async () => {
        setApplying(true);
        setMessage({ type: '', text: '' });
        try {
            await applyToJob(id);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            // Fetch updated status
            await fetchApplicationStatus();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to apply' });
        } finally {
            setApplying(false);
        }
    };

    const fetchApplicationStatus = async () => {
        if (user?.role !== 'JOB_SEEKER' || !id) return;
        try {
            setFetchingStatus(true);
            const response = await getMyApplications();
            const currentAppStatus = response.data.find(app => String(app.job?.id) === String(id));
            setApplicationStatus(currentAppStatus || null);
        } catch (error) {
            console.error('Failed to fetch application status:', error);
        } finally {
            setFetchingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await deleteJob(id);
            navigate('/recruiter/jobs');
        } catch (error) {
            console.error(error);
            alert(error.message || 'Failed to delete job');
        }
    };

    // Ownership & Role detection (Exhaustive Check)
    const currentUserId = user?.id || user?._id || user?.userId;
    const jobOwnerId = job?.postedBy;
    
    const isOwner = !!(jobOwnerId && currentUserId && String(jobOwnerId) === String(currentUserId));
    const isSeeker = user?.role === 'JOB_SEEKER';
    const isRecruiter = user?.role === 'RECRUITER';

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'SHORTLISTED': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'INTERVIEW': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'HIRED': return 'bg-green-50 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'HIRED': return <CheckCircle className="h-5 w-5" />;
            case 'INTERVIEW': return <AlertCircle className="h-5 w-5" />;
            case 'SHORTLISTED': return <AlertCircle className="h-5 w-5" />;
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

    // Debugging logs (Mandatory per test requirements)
    if (job && !loading) {
        console.log("Job postedBy:", job.postedBy);
        console.log("Current user ID:", user?.id);
        console.log("Is Owner:", isOwner);
    }

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobById(id);
                setJob(response.data);
            } catch (error) {
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    useEffect(() => {
        if (user?.role === 'JOB_SEEKER' && id) {
            fetchApplicationStatus();
        }
    }, [id, user?.id, user?.role]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
    );

    if (!job) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
                <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
            </button>

            {/* Main Header Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-xl text-blue-600 font-semibold mt-1">{job.company?.name}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-4 text-gray-500">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-1.5 text-gray-400" /> {job.location}
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="h-5 w-5 mr-1.5 text-gray-400" /> {job.employmentType.replace('_', ' ')}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-1.5 text-gray-400" /> {job.experienceLevel}
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons: Strictly Role-Based */}
                    <div className="flex flex-wrap gap-4 flex-col">
                        {isOwner ? (
                            <>
                                <button 
                                    onClick={() => navigate(`/recruiter/edit/${job.id}`)}
                                    className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 flex items-center"
                                >
                                    <Edit className="h-5 w-5 mr-2" /> Edit Job
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center border border-red-100"
                                >
                                    Delete Job
                                </button>
                            </>
                        ) : isSeeker ? (
                            <>
                                {/* Application Status Card */}
                                {applicationStatus && (
                                    <div className={`p-4 rounded-xl border-2 ${getStatusColor(applicationStatus.status)}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusIcon(applicationStatus.status)}
                                            <p className="font-bold text-lg">{applicationStatus.status}</p>
                                        </div>
                                        <p className="text-sm">{getStatusDescription(applicationStatus.status)}</p>
                                        <p className="text-xs mt-2 opacity-75">Applied on {new Date(applicationStatus.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                )}

                                {/* Apply Button */}
                                {!applicationStatus ? (
                                    <button 
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center disabled:bg-blue-400"
                                    >
                                        {applying ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />} 
                                        {applying ? 'Applying...' : 'Apply for this Job'}
                                    </button>
                                ) : (
                                    <button 
                                        disabled
                                        className="bg-gray-200 text-gray-600 px-8 py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center"
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" /> Already Applied
                                    </button>
                                )}
                                
                                {message.text && (
                                    <p className={`text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
                                    </p>
                                )}
                            </>
                        ) : isRecruiter ? (
                            <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-medium border border-gray-200 italic flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" /> Published by another Recruiter
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <IndianRupee className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Salary Range</p>
                            <p className="text-gray-900 font-semibold">{job.salary?.min} - {job.salary?.max}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Posted On</p>
                            <p className="text-gray-900 font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-left">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Job Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.split(',').map((skill, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
