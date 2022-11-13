import React, { useEffect } from "react";
import Link from "next/link";
import Head from 'next/head';
import { useRouter } from "next/router";

export default function NotFound404() {

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 3000);
    }, []);

    return (
        <>
            <Head>
                <title>SBT管理中心 | 404</title>
            </Head>
            <div className="not-found">
                <h1>Ooooops.....</h1>
                <h2>That page cannot be found.</h2>
                <p>Go back to the <Link href="/"><a>Home</a></Link></p>
            </div>
        </>
    );
}
