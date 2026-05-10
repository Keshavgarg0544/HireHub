import { useNavigate } from 'react-router-dom';
import { 
    Search, MapPin, Briefcase, TrendingUp, Users, 
    ChevronRight, Star, CheckCircle2, ArrowRight, 
    Building2, Zap, ShieldCheck
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const stats = [
        { number: '84K+', label: 'Active Jobs', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { number: '23K+', label: 'Verified Companies', icon: Building2, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { number: '1.2M', label: 'Successful Hires', icon: Users, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { number: '96%', label: 'Retention Rate', icon: ShieldCheck, color: 'text-amber-600', bgColor: 'bg-amber-50' }
    ];

    const categories = [
        { icon: '💻', name: 'Technology', count: '18k+ roles', color: 'bg-blue-50' },
        { icon: '✏️', name: 'Design', count: '7k+ roles', color: 'bg-purple-50' },
        { icon: '📊', name: 'Finance', count: '9k+ roles', color: 'bg-emerald-50' },
        { icon: '📣', name: 'Marketing', count: '5k+ roles', color: 'bg-amber-50' },
        { icon: '⚙️', name: 'Engineering', count: '14k+ roles', color: 'bg-rose-50' },
        { icon: '⚖️', name: 'Legal', count: '3k+ roles', color: 'bg-slate-50' }
    ];

    const companies = [
        { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' }
    ];

    const testimonials = [
        {
            text: "Found my dream role at Dropbox within 2 weeks. The matching algorithm is actually scary good.",
            name: "Priya Rao",
            role: "Product Designer",
            avatar: "PR",
            color: "bg-indigo-600"
        },
        {
            text: "HireHub is the first platform where I actually got responses from real humans, not bots.",
            name: "Alex Chen",
            role: "Senior Dev",
            avatar: "AC",
            color: "bg-blue-600"
        }
    ];

    const heroJobs = [
        { id: 1, title: 'Product Designer', company: 'Google', bgColor: 'bg-blue-600', employmentType: 'Full-time' },
        { id: 2, title: 'Growth Manager', company: 'Shopify', bgColor: 'bg-teal-600', employmentType: 'Remote' },
        { id: 3, title: 'DevOps Engineer', company: 'Figma', bgColor: 'bg-indigo-600', employmentType: 'Contract' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold animate-fade-in">
                                <Zap className="w-4 h-4" />
                                <span>Trusted by 2M+ job seekers worldwide</span>
                            </div>
                            
                            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Find the <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">perfect</span> job for your future.
                            </h1>
                            
                            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                                HireHub connects the world's most ambitious talent with the most innovative companies on the planet.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => navigate('/signup')} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
                                    Explore All Jobs
                                </button>
                                <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all">
                                    Post a Job
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 font-bold">
                                    <span className="text-slate-900 font-black">40,000+</span> people hired this month
                                </p>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] -rotate-3 scale-105"></div>
                            <div className="relative space-y-4">
                                {heroJobs.map((job, i) => (
                                    <div 
                                        key={job.id} 
                                        className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 hover:scale-[1.02] hover:-rotate-1 transition-all group"
                                        style={{ transitionDelay: `${i * 100}ms` }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className={`w-14 h-14 ${job.bgColor} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50`}>
                                                    {job.company[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                                    <p className="text-slate-500 font-bold text-sm">{job.company}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {job.employmentType}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TRUSTED COMPANIES */}
            <section className="py-16 border-y border-slate-50 bg-slate-50/30">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {companies.map(company => (
                            <img key={company.name} src={company.logo} alt={company.name} className="h-8 lg:h-10 object-contain" />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. DYNAMIC STATS */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-100 transition-all group">
                                <div className={`w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <p className="text-4xl font-black text-slate-900 mb-2">{stat.number}</p>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. EXPLORE CATEGORIES */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">Explore jobs by <br /> <span className="text-blue-500">category.</span></h2>
                            <p className="text-slate-400 font-medium max-w-md">Browse thousands of open roles across diverse industries and find your next big challenge.</p>
                        </div>
                        <button onClick={() => navigate('/signup')} className="flex items-center gap-3 text-white font-black hover:text-blue-400 transition-colors group">
                            View All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, i) => (
                            <div key={i} onClick={() => navigate('/signup')} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{cat.icon}</div>
                                <h3 className="text-xl font-black text-white mb-2">{cat.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-400 font-bold text-sm">{cat.count}</p>
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl font-black text-slate-900">How HireHub <span className="text-blue-600">works.</span></h2>
                        <p className="text-slate-500 font-medium text-lg">Your simplified journey from candidate to valued employee starts here.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                        
                        {[
                            { step: '01', title: 'Create Profile', desc: 'Build a premium professional profile that showcases your unique skills and experience.', icon: Users },
                            { step: '02', title: 'Smart Search', desc: 'Our AI-driven matching algorithm finds the roles where you\'ll actually thrive.', icon: Zap },
                            { step: '03', title: 'Direct Hire', desc: 'Connect directly with decision-makers and get hired faster than ever before.', icon: CheckCircle2 }
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-6">
                                <div className="w-20 h-20 bg-white border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto relative group">
                                    <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                                    <item.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors relative z-10" />
                                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS */}
            <section className="py-24 bg-blue-600 rounded-[3rem] mx-6 mb-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />)}
                            </div>
                            <h2 className="text-5xl font-black text-white leading-tight">People love <br /> using HireHub.</h2>
                            <div className="flex items-center gap-8 pt-4">
                                <div className="text-white">
                                    <p className="text-4xl font-black">4.9/5</p>
                                    <p className="text-blue-100 font-bold text-sm uppercase tracking-widest">Average Rating</p>
                                </div>
                                <div className="w-px h-12 bg-white/20"></div>
                                <div className="text-white">
                                    <p className="text-4xl font-black">2M+</p>
                                    <p className="text-blue-100 font-bold text-sm uppercase tracking-widest">Active Users</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {testimonials.map((t, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 text-blue-50 text-8xl font-serif opacity-50">"</div>
                                    <p className="text-slate-700 text-lg font-bold leading-relaxed mb-8 relative z-10">
                                        {t.text}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center text-white font-black text-sm`}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">{t.name}</p>
                                            <p className="text-slate-500 font-bold text-xs">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="py-24 text-center">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl lg:text-6xl font-black text-slate-900">Ready to start your <br /><span className="text-blue-600">new career?</span></h2>
                        <p className="text-xl text-slate-500 font-medium">Join thousands of others who found their professional home through HireHub.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button onClick={() => navigate('/signup')} className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95">
                            Get Started for Free
                        </button>
                        <button onClick={() => navigate('/signup')} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all">
                            Browse All Jobs
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
