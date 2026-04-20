import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Briefcase, MapPin, IndianRupee, Edit, Trash2, Loader2 } from 'lucide-react';
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
            // Filter by the current user's ID using our new backend support
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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        
        setDeletingId(id);
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            alert(error.message || 'Failed to delete job');
        } finally {
            setDeletingId(null);
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
        <div className="space-y-8 pb-20 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Your Jobs</h1>
                    <p className="text-gray-500 mt-1">Track applications and update your job postings.</p>
                </div>
                <Link 
                    to="/recruiter/create-job" 
                    className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5 mr-2" /> Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
                        <Briefcase className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                    <p className="text-gray-500 max-w-xs mt-2">Get started by creating your first job posting to find great talent.</p>
                    <Link to="/recruiter/create-job" className="mt-6 text-blue-600 font-bold hover:underline">
                        Create job posting &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-blue-600 font-medium inline-block mr-3">{job.company?.name}</p>
                                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-100 uppercase tracking-wider">
                                        Open
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" /> {job.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-1" /> {job.employmentType.replace('_', ' ')}
                                    </div>
                                    <div className="flex items-center text-gray-900 font-semibold">
                                        <IndianRupee className="h-4 w-4 mr-1" /> {job.salary?.min} - {job.salary?.max}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link 
                                    to={`/jobs/${job.id}`}
                                    className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                                >
                                    View
                                </Link>
                                <Link 
                                    to={`/recruiter/edit/${job.id}`}
                                    className="px-4 py-2 bg-amber-50 text-amber-600 font-semibold hover:bg-amber-100 rounded-lg transition-colors flex items-center border border-amber-100"
                                >
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(job.id)}
                                    disabled={deletingId === job.id}
                                    className="px-4 py-2 bg-red-50 text-red-600 font-semibold hover:bg-red-100 rounded-lg transition-colors flex items-center border border-red-100 disabled:opacity-50"
                                >
                                    {deletingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />} Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageJobs;
