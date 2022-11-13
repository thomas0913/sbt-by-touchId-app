import { useState, useEffect } from 'react';
import base64url from "base64url";
import { publicKeyCredentialToJSON } from "../../../../../lib/webauthn/helpers";
import { useRouter } from 'next/router';
import styles from "../../../../../styles/Home.module.css";

export default function SignUp() {
    const [registeringStatus, setRegisteringStatus] = useState(false);

    const router = useRouter();
    const { username } = router.query;
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;
    
    //註冊公鑰生成器
    const registerCredential = async () => {
        try{
            /* 取得挑戰與用戶ID */
            const publicKeyCredentialCreationOptions = await fetch(`${origin}/registerRequest`, {
                method: 'POST',
                headers: {
                    'content-type': 'Application/Json'
                },
                body: JSON.stringify({ username })
            })
                .then(response => response.json())
            //因為瀏覽器與驗證器之交互驅動只接受二進制編碼，因此要把userID與challenge轉回arrayBuffer型態
            publicKeyCredentialCreationOptions.user.id = base64url.toBuffer(publicKeyCredentialCreationOptions.user.id);
            publicKeyCredentialCreationOptions.challenge = base64url.toBuffer(publicKeyCredentialCreationOptions.challenge);
            /* 瀏覽器與驗證器之交互並產生公鑰 */
            await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            })
                .then((cred) => {
                    const utf8Decoder = new TextDecoder('utf-8');
                    const decodedClientData = utf8Decoder.decode(cred.response.clientDataJSON)
                    // parse the string as an object
                    const clientDataObj = JSON.parse(decodedClientData);
                    console.log(clientDataObj);
                    //因初始公鑰二進制型態不方便回傳至依賴端，所以在此轉為字串型態
                    const credential = publicKeyCredentialToJSON(cred);
                    localStorage.setItem(`credId`, credential.id);
                    const credential_response = {name: username, credential};
                    /* 回傳公鑰給依賴端驗證解析驗證並儲存 */
                    fetch(`${origin}/registerResponse`, {
                        method: "POST",
                        headers: {"Content-Type": "Application/json"},
                        body: JSON.stringify(credential_response)
                    })
                        .then(res => res.text())
                        .then(res => {
                            console.log(res);
                            if (res === "registering success") setRegisteringStatus(true);
                            else setRegisteringStatus(false);
                        })
                        .catch(err => console.log(err))
                })
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (registeringStatus === true) {
            router.push(`/mobile/${username}/SBT/signUp/success`);
        }
    }, [registeringStatus]);

    return(
        <div>
            <h1 className={styles.title}>指紋註冊</h1>
            <button onClick={() => registerCredential()}>開始註冊生物辨識數據</button>
        </div>
    );
}