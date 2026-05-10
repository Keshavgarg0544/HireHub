import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Loader2, Globe, ArrowLeft, Building, Target, FileText, Image as ImageIcon } from 'lucide-react';
import { createCompany, getCompanyById, updateCompany } from '../../services/company.service';

const CreateCompany = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [logoPreview, setLogoPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        website: '',
        logo: null
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchCompany = async () => {
                try {
                    const res = await getCompanyById(id);
                    setFormData({
                        name: res.data.name || '',
                        description: res.data.description || '',
                        location: res.data.location || '',
                        website: res.data.website || '',
                        logo: null
                    });
                    if (res.data.logoUrl) {
                        setLogoPreview(res.data.logoUrl);
                    }
                } catch (err) {
                    setError('Failed to load company details');
                } finally {
                    setLoading(false);
                }
            };
            fetchCompany();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        if (e.target.name === 'logo') {
            const file = e.target.files[0];
            if (file) {
                setFormData({ ...formData, logo: file });
                setLogoPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            if (isEditMode) {
                await updateCompany(id, formData);
                navigate('/recruiter/team');
            } else {
                await createCompany(formData);
                navigate('/recruiter/create-job');
            }
        } catch (err) {
            setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} company`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors group mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                        Go back
                    </button>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-100 mb-6">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            {isEditMode ? 'Edit Company ' : 'Register Your '}
                            <span className="text-blue-600">{isEditMode ? 'Profile.' : 'Company.'}</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {isEditMode ? 'Update your brand identity and details.' : 'Every great hire starts with a strong brand identity.'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-xl mx-auto px-6 mt-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-red-600 font-black">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Official Name</label>
                            <div className="relative">
                                <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                    placeholder="e.g. Acme Industries"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Headquarters Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    required
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                    placeholder="e.g. San Francisco, US"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Company Website</label>
                            <div className="relative">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                    placeholder="https://company.com"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Company Logo</label>
                            <div className="flex flex-col gap-4">
                                {logoPreview && (
                                    <div className="w-24 h-24 rounded-2xl border-2 border-slate-100 overflow-hidden bg-slate-50 relative group/preview">
                                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                )}
                                <div className="relative">
                                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold ml-1">Recommended: Square image, PNG or JPG, Max 5MB</p>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Mission & About</label>
                            <div className="relative">
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-6 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl font-bold text-slate-900 transition-all outline-none resize-none leading-relaxed"
                                    placeholder="What does your company do? What are your values? Let candidates know..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-2xl shadow-slate-100 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3"
                    >
                        {submitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                            <>{isEditMode ? 'Save Changes' : 'Complete Registration'}</>
                        )}
                    </button>
                    
                    <p className="text-center text-slate-400 font-bold text-xs px-8">
                        By {isEditMode ? 'updating' : 'registering'}, you agree to our professional terms of service and hiring standards.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
