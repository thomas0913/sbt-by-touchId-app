import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function FingerPrint_success() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard/SBT/fingerprint/signUp/sbt_mint');
        }, 3000);
    }, []);

    return (
        <div>
            <h1>身分註冊郵件發送成功</h1>
            <p>即將進行靈魂綁定代幣鑄造程序 . . .</p>
        </div>
    );
}