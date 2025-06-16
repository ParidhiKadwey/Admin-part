const API_URL = 
    import.meta.env.VITE_NODE_ENV ==="production"
    ? "https://app.incubationmasters.com:5000"
    : "http://192.168.0.150:8000";

export default API_URL;    
