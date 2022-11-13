import Head from 'next/head';
import Link from "next/link";
import styles from "../../../styles/Home.module.css";

export default function SBT() {
    return (
        <>
            <Head>
                <title>SBT管理中心 | SBT專區</title>
            </Head>
            <div>
                <h1 className={styles.title}>SBT專區</h1>
                <Link href="/dashboard/SBT/fingerprint/signUp"><a className={styles.btn}>SBT註冊</a></Link>
                <Link href="/dashboard/SBT/fingerprint/identityVerify"><a className={styles.btn}>SBT驗證</a></Link>
                <Link href="/dashboard/SBT/fingerprint/deleteAccount"><a className={styles.btn}>SBT註銷</a></Link>
            </div>
        </>
    );
}
