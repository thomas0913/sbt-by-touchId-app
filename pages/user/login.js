import Head from 'next/head';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { accountLoginSuccess } from '../../redux/action/accountStatus';
import styles from "../../styles/Home.module.css";

export default function Login() {

    const dispatch = useDispatch();

    return (
        <>
            <Head>
                <title>SBT管理中心 | 登入</title>
            </Head>
            <div>
                <h1 className={styles.title}>管理員登入</h1>
                <br/><br/>
                <Link href="/dashboard">
                    <a className={styles.btn} onClick={() => {dispatch(accountLoginSuccess());}}>測試登入</a>
                </Link>
            </div>
        </>
    );
}