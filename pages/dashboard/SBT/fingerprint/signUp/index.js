import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { storingUsername, storingUserWalletAddress } from "../../../../../redux/action/sbt_user";
import styles from "../../../../../styles/Home.module.css";

export default function SignUp() {
    const [username, setUsername] = useState({name: ""});
    const [userEmail, setUserEmail] = useState({email: ""});
    const [userWalletAddress, setUserWalletAddress] = useState({address: ""});

    const router = useRouter();
    const dispatch = useDispatch();
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;

    const register_SBT = async (event) => {
        event.preventDefault();
        try{
            dispatch(storingUsername(username.name));
            dispatch(storingUserWalletAddress(userWalletAddress.address));
            const user = {
                name: username.name,
                email: userEmail.email,
                walletAddress: userWalletAddress.address,
                biometric_register_status: false
            }

            await fetch(`${origin}/email/register_sbt`, {
                method: 'POST',
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify(user)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.message) {
                        console.log(res.message);
                        router.push('/dashboard/SBT/fingerprint/signUp/fingerPrint_success');
                    }
                    else {
                        console.log(res);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        catch(err) {
            console.log(err);
        }
    };

    return (
        <div>
           <h1 className={styles.title}>靈魂註冊程序</h1>
           <form onSubmit={register_SBT}>
                <div>
                    <h3>帳號名稱 :</h3>
                    <input
                        type="text"
                        name='username'
                        placeholder='your username'
                        onChange={(e) => setUsername({name: e.target.value})}
                        value={username.name}
                    />
                </div>
                <div>
                    <h3>電子郵件信箱 :</h3>
                    <input
                        type="text"
                        name='email'
                        placeholder='your email (ex: 408440021@gms.tku.edu.tw)'
                        onChange={(e) => setUserEmail({email: e.target.value})}
                        value={userEmail.email}
                    />
                </div>
                <div>
                    <h3>以太坊錢包地址 :</h3>
                    <input
                        type="text"
                        name='wallet_address'
                        placeholder='your wallet address (ex: 0x57903759493b5C0982F91c478FF24a06163f089B)'
                        onChange={(e) => setUserWalletAddress({address: e.target.value})}
                        value={userWalletAddress.address}
                    />
                </div>
                <br/><br/>
                <input type='submit' value="提出註冊申請" />
           </form>
        </div>
    );
}