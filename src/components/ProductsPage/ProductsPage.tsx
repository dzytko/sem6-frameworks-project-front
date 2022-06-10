import React, {createContext, FC, useEffect, useState} from 'react';
import {ProductType} from '../../types/ProductType';
import {CategoryType} from '../../types/CategoryType';
import useAxios from '../../hooks/useAxios';
import {AxiosError, AxiosResponse} from 'axios';
import {Col, Form, ListGroup, Pagination, Row} from 'react-bootstrap';
import Category from './Category';
import Product from './Product';
import {useFormik} from 'formik';
import {useParams} from 'react-router-dom';

export const SelectedCategoryIdContext = createContext('');

interface ProductsPageProps {
}

const ProductsPage: FC<ProductsPageProps> = () => {
    const {selectedCategoryId} = useParams();
    const [products, setProducts] = useState<Array<ProductType>>([]);
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [sortBy, setSortBy] = useState('productName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(0);
    const [productsTotalCount, setProductsTotalCount] = useState(-1);
    const axios = useAxios();

    const pageSize = 16;

    const formik = useFormik({
        initialValues: {
            sort: ''
        },
        onSubmit: (values) => {
        },
    });

    useEffect(() => {
        const [sortByField, sortByOrder] = formik.values.sort.split('-');
        setSortBy(sortByField);
        setSortOrder(sortByOrder);
        setCurrentPage(0);
    }, [formik.values.sort]);

    useEffect(() => {
        (async () => {
            const rootCategoryId = (await axios.get('category/', {params: {'parent-id': 'null'}})).data[0]._id as string;
            axios.get('category/', {params: {'parent-id': rootCategoryId}})
                .then((response: AxiosResponse<CategoryType[]>) => {
                    setCategories(response.data);
                })
                .catch((error: AxiosError) => {
                    console.log(error);
                });
        })();
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                'Range': `products=${currentPage * pageSize}-${(currentPage + 1) * pageSize - 1}`
            },
            params: {
                // for some reason sortBy is not set on initial request
                'sort-by': sortBy || 'productName',
                'order-by': sortOrder || 'asc',
            }
        };

        if (selectedCategoryId) {
            // @ts-ignore
            config.params['category-id'] = selectedCategoryId;
        }
        axios.get('product/', config)
            .then((response: AxiosResponse) => {
                setProducts(response.data);
                const total = response.headers['content-range'].split('/')[1];
                setProductsTotalCount(parseInt(total));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [currentPage, sortBy, sortOrder, selectedCategoryId]);

    return (
        <Row className={'justify-content-center'}>
            <Col className={'row'} md={9}>
                <Col lg={3} className={'pe-2'}>
                    <div className={'card card-body'}>
                        <SelectedCategoryIdContext.Provider value={selectedCategoryId ?? ''}>
                            <ListGroup variant={'flush'}>
                                {categories && categories.map((category: CategoryType) => {
                                    return (<Category category={category} key={category._id}/>);
                                })}
                            </ListGroup>
                        </SelectedCategoryIdContext.Provider>
                    </div>
                </Col>
                <Col lg={9} className={'row row-cols-4'}>
                    <Col lg={12} className={'my-0 py-1 d-flex flex-row-reverse'}>
                        <Form>
                            <Form.Select name={'sort'} onChange={formik.handleChange}>
                                <option value={'productName-asc'}>Name: A-Z</option>
                                <option value={'productName-desc'}>Name: Z-A</option>
                                <option value={'price-asc'}>Price: ascending</option>
                                <option value={'price-desc'}>Price: descending</option>
                            </Form.Select>
                        </Form>
                    </Col>
                    {products && products.map((product: ProductType) => {
                        return (<Product key={product._id} product={product}/>);
                    })}
                </Col>

                <Pagination className={'pt-3 d-flex justify-content-center'}>
                    {[...Array(Math.ceil(productsTotalCount / pageSize))].map((_, i) => {
                        return (<Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                            {i + 1}
                        </Pagination.Item>);
                    })}
                </Pagination>
            </Col>
        </Row>
    );
};

export default ProductsPage;