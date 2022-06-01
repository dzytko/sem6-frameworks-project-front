import React, {FC, useCallback, useContext, useState} from 'react';
import './MyNavbar.scss';
import {Button, Col, Form, InputGroup, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {TokenContext} from '../../App';
import {LinkContainer} from 'react-router-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart, faUser} from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import useAxios from '../../hooks/useAxios';
import {useNavigate} from 'react-router-dom';
import {AxiosResponse} from 'axios';


const logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
};

const getAuthLinks = () => {
    return (
        <>
            <LinkContainer to="/login" className={'text-dark'}>
                <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register" className={'text-dark'}>
                <Nav.Link>Register</Nav.Link>
            </LinkContainer>
        </>
    );
};

const getUserLinks = () => {
    return (
        <>
            <LinkContainer to="/account" className={'text-dark dropdown-item'}>
                <Nav.Link>Account management</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/orders" className={'text-dark dropdown-item'}>
                <Nav.Link>Orders</Nav.Link>
            </LinkContainer>
            <Nav.Link onClick={logout} className={'text-dark dropdown-item'}>Logout</Nav.Link>
        </>
    );
};

interface NavbarProps {
}

const MyNavbar: FC<NavbarProps> = () => {
    const {token} = useContext(TokenContext);
    const axios = useAxios();
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            search: ''
        },
        onSubmit: (values) => {
            console.log(values);
            axios.get(`product?search=${values.search}`)
                .then((response: AxiosResponse) => {
                    navigate(`/product/${response.data[0]._id}`)
                });
        }
    });

    const handleSearch = useCallback((q: string) => {
        axios.get(`product?search=${q}`)
            .then(res => {
                setOptions(res.data.map((p: any) => ({id: p._id, name: p.productName})));
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <Navbar collapseOnSelect expand="lg" variant="light">
            <Col xs={12} xl={8} className={'px-3 px-lg-5 mx-auto d-flex justify-content-between'}>
                <LinkContainer to={'/'}>
                    <Navbar.Brand className="py-2">ShopName</Navbar.Brand>
                </LinkContainer>
                <Form onSubmit={formik.handleSubmit} className="w-100 py-1 mx-3 mx-lg-5 d-sm-block">
                    <InputGroup>
                        {/*<Form.Control*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Search"*/}
                        {/*    name="search"*/}
                        {/*    onChange={formik.handleChange}*/}
                        {/*    value={formik.values.search}*/}
                        {/*    autoComplete="off"*/}
                        {/*/>*/}

                        <AsyncTypeahead
                            className={'ms-4 col-lg-10'}
                            id="async-pagination-example"
                            isLoading={false}
                            labelKey="name"
                            maxResults={5}
                            minLength={2}
                            onSearch={handleSearch}
                            options={options}
                            placeholder="Search for a product"
                            onChange={(q: any) => formik.setFieldValue('search', q[0].name)}
                            renderMenuItemChildren={(option: any) => (
                                <div key={option.id}>
                                    <span>{option.name}</span>
                                </div>
                            )}
                            useCache={false}
                        />
                        <Button type="submit" variant="outline-primary">Search</Button>
                    </InputGroup>
                </Form>
                <div className="d-flex">
                    <NavDropdown title={<FontAwesomeIcon className={'text-dark'} icon={faUser} size={'2x'}/>}>
                        {token ? getUserLinks() : getAuthLinks()}
                    </NavDropdown>
                    <LinkContainer to={'/cart'}>
                        <FontAwesomeIcon className={'text-dark py-2'} icon={faShoppingCart} size={'2x'}/>
                    </LinkContainer>
                </div>
            </Col>
        </Navbar>
    );
};

export default MyNavbar;