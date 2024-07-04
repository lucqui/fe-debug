import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_SERVICE;
console.log("BASE_URL for axios is: ", baseURL);

// Function to get the token from cookies safely
const getTokenFromCookies = () => {
    const cookieString = document.cookie;
    if (!cookieString) {
        console.warn('No cookies found');
        return null;
    }
    const tokenCookie = cookieString.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    console.warn('Token not found in cookies');
    return null;
};

const token = getTokenFromCookies();
console.log('Token from cookies:', token);

const axiosConfig = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});

export default axiosConfig;