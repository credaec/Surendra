const API_BASE = '/api';

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('credence_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const api = {
    get: async (url: string) => {
        const res = await fetchWithTimeout(`${API_BASE}${url}`, {
            headers: { ...getAuthHeaders() }
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },
    post: async (url: string, data: any) => {
        const res = await fetchWithTimeout(`${API_BASE}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },
    put: async (url: string, data: any) => {
        const res = await fetchWithTimeout(`${API_BASE}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },
    delete: async (url: string) => {
        const res = await fetchWithTimeout(`${API_BASE}${url}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() }
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    }
};
