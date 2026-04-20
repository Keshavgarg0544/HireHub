import api from './api';

export const applyToJob = async (jobId, applicationData) => {
    try {
        const response = await api.post(`/applications/apply/${jobId}`, applicationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to apply for job" };
    }
};

export const getMyApplications = async () => {
    try {
        const response = await api.get('/applications/my');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch applications" };
    }
};

export const updateApplicationStatus = async (id, status) => {
    try {
        const response = await api.put(`/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update status" };
    }
};
