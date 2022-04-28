import React, {FC} from 'react';
import {Nav, Tab, Card, Col, Row} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/CardHeader';
import './AccountManagement.scss';
import UpdateAccountInfoForm from './UpdateAccountInfoForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';

interface accountManagementProps {
}

const AccountManagement: FC<accountManagementProps> = () => {
    return (
        <Col xl={6} lg={8} md={9} sm={12} className="mx-auto py-3">
            <Card>
                <CardHeader>Account management</CardHeader>
                <Card.Body>
                    <Col>
                        <Tab.Container defaultActiveKey="update_information">
                            <Row>
                                <Col sm={4} xl={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="update_information">Update information</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="update_password">Update password</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="delete_account" className="red">Delete account</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={8} xl={9}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="update_information">
                                            <UpdateAccountInfoForm/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="update_password">
                                            <UpdatePasswordForm/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="delete_account">
                                            <DeleteAccountForm/>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Col>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default AccountManagement;