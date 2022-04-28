import {useEffect} from 'react';
import myAxios from '../api/axios';

const useAxios = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        const requestIntercept = myAxios.interceptors.request.use(
            config => {
                if (jwtToken && config.headers) {
                    config.headers['Authorization'] = `Bearer ${jwtToken}`;
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