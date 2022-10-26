import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Navbar() {
    const alreadyLogin = useSelector(states => states.accountStatus.alreadylogin_state);

    return (
        <nav>
            <div className="logo">
                <Link href="/"><a><Image src="/ethereum.png" width={128} height={120}/></a></Link>
            </div>
            <Link href="/about"><a>About</a></Link>
            <Link href="/guide"><a>Guide</a></Link>
            {alreadyLogin === true
                ?   <>
                        <Link href="/user/dashboard"><a>DashBoard</a></Link>
                        <Link href="/user/logout"><a>Logout</a></Link>
                    </>
                :   <Link href="/user"><a>Login</a></Link>
            }
            
        </nav>
    );
}