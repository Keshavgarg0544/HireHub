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
    const [viewMode, setViewMode] = useState('GRID'); // 'GRID' or 'LIST'

    const SkeletonJob = () => (
        <div className={`bg-white rounded-3xl border border-slate-100 animate-pulse ${viewMode === 'GRID' ? 'p-8 space-y-6' : 'p-6 flex items-center justify-between'}`}>
            <div className={`flex gap-4 ${viewMode === 'GRID' ? 'flex-col items-start' : 'items-center flex-1'}`}>
                <div className={`${viewMode === 'GRID' ? 'w-16 h-16' : 'w-20 h-20'} bg-slate-100 rounded-2xl`}></div>
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                </div>
            </div>
            {viewMode === 'GRID' ? (
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="h-6 bg-slate-100 rounded w-24"></div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <div className="h-6 bg-slate-100 rounded w-24 hidden sm:block"></div>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                </div>
            )}
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
                        
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                            <button 
                                onClick={() => setViewMode('GRID')}
                                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-black transition-all ${viewMode === 'GRID' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <LayoutGrid className="w-4 h-4 mr-2" /> Grid
                            </button>
                            <button 
                                onClick={() => setViewMode('LIST')}
                                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-black transition-all ${viewMode === 'LIST' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <ListIcon className="w-4 h-4 mr-2" /> List
                            </button>
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

                    <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonJob key={i} />)
                        ) : jobs.length === 0 ? (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">No jobs found matching your criteria.</h3>
                                <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            jobs.map((job, i) => (
                                <div 
                                    key={job.id} 
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    className={`group bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden ${viewMode === 'GRID' ? 'p-8' : 'p-6 flex items-center justify-between'}`}
                                >
                                    {viewMode === 'GRID' && (
                                        <div className="absolute top-0 right-0 p-8 text-slate-50 text-8xl font-black opacity-0 group-hover:opacity-10 transition-opacity">
                                            {i + 1}
                                        </div>
                                    )}
                                    {viewMode === 'GRID' ? (
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-xl shadow-slate-100 p-2 border border-slate-50 transition-transform group-hover:scale-110">
                                                        {job.company?.logoUrl ? (
                                                            <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                                                {job.company?.name?.[0] || 'J'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{job.title}</h3>
                                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                            <Building2 className="w-4 h-4 text-slate-400" />
                                                            {job.company?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {job.employmentType}
                                                </div>
                                            </div>

                                            <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed mb-8">
                                                {job.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm mb-8">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-slate-300" />
                                                    {job.location}
                                                </div>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-4 h-4 text-slate-300" />
                                                    {job.experienceLevel}
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Salary</p>
                                                    <p className="text-xl font-black text-slate-900 leading-none">
                                                        ₹{job.salary?.min?.toLocaleString()} - ₹{job.salary?.max?.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-xl shadow-slate-100 p-2 border border-slate-50 transition-transform group-hover:scale-110 shrink-0">
                                                    {job.company?.logoUrl ? (
                                                        <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                                            {job.company?.name?.[0] || 'J'}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                                                            {job.employmentType}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                                                            {job.experienceLevel}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                                                        <div className="flex items-center gap-1.5">
                                                            <Building2 className="w-4 h-4 text-slate-300" />
                                                            {job.company?.name}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4 text-slate-300" />
                                                            {job.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 ml-8">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"> Salary</p>
                                                    <p className="text-lg font-black text-slate-900 leading-none whitespace-nowrap">
                                                        ₹{job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </>
                                    )}
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
