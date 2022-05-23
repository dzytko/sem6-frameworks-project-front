import React, {Dispatch, SetStateAction, useEffect} from 'react';
import './App.scss';
import {isTokenExpired} from './utils/jwt-utils';
import Layout from './components/Layout/Layout';
import {Route, Routes} from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AccountManagement from './components/AccountManagement/AccountManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProductPage from './components/ProductPage/ProductPage';
import Cart from './components/Cart/Cart';
import ProductsPage from './components/ProductsPage/ProductsPage';
import Checkout from './components/Checkout/Checkout';
import OrdersPage from './components/OrdersPage/OrdersPage';

export const TokenContext = React.createContext<{ token: string; setToken: Dispatch<SetStateAction<string>>; }>(
    {
        token: '',
        setToken: () => {
        }
    }
);

function App() {
    const [token, setToken] = React.useState<string>(localStorage.getItem('jwtToken') ?? '');

    useEffect(() => {
        document.title = 'ShopName';

        const checkToken = () => {
            if (!token) {
                return;
            }
            if (isTokenExpired(token)) {
                localStorage.removeItem('jwtToken');
                setToken('');
            }
        };
        checkToken();
    }, [token]);

    return (
        <TokenContext.Provider value={{token, setToken}}>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login redirectTo="/"/>}/>
                    <Route path="/register" element={<Register redirectTo="/login"/>}/>
                    <Route path="/product/:id" element={<ProductPage/>}/>
                    <Route path="/category/:selectedCategoryId" element={<ProductsPage/>}/>
                    <Route path="/" element={<ProductsPage/>}/>

                    <Route element={<ProtectedRoute/>}>
                        <Route path="/account" element={<AccountManagement/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/checkout" element={<Checkout/>}/>
                        <Route path="/orders" element={<OrdersPage/>}/>
                    </Route>
                </Routes>
            </Layout>
        </TokenContext.Provider>
    );
}

export default App;
