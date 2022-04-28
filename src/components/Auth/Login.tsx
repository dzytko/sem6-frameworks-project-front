import React, {FC, useContext, useState} from 'react';
import {Alert, Button, Card, Col, Form} from 'react-bootstrap';
import {useFormik} from 'formik';
import useAxios from '../../hooks/useAxios';
import {useNavigate} from 'react-router-dom';
import {AxiosError, AxiosResponse} from 'axios';
import {TokenContext} from '../../App';
import CardHeader from 'react-bootstrap/CardHeader';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Password is required'),
});

interface LoginProps {
    redirectTo: string;
}

const Login: FC<LoginProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const {setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: values => {
            axios.post('auth', values)
                .then((response: AxiosResponse) => {
                    setToken(response.data.jwt);
                    localStorage.setItem('jwtToken', response.data.jwt);
                    navigate(redirectTo, {replace: true});
                })
                .catch((err: AxiosError) => {
                    if (err.response && err.response.status >= 400) {
                        setError(err.response.data.message);
                    }
                });
        },
    });

    return (
        <Col md={5} className="mx-auto py-3">
            <Card>
                <CardHeader>Login</CardHeader>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                        <Form.Group className="row mb-3">
                            <Form.Label htmlFor="inputEmail" className="col-md-4 text-md-end col-form-label">E-Mail Address</Form.Label>
                            <Col md={6}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    id="inputEmail"
                                    autoComplete="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    required
                                    isInvalid={!!formik.errors.email && formik.touched.email}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group className="row mb-3">
                            <Form.Label htmlFor="inputPassword" className="col-md-4 text-md-end col-form-label">Password</Form.Label>
                            <Col md={6}>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="inputPassword"
                                    autoComplete="current-password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    required
                                    isInvalid={!!formik.errors.password && formik.touched.password}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group className="col-md-8 offset-md-4">
                            <Button type="submit" variant="primary">Login</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Login;