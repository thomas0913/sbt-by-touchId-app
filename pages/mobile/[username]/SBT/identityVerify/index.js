import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import base64url from "base64url";
import styles from "../../../../../styles/Home.module.css";
 
export default function IdentityVerify() {
    const [authenticateStatus, setAuthenticateStatus] = useState(false);
    const [userDetail_afterAuth, setUserDetail_afterAuth] = useState();
    const [userCred_fromSbt, setUserCred_fromSbt] = useState(null);

    const router = useRouter();
    const { username } = router.query;
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;

    const getUserCred_fromSbt = async () => {
        await fetch(`${origin}/getUserData`, {
            method: 'POST',
            headers: {
                'content-type': 'Application/Json'
            },
            body: JSON.stringify({ username })
        })
            .then(res => res.json())
            .then(res => setUserCred_fromSbt(res))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUserCred_fromSbt();
    }, [username]);

    useEffect(() => {
        console.log(userCred_fromSbt);
    }, [userCred_fromSbt]);

    const authenticate = async () => {
        try{
            /*
            const user_historyData_request = await fetch(`${origin}/getUserData`, {
                method: 'POST',
                headers: {
                    'content-type': 'Application/Json'
                },
                body: JSON.stringify({ username })
            })
                .then(res => res.json())
            console.log(user_historyData_request);
            */
            const user_historyData_request = userCred_fromSbt;

            /* 取得挑戰 */
            const credId = localStorage.getItem(`credId`);
            const options = await fetch(`${origin}/signinRequest?credId=${encodeURIComponent(credId)}`, {
                method: 'POST',
                headers: {
                    'content-type': 'Application/Json'
                },
                body: JSON.stringify({ username, user_historyData_request })
            })
                .then(result => result.json())

            /* 檢查用戶是否已註冊 */
            if (options.allowCredentials.length === 0) {
                console.info('No registered credentials found.');
                return Promise.resolve(null);
            }

            //因為瀏覽器與驗證器之交互驅動只接受二進制編碼，因此要把credentialID與challenge轉回arrayBuffer型態
            options.challenge = base64url.toBuffer(options.challenge);
            options.allowCredentials[0].id = base64url.toBuffer(base64url.decode(options.allowCredentials[0].id));
            
            /* 瀏覽器與驗證器之交互並產生驗證結果 */
            const cred = await navigator.credentials.get({
                publicKey: options,
            })
                .then( async (cred) => {
                    const credential = {};
                    credential.id = cred.id;
                    credential.type = cred.type;
                    credential.rawId = base64url.encode(cred.rawId);
                    if (cred.response) {
                        const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
                        const authenticatorData = base64url.encode(cred.response.authenticatorData);
                        const signature = base64url.encode(cred.response.signature);
                        const userHandle = base64url.encode(cred.response.userHandle);
                        credential.response = {
                            clientDataJSON,
                            authenticatorData,
                            signature,
                            userHandle,
                        };
                    }

                    
                    const user_historyData = await fetch(`${origin}/getUserData`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'Application/Json'
                        },
                        body: JSON.stringify({ username })
                    })
                        .then(res => res.json())
                    console.log(user_historyData);
                    
                    const user_historyData_response =  userCred_fromSbt;
                    user_historyData_response.init_challenge = user_historyData.init_challenge;

                    user_historyData_response.credential.credentialID = base64url.fromBase64(user_historyData_response.credential.credentialID);

                    const credential_response = {
                        name: username,
                        credential,
                        user_historyData_response
                    }

                    /* 回傳給依賴端驗證解析驗證 */
                    fetch(`${origin}/signinResponse`, {
                        method: "POST",
                        headers: {"Content-Type": "Application/json"},
                        body: JSON.stringify(credential_response)
                    })
                        .then(res => res.json())
                        .then(res => {
                            console.log(res);
                            if (res.success) {
                                setUserDetail_afterAuth(res.user);
                                setAuthenticateStatus(true);
                            }
                            else {
                                setAuthenticateStatus(false);
                            }
                        })
                        .catch(err => console.log(err))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1 className={styles.title}>指紋驗證</h1>
            <button onClick={() => authenticate()}>開始驗證生物辨識數據</button>
            <br/>
            {authenticateStatus && <p>✅ 驗證成功</p>}
        </div>
    );
}