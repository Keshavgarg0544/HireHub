import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Building2, MapPin, Globe, Briefcase, Users,
    ChevronLeft, Loader2, IndianRupee, ArrowRight,
    ExternalLink, ShieldCheck
} from 'lucide-react';
import { getCompanyById } from '../services/company.service';
import { getJobs } from '../services/job.service';

const CompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companyRes, jobsRes] = await Promise.all([
                    getCompanyById(id),
                    getJobs({ companyId: id })
                ]);
                setCompany(companyRes.data);
                setJobs(jobsRes.data);
            } catch (error) {
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="space-y-4 text-center">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Fetching company profile...</p>
            </div>
        </div>
    );

    if (!company) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32">
            {/* Hero Header */}
            <section className="relative pt-24 pb-40 bg-slate-900 overflow-hidden">
                {/* Advanced Background Decorations */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all group mb-16"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to listings
                    </button>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="w-40 h-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center p-6 border-4 border-slate-800 relative z-10 transition-transform duration-500">
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="w-16 h-16 text-slate-200" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h1 className="text-6xl font-black text-white tracking-tight">{company.name}</h1>
                                    {company.isVerified && (
                                        <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-xl shadow-blue-500/20" title="Verified Company">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-blue-400 font-black text-xs uppercase tracking-[0.4em]">Verified Global Partner</p>
                            </div>

                            <div className="flex flex-wrap gap-8 text-slate-400 font-bold text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                    </div>
                                    {company.location}
                                </div>
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-all group/link">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:bg-blue-600 transition-colors">
                                            <Globe className="w-4 h-4 text-blue-400 group-hover/link:text-white" />
                                        </div>
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                    </div>
                                    {jobs.length} Active Roles
                                </div>
                            </div>
                        </div>

                        <div className="lg:text-right hidden xl:block">
                            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Member Since</p>
                            <p className="text-2xl font-black text-white">{new Date(company.createdAt).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 -mt-20 grid lg:grid-cols-3 gap-12 relative z-20">
                {/* Left: About */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative group">
                        <div className="absolute top-12 right-12 text-slate-50 text-9xl font-black opacity-40 select-none group-hover:text-blue-50 transition-colors -z-0">"</div>
                        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 relative z-10">
                            <span className="w-2.5 h-10 bg-blue-600 rounded-full"></span>
                            The Vision
                        </h2>
                        <div className="text-slate-600 text-xl leading-relaxed whitespace-pre-line font-medium relative z-10">
                            {company.description}
                        </div>
                    </section>

                    {/* Open Roles */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between px-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Career Opportunities</h2>
                                <p className="text-slate-400 font-bold text-sm mt-1">Explore your next challenge at {company.name}</p>
                            </div>
                            <div className="px-4 py-2 bg-blue-50 rounded-xl text-blue-600 text-xs font-black uppercase tracking-widest">
                                {jobs.length} Positions
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {jobs.length > 0 ? (
                                jobs.map((job, i) => (
                                    <Link
                                        key={job.id}
                                        to={`/jobs/${job.id}`}
                                        className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-100 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
                                    >
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Featured</span>
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-8 text-sm text-slate-500 font-bold">
                                                <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-slate-300" /> {job.location}</div>
                                                <div className="flex items-center gap-2.5"><Briefcase className="w-4 h-4 text-slate-300" /> {job.employmentType}</div>
                                                <div className="flex items-center gap-2.5 text-slate-900 font-black">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                        <IndianRupee className="w-4 h-4" />
                                                    </div>
                                                    ₹{job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center space-y-6">
                                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                                        <Briefcase className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-slate-900">No active vacancies</p>
                                        <p className="text-slate-400 font-bold text-sm">Check back later or follow the company for updates.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="space-y-8 relative z-10">
                            <div className="text-center pb-8 border-b border-slate-50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Company Analytics</p>
                                <div className="flex justify-around">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-slate-900">{jobs.length}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Open Roles</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-100"></div>
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-blue-600">98%</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Response</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5 group/item">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover/item:scale-110 transition-transform">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale</p>
                                        <p className="font-black text-slate-900">Verified Entity</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group/item">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover/item:scale-110 transition-transform">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Site</p>
                                        <a href={company.website} target="_blank" rel="noreferrer" className="font-black text-blue-600 hover:underline flex items-center gap-1">
                                            {company.website?.replace(/^https?:\/\//, '') || 'Not provided'}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group/item">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover/item:scale-110 transition-transform">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="font-black text-slate-900">Fully Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95">
                            Follow Organization
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl font-black leading-tight">Join the team at {company.name}</h3>
                            <p className="text-blue-100 font-medium text-sm leading-relaxed opacity-90">Be the first to know about new opportunities and company culture updates.</p>
                        </div>
                        <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:bg-blue-50 transition-colors shadow-xl">Enable Job Alerts</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
