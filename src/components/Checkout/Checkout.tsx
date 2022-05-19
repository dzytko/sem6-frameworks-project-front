import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import CustomRadioButton from './CustomRadioButton';
import useAxios from '../../hooks/useAxios';
import * as Yup from 'yup';
import {ProductType} from '../../types/ProductType';
import {checkIsCartValid, getCartItems, getTotalPrice} from '../Cart/CartUtils';
import CheckoutItem from './CheckoutItem';
import {useNavigate} from 'react-router-dom';

const OrderSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must be less than 50 characters long'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name must be less than 50 characters long'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email'),
    deliveryMethod: Yup.string()
        .required('Delivery method is required'),
    paymentMethod: Yup.string()
        .required('Payment method is required'),
    street: Yup.string()
        .required('Street is required')
        .min(2, 'Street must be at least 2 characters long')
        .max(50, 'Street must be less than 50 characters long'),
    city: Yup.string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters long')
        .max(50, 'City must be less than 50 characters long'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .min(2, 'Phone number must be at least 2 characters long')
        .max(50, 'Phone number must be less than 50 characters long'),
    postalCode: Yup.string()
        .required('Postal code is required')
        .matches(/^\d{2}-\d{3}$/, 'Invalid postal code')

});

interface checkoutProps {
}

