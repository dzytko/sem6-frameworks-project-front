import React, {useEffect, useState} from 'react';
import {ProductType} from '../../types/ProductType';
import {Col, ListGroupItem} from 'react-bootstrap';
import useAxios from '../../hooks/useAxios';
import {AxiosError, AxiosResponse} from 'axios';

interface CheckoutItemProps {
    product: ProductType;
    quantity: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({product, quantity}) => {
    const axios = useAxios();
    const [imagePath, setImagePath] = useState<string>('');

    useEffect(() => {
        axios.get('resource/image/' + product?.imagePath, {responseType: 'blob'})
            .then((response: AxiosResponse) => {
                setImagePath(URL.createObjectURL(response.data));
            })
            .catch((err: AxiosError) => {
                setImagePath('');
            });
    }, [product]);


    return (
        <ListGroupItem className={'row d-flex justify-content-between align-items-center mx-0'}>
            <Col lg={3}>
                <img src={imagePath || 'https://via.placeholder.com/100x100'} alt={''} width={100} height={100}/>
            </Col>
            <Col lg={8}>
                <h4>{product.productName}</h4>
                <div className={'d-flex justify-content-between'}>
                    <span>{quantity} pcs</span>
                    <div>
                        <span className="text-black-50 my-2 mx-1 fs-6">
                            {product.isDiscounted && <del>${product.unitPrice.toFixed(2)}</del>}
                        </span>
                        <span className={'my-2 mx-2 fs-6'}>
                            ${product.isDiscounted ? product.discountedUnitPrice?.toFixed(2) : product.unitPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
            </Col>
        </ListGroupItem>

    );
};

export default CheckoutItem;