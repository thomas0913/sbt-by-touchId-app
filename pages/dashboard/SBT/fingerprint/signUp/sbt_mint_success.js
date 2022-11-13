import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Sbt_mint_success() {
    const router = useRouter();

    /* 如果SBT鑄造成功，則發送 Email 至客戶與管理者 */

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    }, []);

    return (
        <div>
            <h1>靈魂綁定代幣鑄造成功</h1>
            <p>即將重新導向至監控台 . . .</p>
        </div>
    );
}