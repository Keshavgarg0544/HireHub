import api from './api';

export const getMyMemberships = () => {
    return api.get('/company-members/my-memberships');
};

export const requestAccess = (companyId) => {
    return api.post('/company-members/request', { companyId });
};

export const getPendingRequests = (companyId) => {
    return api.get(`/company-members/${companyId}/requests`);
};

export const reviewAccessRequest = (companyId, membershipId, status) => {
    return api.put(`/company-members/${companyId}/requests/${membershipId}`, { status });
};

export const getCompanyMembers = (companyId) => {
    return api.get(`/company-members/${companyId}/members`);
};

export const removeMember = (companyId, membershipId) => {
    return api.delete(`/company-members/${companyId}/members/${membershipId}`);
};
