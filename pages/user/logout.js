import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { accountLoginSuccess, accountLoginFail } from '../../redux/action/accountStatus';

export default function Logout() {

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(accountLoginFail());
            router.push('/');
        }, 3000);
    }, []);

    return (
        <div>
            <h1>登出</h1>
        </div>
    );
}