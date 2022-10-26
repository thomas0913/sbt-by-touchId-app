import { useState, useEffect } from 'react';
import base64url from "base64url";
import { publicKeyCredentialToJSON } from "../../../../lib/webauthn/helpers";
import { useRouter } from 'next/router';

export default function SignUp() {
    const [publicKeyCredentialCreationOptions, setPublicKeyCredentialCreationOptions] = useState(); //此為伺服器提供之憑證指定格式
    const [publicKeyCredential, setPublicKeyCredential] = useState(); //註冊人之公鑰憑證
    const [registeringStatus, setRegisteringStatus] = useState(false);

    const router = useRouter();
    const { username } = router.query;
    
    //註冊公鑰生成器
    const registerCredential = async () => {
        try{
            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            })
                .then(key => publicKeyCredentialToJSON(key))
                .then(key => {
                    console.log(key);
                    setPublicKeyCredential(key);
                    const userCred = {
                        name: username,
                        key: key
                    }
                    fetch("https://sbt-manage-node-server.herokuapp.com/register_sbt", {
                        method: "POST",
                        headers: {"Content-Type": "Application/json"},
                        body: JSON.stringify(userCred)
                    })
                        .then(res => res.text())
                        .then(res => {
                            console.log(res);
                            if (res === "registering success") {
                                setRegisteringStatus(true);
                            }
                            else {
                                setRegisteringStatus(false);
                            }
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        }
        catch(err) {
            console.log(err);
        }
    };

    /* 利用公鑰數據注入SBT智能合約中 */

    useEffect(() => {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userID = 'Kosv9fPtkDoh4Oz7Yq/pVgWHS8HhdlCto5cR0aBoVMw=';
        const id = Uint8Array.from(window.atob(userID), (c) => {
            c.charCodeAt(0);
        });
        setPublicKeyCredentialCreationOptions({
            challenge,
            rp: {
                name: "SBT node server",
                id: "localhost", //目前網站之網域名稱
            },
            user: {
                id, //使用者之註冊資訊
                name: "thomas408440021@gms.tku.edu.tw",
                displayName: "Thomas",
            },
            pubKeyCredParams: [ //server可支援之公鑰類型
                {alg: -7, type: "public-key"},
                {alg:-257, type: "public-key"}
            ],
            authenticatorSelection: { //optional
                authenticatorAttachment: "platform", //TouchID
                userVerification: "required",
                requireResidentKey: false,
            },
            timeout: 60000, //超時則認證失敗
            attestation: "none" //server要求認證器回傳所有資訊
        });
    }, []);

    useEffect(() => {
        if (registeringStatus === true) {
            router.push(`/mobile/${username}/SBT/identityVerify`);
        }
    }, [registeringStatus]);

    return(
        <div>
            <h1>身分註冊</h1>
            
            <button onClick={() => registerCredential()}>開始註冊生物辨識數據</button>
        </div>
    );
}