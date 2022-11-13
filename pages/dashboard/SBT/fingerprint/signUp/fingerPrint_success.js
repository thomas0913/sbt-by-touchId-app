import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../../../styles/Home.module.css";

export default function FingerPrint_success() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard/SBT/fingerprint/signUp/sbt_mint');
        }, 3000);
    }, []);

    return (
        <div>
            <h1 className={styles.title}>指紋註冊郵件發送成功</h1>
            <p>即將進行靈魂註冊程序 . . .</p>
        </div>
    );
}