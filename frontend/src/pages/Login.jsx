import { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        let newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        
        if (!formData.password) newErrors.password = "Password is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        
        if (validate()) {
            setLoading(true);
            try {
                const response = await login(formData.email, formData.password);
                if (response.success) {
                    const user = response.data?.user;
                    if (user?.role === 'RECRUITER') {
                        navigate('/recruiter/onboarding');
                    } else {
                        navigate('/dashboard');
                    }
                }
            } catch (err) {
                setApiError(err.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start mb-10">
                            <div className="h-20 w-72 overflow-hidden flex items-center justify-center lg:justify-start relative">
                                <img src="/logo.png?v=2" alt="HireHub Logo" className="h-64 w-auto max-w-none object-contain scale-[1.25] ml-4" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome Back.</h2>
                        <p className="text-slate-500 font-medium">Log in to your professional dashboard.</p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-red-600 font-bold">{apiError}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                        <Mail className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 transition-all outline-none ${errors.email ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50'}`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between ml-1 mb-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                        <Lock className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 transition-all outline-none ${errors.password ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50'}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : null}
                            {loading ? 'Authenticating...' : 'Sign In to HireHub'}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-sm font-bold text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors">
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Visual Content */}
            <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -ml-64 -mb-64"></div>
                
                <div className="max-w-md space-y-12 relative z-10 text-center lg:text-left">
                    <div className="space-y-6">
                        <h3 className="text-4xl font-black text-white leading-tight">
                            Elevate your <span className="text-blue-500">career</span> with the world's top companies.
                        </h3>
                        <p className="text-slate-400 font-medium text-lg">
                            "HireHub helped me land my dream role at Stripe within 10 days. The platform is incredibly fast and professional."
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            'Direct access to 5,000+ top companies',
                            'Smart matching based on your expertise',
                            'Real-time application status tracking'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                                MK
                            </div>
                            <div>
                                <p className="text-white font-black">Marcus Kim</p>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Talent Lead · Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
