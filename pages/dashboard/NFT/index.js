import Head from 'next/head';
import styles from "../../../styles/Home.module.css";

export default function NFT() {
    return (
        <>
            <Head>
                <title>SBT管理中心 | NFT專區</title>
            </Head>
            <div>
                <h1 className={styles.title}>NFT專區</h1>
            </div>
        </>
    );
}
