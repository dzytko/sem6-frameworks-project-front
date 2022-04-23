import React, {FC, useContext, useState} from 'react';
import {Alert, Button, Card, Col, Form} from 'react-bootstrap';
import {useFormik} from 'formik';
import useAxios from '../../hooks/useAxios';
import {useNavigate} from 'react-router-dom';
import {AxiosError, AxiosResponse} from 'axios';
import {TokenContext} from '../../App';
import CardHeader from 'react-bootstrap/CardHeader';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(Yup);

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must be less than 50 characters long'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name must be less than 50 characters long'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .minUppercase(1, 'Password must contain at least one uppercase letter')
        .minNumbers(1, 'Password must contain at least one number')
        .minSymbols(1, 'Password must contain at least one symbol')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

interface RegisterProps {
    redirectTo: string;
}

const Register: FC<RegisterProps> = ({redirectTo}) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const {setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async values => {
            let registered = false;
            await axios.post('user', values)
                .then((response: AxiosResponse) => {
                    setSuccess(true);
                    registered = true;
                })
                .catch((err: AxiosError) => {
                    if (err.response && err.response.status >= 400) {
                        setError(err.response.data.message);
                    }
                });
            if (!registered) {
                return;
            }

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
                <CardHeader>Register</CardHeader>
                <Card.Body>
                    {error && !success && <Alert variant="danger" className="text-center">{error}</Alert>}
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="row mb-3">
                            <Form.Label htmlFor="inputFirstName" className="col-md-4 text-md-end col-form-label">First name</Form.Label>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    id="inputFirstName"
                                    autoComplete="given-name"
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                    required
                                    isInvalid={!!formik.errors.firstName && formik.touched.firstName}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group className="row mb-3">
                            <Form.Label htmlFor="inputLastName" className="col-md-4 text-md-end col-form-label">LastName</Form.Label>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    id="inputLastName"
                                    autoComplete="family-name"
                                    onChange={formik.handleChange}
                                    value={formik.values.lastName}
                                    required
                                    isInvalid={!!formik.errors.lastName && formik.touched.lastName}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
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
                                    autoComplete="new-password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    required
                                    isInvalid={!!formik.errors.password && formik.touched.password}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group className="row mb-3">
                            <Form.Label htmlFor="inputConfirmPassword" className="col-md-4 text-md-end col-form-label">Confirm Password</Form.Label>
                            <Col md={6}>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    id="inputConfirmPassword"
                                    autoComplete="new-password"
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                    required
                                    isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group className="col-md-8 offset-md-4">
                            <Button type="submit" variant="primary">Register</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Register;