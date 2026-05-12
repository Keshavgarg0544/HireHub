import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMyMemberships } from '../services/companyMember.service';
import { getCurrentUser } from '../services/auth.service';
import { Loader2 } from 'lucide-react';

const MembershipGuard = () => {
    const user = getCurrentUser();
    const [loading, setLoading] = useState(true);
    const [memberships, setMemberships] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const checkMemberships = async () => {
            if (user?.role !== 'RECRUITER') {
                setLoading(false);
                return;
            }

            try {
                const res = await getMyMemberships();
                setMemberships(res.data?.data || []);
            } catch (err) {
                console.error('MembershipGuard error:', err);
                setMemberships([]);
            } finally {
                setLoading(false);
            }
        };

        checkMemberships();
    }, [user?.role, location.pathname]); // Re-check on navigation to prevent stale data loops

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (user?.role !== 'RECRUITER') {
        return <Outlet />; 
    }

    const hasApprovedMembership = memberships.some(m => m.status === 'APPROVED');

    
    if (!hasApprovedMembership && !location.pathname.includes('/onboarding') && !location.pathname.includes('/create-company')) {
        return <Navigate to="/recruiter/onboarding" replace />;
    }

    if (hasApprovedMembership && location.pathname.includes('/onboarding')) {
        return <Navigate to="/recruiter/jobs" replace />;
    }

    return <Outlet />;
};

export default MembershipGuard;
