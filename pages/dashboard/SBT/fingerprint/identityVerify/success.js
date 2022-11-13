import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Success() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
    }, []);

    return (
        <div>
            <h1>身分驗證郵件發送成功</h1>
            <p>請於移動裝置中閱讀所發送的驗證信件 . . .</p>
        </div>
    );
}