const Checkout: React.FC<checkoutProps> = () => {
    const [cartItems, setCartItems] = useState<Array<[string, ProductType, number]>>();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCartValid, setIsCartValid] = useState<boolean>(false);
    const axios = useAxios();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            deliveryMethod: '',
            paymentMethod: '',
            firstName: '',
            lastName: '',
            email: '',
            street: '',
            postalCode: '',
            city: '',
            phoneNumber: '',
        },
        validationSchema: OrderSchema,
        onSubmit: values => {
            const orderItems = cartItems!.map(([id, product, quantity]) => {
                return {productId: product._id, quantity: quantity}
            });

            axios.post('/order', {...values, orderItems: orderItems, orderDate: new Date().toISOString()})
                .then((response: AxiosResponse) => {
                    // TODO redirect to orders page
                })
                .catch((error: AxiosError) => {
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        axios.get('user')
            .then((response: AxiosResponse) => {
                formik.values.firstName = response.data.firstName
                formik.values.lastName = response.data.lastName
                formik.values.email = response.data.email
            })
    }, []);

    useEffect(() => {
        (async () => {
            setCartItems(await getCartItems(axios));
        })();
    }, []);

    useEffect(() => {
        if (!cartItems) {
            return;
        }
        setTotalPrice(getTotalPrice(cartItems!));
        setIsCartValid(checkIsCartValid(cartItems!));
    }, [cartItems]);

    useEffect(() => {
        if (!isCartValid) {
            navigate('/cart');
        }
    }, [isCartValid])


    return (
        <Row className={'col-9 mx-auto mt-3 pb-5'}>
            <div className={'col-8 px-2'}>
                <Card>
                    <Card.Header>
                        Checkout
                    </Card.Header>
                    <Form onSubmit={formik.handleSubmit}>
                        <Card className={'py-3 px-4'}>
                            <h2>Delivery Method</h2>
                            <CustomRadioButton
                                name={'deliveryMethod'}
                                label={'Delivery method 1'}
                                value={'delivery-method-1'}
                                formik={formik}
                            />
                            <CustomRadioButton
                                name={'deliveryMethod'}
                                label={'Delivery method 2'}
                                value={'delivery-method-2'}
                                formik={formik}
                            />
                            <Form.Control.Feedback type="invalid" className={!!formik.errors.deliveryMethod && formik.touched.deliveryMethod ? 'd-block' : 'd-none'}>
                                <h6>{formik.errors.deliveryMethod}</h6>
                            </Form.Control.Feedback>
                        </Card>
                        <Card className={'py-3 px-4'}>
                            <h2>Payment method</h2>
                            <CustomRadioButton
                                name={'paymentMethod'}
                                label={'Payment method 1'}
                                value={'payment-method-1'}
                                formik={formik}
                            />
                            <CustomRadioButton
                                name={'paymentMethod'}
                                label={'Payment method 2'}
                                value={'payment-method-2'}
                                formik={formik}
                            />
                            <Form.Control.Feedback type="invalid" className={!!formik.errors.paymentMethod && formik.touched.paymentMethod ? 'd-block' : 'd-none'}>
                                <h6>{formik.errors.paymentMethod}</h6>
                            </Form.Control.Feedback>
                        </Card>
                        <Card className={'py-3 px-4'}>
                            <h2>Deliver information</h2>
                            <Form.Group className="row mb-3">
                                <Form.Label htmlFor="inputFirstName" className="col-md-4 text-md-end col-form-label">First name</Form.Label>
                                <Col md={4}>
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
                                <Form.Label htmlFor="inputLastName" className="col-md-4 text-md-end col-form-label">Last name</Form.Label>
                                <Col md={4}>
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
                                <Col md={4}>
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
                                <Form.Label htmlFor="inputAddress" className="col-md-4 text-md-end col-form-label">Street and number</Form.Label>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        name="street"
                                        id="inputAddress"
                                        autoComplete="street-address"
                                        onChange={formik.handleChange}
                                        value={formik.values.street}
                                        required
                                        isInvalid={!!formik.errors.street && formik.touched.street}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.street}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group className="row mb-3">
                                <Form.Label htmlFor="inputPostalCode" className="col-md-4 text-md-end col-form-label">Postal code</Form.Label>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        name="postalCode"
                                        id="inputPostalCode"
                                        autoComplete="postal-code"
                                        onChange={formik.handleChange}
                                        value={formik.values.postalCode}
                                        required
                                        isInvalid={!!formik.errors.postalCode && formik.touched.postalCode}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.postalCode}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group className="row mb-3">
                                <Form.Label htmlFor="inputCity" className="col-md-4 text-md-end col-form-label">City</Form.Label>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        id="inputCity"
                                        autoComplete="address-level2"
                                        onChange={formik.handleChange}
                                        value={formik.values.city}
                                        required
                                        isInvalid={!!formik.errors.city && formik.touched.city}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.city}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group className="row mb-3">
                                <Form.Label htmlFor="inputPhoneNumber" className="col-md-4 text-md-end col-form-label">Phone number</Form.Label>
                                <Col md={4}>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        id="inputPhoneNumber"
                                        autoComplete="tel"
                                        onChange={formik.handleChange}
                                        value={formik.values.phoneNumber}
                                        required
                                        isInvalid={!!formik.errors.phoneNumber && formik.touched.phoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.phoneNumber}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                        </Card>
                        <Card className={'py-3 px-4'}>
                            <Form.Group className="col-md-8 offset-md-5">
                                <Button type="submit" variant={isCartValid ? 'success' : 'secondary'} disabled={!isCartValid}>Checkout</Button>
                            </Form.Group>
                        </Card>
                    </Form>
                </Card>
            </div>
            <Card className={'col-4 px-0 mx-0'}>
                {cartItems && cartItems.map((item: [string, ProductType, number]) => {
                    const [id, product, quantity] = item;
                    return (
                        <CheckoutItem  key={id} product={product} quantity={quantity}/>
                    );
                })}
                <Card className={'text-center pt-3 w-auto'}>
                    <span>Total amount: ${totalPrice.toFixed(2)}</span>
                    <Form.Group className="mx-auto pt-1 pb-3">
                        <Button onClick={()=>{formik.handleSubmit()}} variant={isCartValid ? 'success' : 'secondary'} disabled={!isCartValid}>Checkout</Button>
                    </Form.Group>
                </Card>
            </Card>
        </Row>
    );
};

export default Checkout;