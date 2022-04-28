import React, {FC, useEffect, useState} from 'react';
import {useFormik} from 'formik';
import useAxios from '../../hooks/useAxios';
import {AxiosError, AxiosResponse} from 'axios';
import * as Yup from 'yup';
import {Alert, Button, Col, Form} from 'react-bootstrap';

const UpdateInfoSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must be less than 50 characters long'),
    lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name must be less than 50 characters long'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

interface UpdateAccountInfoFormProps {
}

const UpdateAccountInfoForm: FC<UpdateAccountInfoFormProps> = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: UpdateInfoSchema,
        onSubmit: (values) => {
            axios.patch(`user/`, values)
                .then((response: AxiosResponse) => {
                    setSuccess('Account information updated successfully');
                    setError('');
                })
                .catch((err: AxiosError) => {
                    if (err.response && err.response.status >= 400) {
                        setError(err.response.data.message);
                    }
                });
        },
    });

    useEffect(() => {
        axios.get('user')
            .then((response: AxiosResponse) => {
                formik.setValues({
                    password: '',
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email
                });
            })
            .catch((error: AxiosError) => {
                setError('Error getting user info');
            });
    }, [axios]);

    return (
        <Form onSubmit={formik.handleSubmit}>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && !error && <Alert variant="success" className="text-center">{success}</Alert>}
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
                <Form.Label htmlFor="inputPassword" className="col-md-4 text-md-end col-form-label">Current password</Form.Label>
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
                <Button type="submit" variant="primary">Update</Button>
            </Form.Group>
        </Form>
    );
};

export default UpdateAccountInfoForm;