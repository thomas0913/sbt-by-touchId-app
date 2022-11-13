import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { accountLoginFail } from '../../redux/action/accountStatus';
import styles from "../../styles/Home.module.css";

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
        <>
            <Head>
                <title>SBT管理中心 | 登出</title>
            </Head>
            <div>
                <h1 className={styles.title}>登出</h1>
            </div>
        </>
    );
}
