import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, MapPin, IndianRupee, Clock, Loader2, Plus, AlertCircle, Save } from 'lucide-react';
import { createJob, getJobById, updateJob } from '../../services/job.service';
import { getCompanies } from '../../services/company.service';
import { getCurrentUser } from '../../services/auth.service';

const CreateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        location: '',
        employmentType: 'FULL_TIME',
        experienceLevel: 'FRESHER',
        salaryMin: '',
        salaryMax: '',
        applicationDeadline: '',
        companyId: ''
    });

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const loadInitialData = async () => {
            try {
                // Fetch companies owner by current user
                const response = await getCompanies({ createdBy: user.id });
                const companyList = response.data || [];
                setCompanies(companyList);

                // If Editing, fetch job details
                if (isEditMode) {
                    const jRes = await getJobById(id);
                    const job = jRes.data;
                    setFormData({
                        title: job.title,
                        description: job.description,
                        skillsRequired: job.skillsRequired,
                        location: job.location,
                        employmentType: job.employmentType,
                        experienceLevel: job.experienceLevel,
                        salaryMin: job.salary?.min || '',
                        salaryMax: job.salary?.max || '',
                        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
                        companyId: job.company?.id || ''
                    });
                } else if (companyList.length > 0) {
                    setFormData(prev => ({ ...prev, companyId: companyList[0].id }));
                } else {
                    setError('You need to create a company first before posting a job.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load required data. Please ensure you have a company registered.');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                salaryMin: parseInt(formData.salaryMin),
                salaryMax: parseInt(formData.salaryMax)
            };
            
            if (isEditMode) {
                await updateJob(id, data);
                navigate(`/jobs/${id}`);
            } else {
                const response = await createJob(data);
                navigate(`/jobs/${response.data.id}`);
            }
        } catch (err) {
            setError(err.message || 'Failed to save job');
        } finally {
            setSubmitting(false);
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
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? 'Update Job Posting' : 'Post a New Job'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEditMode ? 'Modify the details of your existing job posting.' : 'Fill in the details to find your next great hire.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-700">{error}</p>
                        {error.includes('create a company first') && (
                            <button 
                                onClick={() => navigate('/recruiter/create-company')}
                                className="text-sm text-red-700 font-bold underline mt-1"
                            >
                                Click here to add a company
                            </button>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                            placeholder="e.g. Senior Frontend Engineer"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                            required
                            name="companyId"
                            value={formData.companyId}
                            onChange={handleChange}
                            className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                        >
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                                placeholder="e.g. Bangalore, Remote"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                className="w-full pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                            >
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="w-full pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                            >
                                <option value="FRESHER">Fresher</option>
                                <option value="JUNIOR">Junior</option>
                                <option value="MID">Mid Level</option>
                                <option value="SENIOR">Senior</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                        <input
                            type="date"
                            name="applicationDeadline"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (Annual)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="number"
                                name="salaryMin"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                className="w-full pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                                placeholder="500000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (Annual)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="number"
                                name="salaryMax"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                className="w-full pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                                placeholder="1200000"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (Comma separated)</label>
                        <input
                            type="text"
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none"
                            placeholder="e.g. React, Node.js, Tailwind CSS"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            className="w-full border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 border outline-none resize-none"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        ></textarea>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100 disabled:bg-blue-400 flex justify-center items-center"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                {isEditMode ? 'Saving Changes...' : 'Posting Job...'}
                            </>
                        ) : (
                            <>
                                {isEditMode ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                                {isEditMode ? 'Save Changes' : 'Create Job Posting'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
