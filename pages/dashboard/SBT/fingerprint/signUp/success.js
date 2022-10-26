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
            <h1>身分註冊郵件發送成功</h1>
            <p>請於移動裝置中閱讀所發送的註冊信件 . . .</p>
        </div>
    );
}