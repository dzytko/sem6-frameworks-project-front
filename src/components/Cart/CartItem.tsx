import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';
import {AxiosError, AxiosResponse} from 'axios';
import {ProductType} from '../../types/ProductType';
import useAxios from '../../hooks/useAxios';

interface cartItemProps {
    id: string;
    product: ProductType;
    quantity: number;
    setCartItems: Dispatch<SetStateAction<[string, ProductType, number][] | undefined>>;
}

const CartItem: React.FC<cartItemProps> = ({id, product, quantity, setCartItems}) => {
    const [imagePath, setImagePath] = useState<string>('');
    const axios = useAxios();

    const quantityFormik = useFormik({
        initialValues: {
            quantity: quantity,
        },
        onSubmit: values => {
        },
    });

    const removeItemFormik = useFormik({
        initialValues: {
            id: id,
        },
        onSubmit: values => {
            axios.delete(`cart-item/${values.id}`)
                .then((response: AxiosResponse) => {
                    setCartItems(prevCartItems => {
                        if (prevCartItems) {
                            return prevCartItems.filter(item => item[0] !== values.id);
                        }
                    });
                })
                .catch((error: AxiosError) => {
                    console.log(error);
                });
        },
    });

    useEffect(() => {
        axios.get('resource/image/' + product?.imagePath, {responseType: 'blob'})
            .then((response: AxiosResponse) => {
                setImagePath(URL.createObjectURL(response.data));
            })
            .catch((err: AxiosError) => {
                console.log(err);
                setImagePath('');
            });
    }, [product]);

    useEffect(() => {
        setCartItems(prevState => {
            return prevState?.map(item => { // this is bad
                if (item[0] === id) {
                    return [id, product, quantityFormik.values.quantity];
                }
                return item;
            });
        });
    }, [quantityFormik.values.quantity]);

    return (
        <Col className={'list-group-item align-items-center d-flex ' + (product.isDiscontinued ? 'bg-dark bg-opacity-25' : '')}>
            <img src={imagePath || 'https://via.placeholder.com/100x100'} alt={''} width={100} height={100}/>
            <span className={'mx-3 fs-5'}>{product.productName}</span>
            {product.isDiscontinued && <span className="mx-3 text-danger fs-5">Product discontinued</span>}
            {
                !product.isDiscontinued &&
                product.quantity < quantityFormik.values.quantity &&
                <span className="mx-3 text-danger fs-5">No enough products in stock({product.quantity})</span>
            }
            <div className={'text-end d-flex flex-grow-1 align-content-center justify-content-end'}>
                <span className="text-black-50 my-2 mx-1 fs-6">
                    {product.isDiscounted && <del>${product.unitPrice.toFixed(2)}</del>}
                </span>
                <span className={'my-2 mx-2 fs-6'}>
                     ${product.isDiscounted ? product.discountedUnitPrice?.toFixed(2) : product.unitPrice.toFixed(2)}
                </span>
                <Form onSubmit={quantityFormik.handleSubmit} className={'d-flex justify-content-end'}>
                    <Form.Control
                        type="number"
                        name="quantity"
                        id="inputQuantity"
                        autoComplete="off"
                        onChange={quantityFormik.handleChange}
                        value={quantityFormik.values.quantity}
                        min={1}
                        max={99}
                        required
                        disabled={product?.isDiscontinued}
                        className={product.isDiscontinued ? 'bg-dark bg-opacity-10' : ''}
                    />
                </Form>
                <Form onSubmit={removeItemFormik.handleSubmit} className={'d-flex justify-content-end'}>
                    <Button
                        type="submit"
                        variant={'outline-danger'}
                        className={'border-0'}
                    >
                        <FontAwesomeIcon icon={faTrashCan} size={'lg'}/>
                    </Button>
                </Form>
            </div>
        </Col>
    );
};

export default CartItem;