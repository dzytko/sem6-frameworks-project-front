import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/CardHeader';
import {AxiosResponse} from 'axios';
import useAxios from '../../hooks/useAxios';
import CartItem from './CartItem';
import {ProductType} from '../../types/ProductType';

interface cartProps {
}

const Cart: React.FC<cartProps> = () => {
    const axios = useAxios();
    const [cartItems, setCartItems] = useState<Array<[string, ProductType, number]>>();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCartValid, setIsCartValid] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const cartResponse = await axios.get('/cart-item/');

            let carItemsTmp: Array<[string, ProductType, number]> = [];
            for (const item of cartResponse.data) {
                await axios.get(`/product/${item.productId}`)
                    .then((response: AxiosResponse) => {
                        carItemsTmp.push([item._id, response.data, item.quantity]);
                    });
            }
            setCartItems(carItemsTmp);
        })();
    }, []);

    useEffect(() => {
        setTotalPrice(cartItems?.reduce((total, current) => {
            if (current[1].isDiscontinued) {
                return total;
            }
            else if (current[1].isDiscounted) {
                return total + current[1].discountedUnitPrice! * current[2];
            }
            else {
                return total + current[1].unitPrice * current[2];
            }
        }, 0)!);

        // @ts-ignore
        setIsCartValid(cartItems?.reduce((isValid, current) => {
            if (!isValid) {
                return false;
            }
            else if (current[1].isDiscontinued) {
                return false;
            }
            else {
                return current[2] <= current[1].quantity;
            }
        }, true)!);
    }, [cartItems]);

    return (
        <Row className={'col-9 mx-auto my-3'}>
            <Card className={'col-xl-8 col-md-12 px-0'}>
                <CardHeader>
                    <h2 className={'my-auto'}>Cart</h2>
                </CardHeader>
                <div>
                    {cartItems && cartItems.map((item: [string, ProductType, number]) => {
                        return <CartItem key={item[0]} id={item[0]} product={item[1]} quantity={item[2]} setCartItems={setCartItems}/>;
                    })}
                </div>
            </Card>
            <Col xl={3}>
                <Card className={'ms-4 text-center p-4'}>
                    <h6>Total amount: ${totalPrice && totalPrice.toFixed(2)}</h6>
                    {/*TODO redirect to checkout*/}
                    <Form>
                        <Button variant={isCartValid ? 'success' : 'secondary'} disabled={!isCartValid}>Proceed to delivery</Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Cart;