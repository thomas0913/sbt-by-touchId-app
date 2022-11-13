import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../../../styles/Home.module.css";

export default function Success() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    }, []);

    return (
        <div>
            <h1 className={styles.title}>指紋驗證郵件發送成功</h1>
            <p>請於Touch ID之移動裝置中閱讀所發送的驗證信件 . . .</p>
        </div>
    );
}