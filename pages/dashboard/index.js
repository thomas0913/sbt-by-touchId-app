import Head from 'next/head';
import Link from "next/link";
import styles from "../../styles/Home.module.css";

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>SBT管理中心 | 監控版</title>
            </Head>
            <div>
                <h1 className={styles.title}>監控版</h1>
                <Link href="/dashboard/SBT"><a className={styles.btn}>SBT專區</a></Link>
                <Link href="/dashboard/NFT"><a className={styles.btn}>NFT專區</a></Link>
            </div>
        </>
    );
}
