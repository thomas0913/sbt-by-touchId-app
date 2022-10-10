import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>SBT管理中心 | 主頁</title>
        <meta name='keywords' content='SBT-Management'/>
      </Head>
      <div>
        <h1 className={styles.title}>SBT管理中心</h1>
        <p className={styles.text}>此頁面簡介此APP之介紹</p>
        <p className={styles.text}>並且附上各個快速連結按鈕</p>
        <Link href="/user">
          <a className={styles.btn}>Click to login</a>
        </Link>
      </div>
    </>
  )
}
