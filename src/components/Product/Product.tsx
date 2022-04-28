import React, {FC, useContext} from 'react';
import {Col, NavLink, Row, Card} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import useAxios from '../../hooks/useAxios';
import {useNavigate, useParams} from 'react-router-dom';
import CardHeader from 'react-bootstrap/CardHeader';


interface ProductProps {
}

const Product: FC<ProductProps> = () => {
    let {id} = useParams();
    const axios = useAxios();
    const navigate = useNavigate();

    let categories = [];

    return (
        <Row className={'justify-content-center'}>
            <Col className={'row'} md={9}>
                <div>
                    {/*TODO foreach here*/}
                    <LinkContainer to={'/'}><NavLink className="text-black">ShopName</NavLink></LinkContainer>
                </div>
                {/*TODO img here*/}
                <img className="col img-fluid" src={'https://via.placeholder.com/600x500'} alt={''}/>
                <Card className={'col px-0'}>
                    <CardHeader className={'py-2'}>
                        {/*TODO name here*/}
                        <h2>Product Name</h2>
                    </CardHeader>
                    <Card.Body>
                        <Row>
                            <Col className={'card'}>
                                <Card.Body>
                                    <h4>Props</h4>
                                    {/*TODO properties here*/}
                                </Card.Body>
                            </Col>
                            <Col className={'card'}>
                                <Card.Body>
                                    <h3>13131313</h3>
                                    {/*TODO price and stuff*/}
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Product;