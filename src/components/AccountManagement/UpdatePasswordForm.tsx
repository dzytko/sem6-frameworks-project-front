import React, {FC, useState} from 'react';
import {Alert, Button, Col, Form} from 'react-bootstrap';
import useAxios from '../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(Yup);

const UpdatePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .minUppercase(1, 'Password must contain at least one uppercase letter')
        .minNumbers(1, 'Password must contain at least one number')
        .minSymbols(1, 'Password must contain at least one symbol')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    password: Yup.string().required('Password is required'),
});

interface UpdatePasswordFormProps {
}

const UpdatePasswordForm: FC<UpdatePasswordFormProps> = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
            password: '',
        },
        validationSchema: UpdatePasswordSchema,
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

    return (
        <Form onSubmit={formik.handleSubmit}>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && !error && <Alert variant="success" className="text-center">{success}</Alert>}
            <Form.Group className="row mb-3">
                <Form.Label htmlFor="inputNewPassword" className="col-md-4 text-md-end col-form-label">New password</Form.Label>
                <Col md={6}>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        id="inputNewPassword"
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                        required
                        isInvalid={!!formik.errors.newPassword && formik.touched.newPassword}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.newPassword}</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group className="row mb-3">
                <Form.Label htmlFor="inputConfirmPassword" className="col-md-4 text-md-end col-form-label">Confirm password</Form.Label>
                <Col md={6}>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        id="inputNewPassword"
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        required
                        isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
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

export default UpdatePasswordForm;