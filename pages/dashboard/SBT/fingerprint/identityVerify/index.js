import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function IdentityVerify() {
    const [username, setUsername] = useState({name: ""});

    const router = useRouter();
    const origin = process.env.NEXT_PUBLIC_LOCALHOST_SERVER_URL;

    const identityVerify_SBT = async (event) => {
        event.preventDefault();
        try{
            await fetch(`${origin}/email/identityVerify_sbt`, {
                method: 'POST',
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify({ username })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.message) {
                        console.log(res.message);
                        router.push('/dashboard/SBT/fingerprint/identityVerify/success');
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
           <h1>SBT驗證</h1>
           <form onSubmit={identityVerify_SBT}>
                <input
                    type="text"
                    name='username'
                    placeholder='your username'
                    onChange={(e) => setUsername({name: e.target.value})}
                    value={username.name}
                />
                <br/><br/>
                <input type='submit' value="提出驗證申請" />
           </form>
        </div>
    );
}