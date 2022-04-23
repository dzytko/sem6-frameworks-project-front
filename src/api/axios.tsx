import axios from "axios";

const myAxios = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default myAxios;