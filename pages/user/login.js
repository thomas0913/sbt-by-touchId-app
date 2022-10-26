import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { accountLoginSuccess, accountLoginFail } from '../../redux/action/accountStatus';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Login() {

    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <div>
            <Typography
                variant='h4'
                align='center'
                color="GrayText"
            >
                選擇登入方式
            </Typography>
            <Button
                variant='contained'
                color='primary'
                onClick={() => {
                    dispatch(accountLoginSuccess());
                    router.push('/dashboard');
                }}
            >
                指紋登入
            </Button>
        </div>
    );
}