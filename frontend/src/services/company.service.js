import api from './api';

export const getCompanies = async (params) => {
    try {
        const response = await api.get('/companies', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch companies" };
    }
};

export const createCompany = async (companyData) => {
    try {
        const formData = new FormData();
        Object.keys(companyData).forEach(key => {
            if (companyData[key] !== null && companyData[key] !== undefined) {
                formData.append(key, companyData[key]);
            }
        });

        const response = await api.post('/companies', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create company" };
    }
};

export const getCompanyById = async (id) => {
    try {
        const response = await api.get(`/companies/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch company" };
    }
};

export const updateCompany = async (id, companyData) => {
    try {
        const formData = new FormData();
        Object.keys(companyData).forEach(key => {
            if (companyData[key] !== null && companyData[key] !== undefined) {
                formData.append(key, companyData[key]);
            }
        });

        const response = await api.put(`/companies/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update company" };
    }
};
