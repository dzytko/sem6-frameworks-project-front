import React, {FC, useContext} from 'react';
import './MyNavbar.scss';
import {Nav, Navbar, NavDropdown, Form, Button, InputGroup, Col} from 'react-bootstrap';
import {TokenContext} from '../../App';
import {LinkContainer} from 'react-router-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';


interface NavbarProps {
}

const MyNavbar: FC<NavbarProps> = () => {
    const {token} = useContext(TokenContext);

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
                <Nav.Link onClick={logout} className={'text-dark dropdown-item'}>Logout</Nav.Link>
            </>
        );
    };

    const formik = useFormik({
        initialValues: {
            search: ''
        },
        onSubmit: values => {
            // TODO add search functionality
        },
    });

    return (
        <Navbar collapseOnSelect expand="lg" variant="light">
            <Col xs={12} xl={8} className={'px-3 px-lg-5 mx-auto d-flex justify-content-between'}>
                <LinkContainer to={'/'}>
                    <Navbar.Brand className="py-2">ShopName</Navbar.Brand>
                </LinkContainer>
                <Form onSubmit={formik.handleSubmit} className="w-100 py-1 mx-3 mx-lg-5 d-none d-sm-block">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            name="search"
                            onChange={formik.handleChange}
                            value={formik.values.search}
                            autoComplete="off"
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
                <Form onSubmit={formik.handleSubmit} className="w-100 py-1 mx-3 mx-lg-5 d-block d-sm-none">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            name="search"
                            onChange={formik.handleChange}
                            value={formik.values.search}
                            autoComplete="off"
                        />
                        <Button type="submit" variant="outline-primary">Search</Button>
                    </InputGroup>
                </Form>
            </Col>
        </Navbar>
    );
};

export default MyNavbar;