import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import base64url from "base64url";
import { str2ab } from "../../../../lib/arrayBuffer";
 
export default function IdentityVerify() {
    const [publicKeyCredentialRequestOptions, setPublicKeyCredentialRequestOptions] = useState();

    const router = useRouter();
    const { username } = router.query;

    const authenticate = async () => {
        try{
            await getCredId();

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            })
                .then((getAssertionResponse) => {
                    alert('SUCCESSFULLY GOT AN ASSERTION! Open your browser console!');
                    console.log('SUCCESSFULLY GOT AN ASSERTION!', getAssertionResponse);
                })
                .catch((error) => {
                    alert('Open your browser console!');
                    console.log('FAIL', error)
                })

            console.log(assertion);
        }
        catch(err) {
            console.log(err);
        }
    }
 
    const getCredId = async () => {
        try{
            await fetch("https://sbt-manage-node-server.herokuapp.com/identityVerify_sbt/return_credId", {
                method: "POST",
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify({username})
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);

                    const challenge = new Uint8Array(32);
                    window.crypto.getRandomValues(challenge);
                    let credentialId = res[0].user_AuthData.credIdBuffer;
                    credentialId = str2ab(credentialId);
                    console.log(credentialId);

                    setPublicKeyCredentialRequestOptions({
                        challenge,
                        allowCredentials: [{
                            id: credentialId, // from registration
                            type: 'public-key',
                            transports: ['internal'],
                        }],
                        timeout: 60000,
                    });
                    console.log(publicKeyCredentialRequestOptions);
                })
                .catch(err => console.log(err))
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1>身分認證</h1>
            <button onClick={() => authenticate()}>開始認證生物辨識數據</button>
        </div>
    );
}