import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav>
            <div className="logo">
                <Link href="/"><a><Image src="/ethereum.png" width={128} height={120}/></a></Link>
            </div>
            <Link href="/about"><a>About</a></Link>
            <Link href="/guide"><a>Guide</a></Link>
            <Link href="/user"><a>Login</a></Link>
        </nav>
    );
}