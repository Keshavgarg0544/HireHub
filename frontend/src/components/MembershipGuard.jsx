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
                setMemberships(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        checkMemberships();
    }, [user?.role]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (user?.role !== 'RECRUITER') {
        return <Outlet />; // Let RoleGuard handle this if needed, or pass through
    }

    const hasApprovedMembership = memberships.some(m => m.status === 'APPROVED');

    // If they are a recruiter but have no approved membership, 
    // and they are NOT already on the onboarding or create-company page, redirect them.
    if (!hasApprovedMembership && !location.pathname.includes('/onboarding') && !location.pathname.includes('/create-company')) {
        return <Navigate to="/recruiter/onboarding" replace />;
    }

    // If they have an approved membership but try to go to onboarding, send them to jobs
    if (hasApprovedMembership && location.pathname.includes('/onboarding')) {
        return <Navigate to="/recruiter/jobs" replace />;
    }

    return <Outlet />;
};

export default MembershipGuard;
