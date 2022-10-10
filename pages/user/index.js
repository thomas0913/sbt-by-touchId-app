import React, {  useEffect } from "react";
import styles from "../../styles/User.module.css";
import Link from "next/link";

export const getStaticProps = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    return {
        props: { account: data }
    }
}

export default function Login(props) {

    return (
        <div>
            <h1>登入</h1>
            {
                props.account.map((data) => (
                    <Link key={data.id} href={`/user/${data.id}`}>
                        <a className={styles.single}>
                            <h3>{ data.name }</h3>
                        </a>
                    </Link>
                ))
            }
        </div>
    );
}