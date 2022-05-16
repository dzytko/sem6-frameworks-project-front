import React, {FC, useState} from 'react';
import {ProductType} from '../../types/ProductType';
import {LinkContainer} from 'react-router-bootstrap';
import {NavLink} from 'react-bootstrap';

interface ProductProps {
    product: ProductType;
}

const Product: FC<ProductProps> = ({product}) => {
    const [imagePath] = useState('');

    return (
        <div className={'p-1'}>
            <LinkContainer to={`/product/${product._id}`}>
                <NavLink className={'card card-body text-black'}>
                    <img className={'img-fluid'} src={imagePath || 'https://via.placeholder.com/600x500'} alt={''}/>
                    <span className={'pt-3'}>{product.productName}</span>
                    <div>
                        ${product?.isDiscounted ? product?.discountedUnitPrice?.toFixed(2) : product?.unitPrice.toFixed(2)}
                        <span className="text-black-50 ps-2">
                                    {product?.isDiscounted && <del>${product?.unitPrice.toFixed(2)}</del>}
                                </span>
                    </div>
                </NavLink>
            </LinkContainer>
        </div>
    );
};

export default Product;