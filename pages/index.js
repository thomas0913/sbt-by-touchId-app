import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useSelector } from "react-redux";

export default function Home() {

  const alreadyLogin = useSelector(states => states.accountStatus.alreadylogin_state);

  return (
    <>
      <Head>
        <title>SBT管理中心 | 主頁</title>
        <meta name='keywords' content='SBT-Management'/>
      </Head>
      <div>
        <h1 className={styles.title}>SBT管理中心</h1><br/>
        <p className={styles.text}>歡迎使用代幣管理中心</p><br/><br/>
        {alreadyLogin === true
          ? <Link href="/user/logout">
              <a className={styles.btn}>Click to logout</a>
            </Link>
          : <Link href="/user/login">
              <a className={styles.btn}>Click to login</a>
            </Link>
        }
      </div>
    </>
  )
}
