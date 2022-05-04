import React, {FC, useContext, useEffect, useState} from 'react';
import {Alert, Button, Card, Col, Form, Row, Toast} from 'react-bootstrap';
import useAxios from '../../hooks/useAxios';
import {useNavigate, useParams} from 'react-router-dom';
import CardHeader from 'react-bootstrap/CardHeader';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {ProductType} from '../../types/ProductType';
import {CategoryType} from '../../types/CategoryType';
import './ProductPage.scss';
import {TokenContext} from '../../App';

interface ProductProps {
}

const ProductPage: FC<ProductProps> = () => {
    let {id} = useParams();
    const axios = useAxios();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductType>();
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryType[]>();
    const [imagePath, setImagePath] = useState<string>('');
    const {token} = useContext(TokenContext);

    useEffect(() => {
        axios.get('product/' + id)
            .then((response: AxiosResponse) => {
                setProduct(response.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                navigate('/');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        (async () => {
            let categoriesTmp: CategoryType[] = [];
            let categoryId = product?.categoryId;
            while (categoryId) {
                await axios.get('category/' + categoryId)
                    // eslint-disable-next-line no-loop-func
                    .then((response: AxiosResponse) => {
                        categoryId = response.data.parentId;
                        categoriesTmp.push(response.data);
                    })
                    .catch((err: AxiosError) => {
                        console.log(err);
                    });
            }
            setCategories(categoriesTmp.reverse());
        })();

        axios.get('resource/image/' + product?.imagePath, {responseType: 'blob'})
            .then((response: AxiosResponse) => {
                setImagePath(URL.createObjectURL(response.data));
            })
            .catch((err: AxiosError) => {
                setImagePath('');
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const formik = useFormik({
        initialValues: {
            quantity: 1,
            productId: id
        },
        onSubmit: values => {
            if (!token) {
                navigate('/login');
                return;
            }

            axios.post('cart-item/', values)
                .then((response: AxiosResponse) => {
                    setShowSuccessToast(true);
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 409) {
                        axios.patch('cart-item/' + err.response?.data.cartItem._id, {quantity: err.response?.data.cartItem.quantity + values.quantity})
                            .then((response: AxiosResponse) => {
                                setShowSuccessToast(true);
                            })
                            .catch((err: AxiosError) => {
                                console.log(err);
                            });
                    }
                });
        },
    });

    return (
        <Row className={'justify-content-center'}>
            <Toast
                className="position-absolute d-inline-block px-0 w-auto"
                // bg={'success'}
                onClose={() => setShowSuccessToast(false)}
                show={showSuccessToast}
                delay={3000}
                autohide
            >
                <Alert className={'m-0'} variant={'success'}><h2 className={'mx-auto'}>Product added successfully</h2></Alert>
            </Toast>
            <Col className={'row'} md={9}>
                <div className={'pb-2'}>
                    <a href={'/'} className="text-black text-decoration-none">ShopName</a>
                    {product?.categoryId && categories!.map((category, index) => {
                        return (
                            <a key={index} href={'/category/' + category._id} className="text-black text-decoration-none">{' > ' + category.categoryName}</a>
                        );
                    })}
                </div>
                <img className="col img-fluid" src={imagePath || 'https://via.placeholder.com/600x500'} alt={''}/>
                <Card className={'col p-0'}>
                    <CardHeader className={'pt-2'}>
                        <h2>{product?.productName}</h2>
                    </CardHeader>
                    <Card.Body className={'row p-4'}>
                        <Col className={'card'}>
                            <Card.Body>
                                {product?.properties && Object.entries(product!.properties!).map(([key, value]) => {
                                    return (
                                        // this is bad, but i don't give a fuck
                                        <div key={key}><span className={'text-secondary'}>{key}: </span><span>{value}</span><br/></div>
                                    );
                                })}
                            </Card.Body>
                        </Col>
                        <Col className={'card'}>
                            <Card.Body className="text-end fs-2">
                                <span className="text-black-50 pe-2">
                                    {product?.isDiscounted && <del>${product?.unitPrice.toFixed(2)}</del>}
                                </span>
                                ${product?.isDiscounted ? product?.discountedUnitPrice?.toFixed(2) : product?.unitPrice.toFixed(2)}
                                <Form onSubmit={formik.handleSubmit} className={'d-flex justify-content-end'}>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        id="inputQuantity"
                                        autoComplete="off"
                                        onChange={formik.handleChange}
                                        value={formik.values.quantity}
                                        min={1}
                                        max={99}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant={product?.isDiscontinued ? 'outline-secondary' : 'outline-success'}
                                        disabled={product?.isDiscontinued}
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} size={'lg'}/>
                                        Add to cart
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ProductPage;