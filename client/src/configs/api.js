import axios from 'axios';

const rawBase = import.meta.env.VITE_BASE_URL || '';
// ensure no trailing slash to avoid accidental double-slashes when joining paths
const baseURL = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const api = axios.create({
    baseURL
});

export default api;