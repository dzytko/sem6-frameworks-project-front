import React, {FC, useContext, useState} from 'react';
import {Alert, Button, Col, Form} from 'react-bootstrap';
import * as Yup from 'yup';
import useAxios from '../../hooks/useAxios';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import {useNavigate} from 'react-router-dom';
import {TokenContext} from '../../App';

const UpdateInfoSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
});


interface DeleteAccountFormProps {
}

const DeleteAccountForm: FC<DeleteAccountFormProps> = () => {
    const [error, setError] = useState('');
    const { setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    const axios = useAxios();

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: UpdateInfoSchema,
        onSubmit: (values) => {
            const config = {
                data: {...values}
            };
            axios.delete(`user/`, config)
                .then((response: AxiosResponse) => {
                    setError('');
                    setToken('');
                    navigate('/');
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
                <Button type="submit" variant="danger">Delete</Button>
            </Form.Group>
        </Form>
    );
};

export default DeleteAccountForm;