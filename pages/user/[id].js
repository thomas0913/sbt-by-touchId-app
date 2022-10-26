import { useState, useEffect } from "react";
import base64url from "base64url";
import CBOR from "cbor";
import { ab2str } from "../../lib/arrayBuffer.js";

export const getStaticPaths = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();

    const paths = data.map((member) => {
        return {
            params: { id: member.id.toString() }
        }
    })

    return {
        paths,
        fallback: false
    };
}

export const getStaticProps = async (context) => {
    const id = context.params.id;
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data = await res.json();

    return {
        props: { account: data }
    }
}

export default function Details(props) {
    const [publicKeyCredentialCreation_options, setPublicKeyCredentialCreation_options] = useState(null);

    const signUp = async (data) => {
        try {
            navigator.credentials.create({
                publicKey: data
            })
                .then((pubKeyCredential) => {
                    console.log(pubKeyCredential);
                    const id = pubKeyCredential.id;
                    const rawId = pubKeyCredential.rawId;
                    const type = pubKeyCredential.type;
                    const response = pubKeyCredential.response;
                    const clientExtResults = pubKeyCredential.getClientExtensionResults();

                    //把arrayBuffer轉換成string，再把string轉換成base64編碼
                    const clientDataJSON_BASE64_ENCODED_STRING = base64url.encode(ab2str(response.clientDataJSON));
                    const attestationObject_BASE64_ENCODED_STRING = base64url.encode(response.attestationObject);
                    
                    const credential = {id, rawId, type, response, clientExtResults, clientDataJSON_BASE64_ENCODED_STRING, attestationObject_BASE64_ENCODED_STRING};
                    const options = {
                        method: "POST",
                        headers: {"Content-Type": "Application/json"},
                        body: JSON.stringify(credential)
                    };
                    fetch("http://localhost:7000/fingerprint-signUp", options)
                        .then(res => res.text())
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => {
                    console.log(err);
                })
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(()=> {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userID = 'Kosv9fPtkDoh4Oz7Yq/pVgWHS8HhdlCto5cR0aBoVMw=';
        const id = Uint8Array.from(window.atob(userID), (c) => {
            c.charCodeAt(0);
        });
        const publicKeyCredentialCreationOptions = {
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
            attestation: "direct" //server要求認證器回傳所有資訊
        };
        setPublicKeyCredentialCreation_options(publicKeyCredentialCreationOptions);
    }, []);

    return (
        <div>
            <h1>Details page by {props.account.name}</h1>
            <button onClick={() => {
                signUp(publicKeyCredentialCreation_options);
            }}>click me</button>
        </div>
    );
}