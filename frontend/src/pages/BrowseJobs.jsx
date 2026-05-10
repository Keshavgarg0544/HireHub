import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, MapPin, Briefcase, Filter, ChevronRight, 
    Loader2, Building2, LayoutGrid, List as ListIcon 
} from 'lucide-react';
import { getJobs } from '../services/job.service';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        employmentType: ''
    });

    const SkeletonJob = () => (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-2">
                        <div className="h-5 bg-slate-100 rounded w-48"></div>
                        <div className="h-4 bg-slate-100 rounded w-32"></div>
                    </div>
                </div>
                <div className="h-8 bg-slate-100 rounded-full w-24"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div className="flex gap-4 pt-2">
                <div className="h-4 bg-slate-100 rounded w-24"></div>
                <div className="h-4 bg-slate-100 rounded w-24"></div>
            </div>
        </div>
    );

    const fetchJobs = async () => {
        try {
            const response = await getJobs(filters);
            setJobs(response.data);
            localStorage.setItem('cachedJobs', JSON.stringify(response.data));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem('cachedJobs');
        if (cached) {
            try {
                setJobs(JSON.parse(cached));
            } catch (e) {
                console.error('Cache parse error:', e);
            }
        }
        setLoading(true);
        fetchJobs();
    }, []);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setLoading(true);
            fetchJobs();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [filters]);

    return (
        <div className="min-h-screen bg-white">
            {/* 1. IMPACT HEADER */}
            <section className="pt-16 pb-12 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Search className="w-3 h-3" />
                                <span>Discovery</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 leading-tight">Find your <br /> <span className="text-blue-600">next big thing.</span></h1>
                            <p className="text-slate-500 font-medium text-lg max-w-xl">Explore thousands of open roles from top startups to Fortune 500 giants.</p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black">
                                <LayoutGrid className="w-4 h-4 mr-2" /> Grid
                            </div>
                            <div className="flex items-center px-4 py-2 text-slate-400 hover:text-slate-900 rounded-xl text-sm font-black transition-colors cursor-pointer">
                                <ListIcon className="w-4 h-4 mr-2" /> List
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ADVANCED FILTERS */}
            <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by title, role or expertise..."
                                value={filters.search}
                                onChange={e => setFilters({...filters, search: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                            />
                        </div>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Location..."
                                value={filters.location}
                                onChange={e => setFilters({...filters, location: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                            />
                        </div>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <select 
                                value={filters.employmentType}
                                onChange={e => setFilters({...filters, employmentType: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none appearance-none"
                            >
                                <option value="">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. JOB LISTINGS */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{jobs.length}</span> matching opportunities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {loading && jobs.length === 0 ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonJob key={i} />)
                        ) : jobs.length === 0 ? (
                            <div className="lg:col-span-2 py-32 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
                                    <Search className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">No matching jobs found.</h3>
                                    <p className="text-slate-500 font-medium">Try broadening your search or adjusting your filters.</p>
                                </div>
                                <button 
                                    onClick={() => setFilters({search: '', location: '', employmentType: ''})}
                                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            jobs.map((job, i) => (
                                <div 
                                    key={job.id}
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-slate-50 text-8xl font-black opacity-0 group-hover:opacity-10 transition-opacity">
                                        {i + 1}
                                    </div>
                                    
                                    <div className="flex flex-col h-full space-y-6 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4 items-center">
                                                {job.company?.logoUrl ? (
                                                    <img src={job.company.logoUrl} alt={job.company.name} className="w-16 h-16 rounded-3xl object-contain bg-white shadow-xl shadow-slate-100 p-2 border border-slate-50 transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <div className={`w-16 h-16 ${['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-emerald-600'][i % 4]} rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-100 transition-transform group-hover:scale-110`}>
                                                        {(typeof job.company === 'object' ? job.company.name : job.company)?.[0] || 'J'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-slate-500 font-bold text-sm">
                                                        {typeof job.company === 'object' ? job.company.name : job.company}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {job.employmentType}
                                            </div>
                                        </div>

                                        <p className="text-slate-500 font-medium text-sm line-clamp-3 leading-relaxed">
                                            {job.description}
                                        </p>

                                        <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-50 mt-auto">
                                            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {job.location}
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                                                {job.salary ? `₹${job.salary.min?.toLocaleString()} - ₹${job.salary.max?.toLocaleString()}` : 'Competitive Salary'}
                                            </div>
                                            <div className="ml-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
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

export default BrowseJobs;
