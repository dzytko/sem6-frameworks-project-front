import React, {useEffect} from 'react';
import {OrderType} from '../../types/OrderType';
import useAxios from '../../hooks/useAxios';
import {Accordion, Row} from 'react-bootstrap';
import Order from '../../types/Order';

interface OrdersPageProps {
}

const OrdersPage: React.FC<OrdersPageProps> = () => {
    const [orders, setOrders] = React.useState<Array<OrderType>>([]);
    const [selectedOrder, setSelectedOrder] = React.useState<OrderType | null>(null);
    const axios = useAxios();

    useEffect(() => {
        axios.get('/order')
            .then(({data}) => {
                setOrders(data);
            });
    }, []);

    return (
        <Row className={'col-9 mx-auto mt-3 pb-5'}>
            <Accordion>
                {orders && orders.map((order: OrderType) => (
                    <Order key={order._id} order={order}/>
                ))}
            </Accordion>
        </Row>
    );
};

export default OrdersPage;