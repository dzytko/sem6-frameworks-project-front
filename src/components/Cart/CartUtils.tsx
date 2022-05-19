import {ProductType} from '../../types/ProductType';
import {AxiosInstance, AxiosResponse} from 'axios';


export const getCartItems = async (axios: AxiosInstance) => {
    const cartResponse = await axios.get('/cart-item/');

    let carItemsTmp: Array<[string, ProductType, number]> = [];
    for (const item of cartResponse.data) {
        await axios.get(`/product/${item.productId}`)
            .then((response: AxiosResponse) => {
                carItemsTmp.push([item._id, response.data, item.quantity]);
            });
    }
    return carItemsTmp;
};

export const checkIsCartValid = (cartItems: Array<[string, ProductType, number]>) => {
    return cartItems.reduce((isValid, current) => {
        if (!isValid) {
            return false;
        }
        else if (current[1].isDiscontinued) {
            return false;
        }
        else {
            return current[2] <= current[1].quantity;
        }
    }, true)!;
};

export const getTotalPrice = (cartItems: Array<[string, ProductType, number]>) => {
    return cartItems.reduce((total, current) => {
        if (current[1].isDiscontinued) {
            return total;
        }
        else if (current[1].isDiscounted) {
            return total + current[1].discountedUnitPrice! * current[2];
        }
        else {
            return total + current[1].unitPrice * current[2];
        }
    }, 0);
};
