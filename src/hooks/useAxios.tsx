import axios from 'axios';
import {useEffect} from 'react';
import myAxios from '../api/axios';

const useAxios = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        const requestIntercept = myAxios.interceptors.request.use(
            config => {
                if (jwtToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
                }
                else {
                    delete axios.defaults.headers.common['Authorization'];
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        return () => {
            myAxios.interceptors.request.eject(requestIntercept);
        };
    }, [jwtToken]);

    return myAxios;
};

export default useAxios;