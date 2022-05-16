import React, {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from 'react';
import {CategoryType} from '../../types/CategoryType';
import {AxiosError, AxiosResponse} from 'axios';
import useAxios from '../../hooks/useAxios';
import {Collapse, ListGroup, NavLink} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SelectedCategoryIdContext} from './ProductsPage';

interface CategoryProps {
    category: CategoryType;
    setContainsSelectedCategoryParent?: Dispatch<SetStateAction<boolean>>;
}

const Category: FC<CategoryProps> = ({category, setContainsSelectedCategoryParent}) => {
    const [subCategories, setSubCategories] = useState<Array<CategoryType>>([]);
    const [collapsed, setCollapsed] = useState(true);
    const [containsSelectedCategory, setContainsSelectedCategory] = useState(false);
    const axios = useAxios();
    const selectedCategoryId = useContext(SelectedCategoryIdContext);

    useEffect(() => {
        axios.get('category/', {params: {'parent-id': category._id}})
            .then((response: AxiosResponse<CategoryType[]>) => {
                setSubCategories(response.data);
                if (category._id === selectedCategoryId) {
                    setContainsSelectedCategory(true);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (!containsSelectedCategory) {
            return;
        }

        setCollapsed(false);
        if (setContainsSelectedCategoryParent) {
            setContainsSelectedCategoryParent(true);
        }
    }, [containsSelectedCategory]);

    return (
        <>
            {subCategories.length ?
                <ListGroup.Item className={'px-0'}>
                    <div role={'button'} onClick={() => setCollapsed(prevState => !prevState)}>
                        <NavLink className={'text-black d-flex justify-content-between align-items-center'}>
                            <span>{category.categoryName}</span>
                            <FontAwesomeIcon icon={collapsed ? faPlusSquare : faMinusSquare}/>
                        </NavLink>
                    </div>
                    <Collapse in={!collapsed} className={'ps-3'}>
                        <ListGroup variant={'flush'}>
                            {subCategories && subCategories.map((category: CategoryType) => {
                                return (<Category category={category} setContainsSelectedCategoryParent={setContainsSelectedCategory} key={category._id}/>);
                            })}
                        </ListGroup>
                    </Collapse>
                </ListGroup.Item> :
                <ListGroup.Item>
                    <LinkContainer to={`/category/${category._id}`}>
                        <NavLink className={'px-0 text-black ' + (category._id == selectedCategoryId ? 'fw-bold' : '')}>
                            {category.categoryName}
                        </NavLink>
                    </LinkContainer>
                </ListGroup.Item>
            }
        </>
    );
};

export default Category;