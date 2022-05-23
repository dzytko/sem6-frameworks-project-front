import React, {useEffect} from 'react';
import {Accordion} from 'react-bootstrap';
import {OrderType} from './OrderType';
import {ProductType} from './ProductType';
import useAxios from '../hooks/useAxios';
import CheckoutItem from '../components/Checkout/CheckoutItem';

interface OrderProps {
    order: OrderType;
}

const Order: React.FC<OrderProps> = ({order}) => {
    const [orderProducts, setOrderProducts] = React.useState<Array<[ProductType, number]>>([]);
    const axios = useAxios();

    useEffect(() => {
        (async () => {
            const products: Array<[ProductType, number]> = [];
            for (const product of order.orderItems) {
                let res = await axios.get(`/product/${product.productId}`)
                products.push([res.data as ProductType, product.quantity]);
            }
            setOrderProducts(products);
            console.log('Product fetch, ', products);
        })();
    }, []);

    return (
        <Accordion.Item eventKey={order._id}>
            <Accordion.Header>{new Date(order.orderDate).toLocaleString('pl')}</Accordion.Header>
            <Accordion.Body>
                <span>First name: {order.firstName}</span><br/>
                <span>Last name: {order.lastName}</span><br/>
                <span>Email: {order.email}</span><br/>
                <span>Street: {order.street}</span><br/>
                <span>Postal code: {order.postalCode}</span><br/>
                <span>City: {order.city}</span><br/>
                <span>Phone number: {order.phoneNumber}</span><br/>
                <span>Delivery method: {order.deliveryMethod}</span><br/>
                <span>Payment method: {order.paymentMethod}</span><br/>
                <span>Total amount: {}</span><br/><br/>
                <h3>Items</h3>
                {orderProducts.map(([product, quantity]) => {
                    console.log('Product map: ', product);
                    return <CheckoutItem key={product._id} product={product} quantity={quantity}/>;
                })}
            </Accordion.Body>
        </Accordion.Item>
    );
};

const getCurrentDateFromIso = (isoTimeStamp: string) => {


};

export default Order;