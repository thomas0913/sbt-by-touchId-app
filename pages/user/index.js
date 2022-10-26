import React, {  useEffect, useState } from "react";
import styles from "../../styles/User.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import {useSelector, useDispatch} from "react-redux";

export const getStaticProps = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    return {
        props: { account: data }
    }
}

export default function CheckIfLoginOrNot(props) {
    //const [alreadyLogin, setAlreadyLogin] = useState(false);

    const router = useRouter();

    const alreadyLogin = useSelector(states => states.accountStatus.alreadylogin_state);

    useEffect(() => {
        if (alreadyLogin === true) {
            router.push('/user/dashboard');
        }
        else {
            console.log("帳號未登入");
            router.push('/user/login');
        }
    }, []);
    
    /*
    return (
        <div>
            <h1>我要登入</h1>
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
    */
}