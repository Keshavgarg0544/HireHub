import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, XCircle, UserMinus, ShieldAlert, Loader2, Building2, UserCheck, Edit } from 'lucide-react';
import { getMyMemberships, getPendingRequests, getCompanyMembers, reviewAccessRequest, removeMember } from '../../services/companyMember.service';

const TeamManagement = () => {
    const [loading, setLoading] = useState(true);
    const [adminMemberships, setAdminMemberships] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const fetchData = async (companyId) => {
        setLoading(true);
        try {
            const [reqsRes, memsRes] = await Promise.all([
                getPendingRequests(companyId),
                getCompanyMembers(companyId)
            ]);
            setPendingRequests(reqsRes.data.data || []);
            setActiveMembers(memsRes.data.data || []);
        } catch (err) {
            setError('Failed to load team data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getMyMemberships();
                const memberships = res.data.data;
                const adminMems = memberships.filter(m => m.role === 'COMPANY_ADMIN' && m.status === 'APPROVED');
                
                setAdminMemberships(adminMems);

                if (adminMems.length > 0) {
                    setSelectedCompanyId(adminMems[0].companyId);
                    await fetchData(adminMems[0].companyId);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to authenticate admin access');
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleCompanySwitch = async (e) => {
        const newId = e.target.value;
        setSelectedCompanyId(newId);
        await fetchData(newId);
    };

    const handleReview = async (membershipId, status) => {
        setActionLoading(membershipId);
        try {
            await reviewAccessRequest(selectedCompanyId, membershipId, status);
            await fetchData(selectedCompanyId); // Refresh data
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (membershipId) => {
        if (!window.confirm('Are you sure you want to remove this recruiter from the company?')) return;
        
        setActionLoading(membershipId);
        try {
            await removeMember(selectedCompanyId, membershipId);
            await fetchData(selectedCompanyId); // Refresh data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove member');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    if (adminMemberships.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center space-y-6">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
                        <p className="text-slate-500 font-medium">You must be a Company Admin to access the team management dashboard.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentCompany = adminMemberships.find(m => m.companyId === selectedCompanyId)?.company;

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <section className="pt-20 pb-12 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        {currentCompany?.logoUrl ? (
                            <img src={currentCompany.logoUrl} alt={currentCompany.name} className="w-16 h-16 rounded-2xl shadow-xl shadow-blue-100 object-contain bg-white p-2 border border-slate-50" />
                        ) : (
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center text-white">
                                <Building2 className="w-8 h-8" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Team Management</h1>
                            <p className="text-slate-500 font-bold">{currentCompany?.name || 'Your Company'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {adminMemberships.length > 1 && (
                            <select 
                                value={selectedCompanyId} 
                                onChange={handleCompanySwitch}
                                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-3 outline-none cursor-pointer"
                            >
                                {adminMemberships.map(mem => (
                                    <option key={mem.companyId} value={mem.companyId}>
                                        {mem.company?.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <Link 
                            to={`/recruiter/edit-company/${selectedCompanyId}`}
                            className="bg-white border-2 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold px-4 py-3 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap"
                        >
                            <Edit className="w-4 h-4" /> Edit Company
                        </Link>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 pt-12 space-y-12">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-sm">
                        {error}
                    </div>
                )}

                {/* Pending Requests Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Pending Approvals</h2>
                        {pendingRequests.length > 0 && (
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
                                {pendingRequests.length}
                            </span>
                        )}
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                            <p className="text-slate-400 font-bold">No pending requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                                            {req.user?.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{req.user?.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium">{req.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button 
                                            onClick={() => handleReview(req.id, 'APPROVED')}
                                            disabled={actionLoading === req.id}
                                            className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReview(req.id, 'REJECTED')}
                                            disabled={actionLoading === req.id}
                                            className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Team Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Active Team</h2>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Recruiter</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeMembers.map(member => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm ${member.role === 'COMPANY_ADMIN' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                                                        {member.user?.name?.[0] || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{member.user?.name}</p>
                                                        <p className="text-slate-500 text-xs font-medium">{member.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${member.role === 'COMPANY_ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {member.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button 
                                                    onClick={() => handleRemove(member.id)}
                                                    disabled={actionLoading === member.id || member.role === 'COMPANY_ADMIN'}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent inline-flex items-center justify-center"
                                                    title={member.role === 'COMPANY_ADMIN' ? "Cannot remove an Admin" : "Remove recruiter"}
                                                >
                                                    {actionLoading === member.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserMinus className="w-5 h-5" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeamManagement;
