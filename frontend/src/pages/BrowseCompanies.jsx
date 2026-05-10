import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, MapPin, Building2, Globe, ArrowRight, 
    Loader2, Users, ShieldCheck, Briefcase, ExternalLink
} from 'lucide-react';
import { getCompanies } from '../services/company.service';

const BrowseCompanies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCompanies = async () => {
        try {
            const response = await getCompanies({ search });
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setLoading(true);
            fetchCompanies();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div className="min-h-screen bg-white">
            {/* 1. PREMIUM HERO */}
            <section className="pt-24 pb-16 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Corporate Ecosystem</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 leading-tight">
                            Explore the world's <br />
                            <span className="text-blue-600">Top Workplaces.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            Discover innovative companies, explore their culture, and find your next professional home. We partner with companies that value talent and growth.
                        </p>
                        
                        {/* SEARCH BAR */}
                        <div className="pt-8 max-w-xl relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by company name or industry..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. COMPANY LIST */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                            {loading ? 'Curating companies...' : `Showing ${companies.length} Organizations`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-[400px] bg-slate-50 rounded-[3rem] animate-pulse"></div>
                            ))
                        ) : companies.length === 0 ? (
                            <div className="col-span-full py-32 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
                                    <Building2 className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">No companies found.</h3>
                                <p className="text-slate-500 font-medium">Try searching for something else or browse all companies.</p>
                            </div>
                        ) : (
                            companies.map((company) => (
                                <div 
                                    key={company.id}
                                    onClick={() => navigate(`/company/${company.id}`)}
                                    className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-50/50 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Company Logo & Verified */}
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-slate-100 flex items-center justify-center p-3 border border-slate-50 relative group-hover:scale-110 transition-transform duration-500">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                                                    {company.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            <ShieldCheck className="w-3 h-3" /> Verified
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    <div className="space-y-3 flex-1">
                                        <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                            {company.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                            <MapPin className="w-4 h-4 text-slate-300" />
                                            {company.location}
                                        </div>
                                    </div>

                                    {/* Stats & Footer */}
                                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Open Roles</p>
                                                <p className="text-xl font-black text-slate-900 leading-none">{company.jobsCount || 0}</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Rating</p>
                                                <p className="text-xl font-black text-slate-900 leading-none">4.8</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Hover Background Accent */}
                                    <div className="absolute top-0 right-0 p-12 text-slate-50 text-9xl font-black opacity-0 group-hover:opacity-10 transition-opacity select-none leading-none">
                                        {company.name[0]}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BrowseCompanies;
