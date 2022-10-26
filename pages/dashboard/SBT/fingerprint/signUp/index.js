import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function SignUp() {
    const [username, setUsername] = useState({name: ""});
    const [userEmail, setUserEmail] = useState({email: ""});

    const router = useRouter();

    const register_SBT = async (event) => {
        event.preventDefault();
        try{
            const user = {
                name: username.name,
                email: userEmail.email
            }

            await fetch("http://localhost:7000/email/register_sbt", {
                method: 'POST',
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify(user)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.message) {
                        console.log(res.message);
                        router.push('/dashboard/SBT/fingerprint/signUp/success');
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
           <h1>SBT註冊</h1>
           <form onSubmit={register_SBT}>
                <input
                    type="text"
                    name='username'
                    placeholder='your username'
                    onChange={(e) => setUsername({name: e.target.value})}
                    value={username.name}
                />
                <br/><br/>
                <input
                    type="text"
                    name='email'
                    placeholder='your email (ex: 408440021@gms.tku.edu.tw)'
                    onChange={(e) => setUserEmail({email: e.target.value})}
                    value={userEmail.email}
                />
                <br/><br/>
                <input type='submit' value="start to sign" />
           </form>
           {/* <button onClick={register_SBT}>start to sign</button> */}
        </div>
    );
}