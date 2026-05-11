import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Building2, ChevronRight, Loader2, Plus, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { getCompanies } from '../../services/company.service';
import { requestAccess, getMyMemberships } from '../../services/companyMember.service';

const Onboarding = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [requestingId, setRequestingId] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                // First check if they already have an approved or pending membership
                const memRes = await getMyMemberships();
                setMemberships(memRes.data?.data || []);
                
                // Fetch companies for them to search through
                const compRes = await getCompanies({ limit: 50 });
                setCompanies(compRes.data || []);
            } catch (err) {
                console.error('Onboarding init error:', err);
                setMemberships([]);
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleRequestAccess = async (companyId) => {
        setRequestingId(companyId);
        setError('');
        try {
            await requestAccess(companyId);
            // Refresh memberships to show the new pending status
            const memRes = await getMyMemberships();
            setMemberships(memRes.data.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to request access");
        } finally {
            setRequestingId(null);
        }
    };

    const pendingMembership = memberships.find(m => m.status === 'PENDING');
    const approvedMembership = memberships.find(m => m.status === 'APPROVED');

    // If they are already approved, send them to the dashboard immediately
    useEffect(() => {
        if (approvedMembership) {
            navigate('/recruiter/jobs', { replace: true });
        }
    }, [approvedMembership, navigate]);

    if (approvedMembership || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Verifying your credentials...</p>
                </div>
            </div>
        );
    }

    // STATE: Waiting for Admin Approval
    if (pendingMembership) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center space-y-6">
                    <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto relative">
                        <Mail className="w-10 h-10 text-amber-500" />
                        <div className="absolute top-2 right-2 w-4 h-4 bg-amber-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Request Sent</h2>
                        <p className="text-slate-500 font-medium">
                            Your request to join <span className="font-bold text-slate-900">{pendingMembership.company?.name || 'the company'}</span> is currently pending admin approval.
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 text-sm text-slate-600 font-medium border border-slate-100">
                        You will receive an email notification once your account has been verified by the company administrators.
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // STATE: Company Search (No memberships yet)
    const filteredCompanies = companies.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Find your <span className="text-blue-600">Company.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                        To post jobs on HireHub, you must request access to an existing company profile, or register a new one.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="Search for your company name..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map(company => (
                                <div key={company.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="flex items-center gap-4">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt={company.name} className="w-12 h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-100 p-1" />
                                        ) : (
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 font-black text-lg">
                                                {company.name[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-slate-900">{company.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{company.location}</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleRequestAccess(company.id)}
                                        disabled={requestingId === company.id}
                                        className="px-6 py-2.5 bg-white text-slate-900 border border-slate-200 font-bold text-sm rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {requestingId === company.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Access'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">No company found</h3>
                                    <p className="text-sm text-slate-500">Can't find your company in our system?</p>
                                </div>
                                <Link 
                                    to="/recruiter/create-company" 
                                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700"
                                >
                                    Register New Company <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
