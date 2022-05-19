import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/CardHeader';
import useAxios from '../../hooks/useAxios';
import CartItem from './CartItem';
import {ProductType} from '../../types/ProductType';
import {checkIsCartValid, getCartItems, getTotalPrice} from './CartUtils';
import {useNavigate} from 'react-router-dom';

interface cartProps {
}

const Cart: React.FC<cartProps> = () => {
    const [cartItems, setCartItems] = useState<Array<[string, ProductType, number]>>();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCartValid, setIsCartValid] = useState<boolean>(false);
    const axios = useAxios();
    const navigate = useNavigate();

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
                    <Form>
                        <Button variant={isCartValid ? 'success' : 'secondary'} disabled={!isCartValid} onClick={()=>{
                            navigate('/checkout');
                        }}>Proceed to delivery</Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Cart;