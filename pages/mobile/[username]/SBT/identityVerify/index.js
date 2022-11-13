import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import base64url from "base64url";
import { ethers } from 'ethers';
import { useSelector } from "react-redux";

import abi from "../../../../../smartContract/contracts/SBT_biometric.json";
import sbtMetadata from "../../../../../smartContract/metadata/sbt_metadata.json";
 
export default function IdentityVerify() {
    const [authenticateStatus, setAuthenticateStatus] = useState(false);
    const [userDetail_afterAuth, setUserDetail_afterAuth] = useState();
    const [userSbtContractAddress, setUserSbtContractAddress] = useState({ address: "" });
    const [userSbtId, setUserSbtId] = useState({ id: "" }); 
    const [userCred_fromSbt, setUserCred_fromSbt] = useState(null);
    const [userMetadata_fromSbt, setUserMetadata_fromSbt] = useState(null);

    const isNetworkOnTestChain = useSelector(states => states.accountStatus.wallet_network_status);
    const isWalletConnected = useSelector(states => states.accountStatus.wallet_status);
    const sbtUserAddress = useSelector(states => states.accountStatus.wallet_account);
    const permissionAllowed = useSelector(states => states.accountStatus.permission_status);
    const isContractManager = useSelector(states => states.accountStatus.isManager);

    const router = useRouter();
    const { username } = router.query;
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;

    const contractAddress = "0x087bd06dBd076c579400e144566069Bf1D00D0A3";
    const contractABI = abi;

    const import_user_sbt = async (event) => {
        event.preventDefault();
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const sbtContract = new ethers.Contract(userSbtContractAddress.address, contractABI, signer);

            /* 取得SBT之元數據 */
            const metadataURI = await sbtContract.tokenURI(userSbtId.id);
            await fetch(`${metadataURI}`, { method: 'GET' })
                .then(res => res.json())
                .then(res => setUserMetadata_fromSbt(res))

            /* 取得SBT之生物特徵數據 */
            const sbt_credential = await sbtContract.getUserCredential_byName(userSbtId.id, username);
            const sbt_credential_object = {
                credential: {
                    credentialID: sbt_credential[2],
                    credentialPublicKey: sbt_credential[3]
                },
                _id: sbt_credential[1]
            }
            setUserCred_fromSbt(sbt_credential_object);
            console.log("sbt info", { userMetadata_fromSbt, userCred_fromSbt });
        } catch (err) {
            console.log(err);
        }
    }

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
            <h1>身分認證</h1>
            {isWalletConnected && permissionAllowed && isContractManager === false
                ?   <alert color='success'>
                        SUCCESS : 歡迎使用代幣管理中心 ! ! !
                        {isWalletConnected && <div><span className="font-bold">您當前的錢包地址 : </span>{sbtUserAddress}</div>}
                        <br/>
                    </alert>
                :   <></>
            }
            <div>
                {permissionAllowed && isContractManager === false
                    ?   <div>
                            <form onSubmit={import_user_sbt}>
                                <div>
                                    <h3>SBT合約地址 :</h3>
                                    <input
                                        type="text"
                                        name='SBT contract address'
                                        placeholder='your SBT contract address (ex: 0x087bd06dBd076c579400e144566069Bf1D00D0A3)'
                                        onChange={(e) => setUserSbtContractAddress({address: e.target.value})}
                                        value={userSbtContractAddress.address}
                                    />
                                </div>
                                <div>
                                    <h3>SBT ID :</h3>
                                    <input
                                        type="text"
                                        name='SBT ID'
                                        placeholder='your SBT ID (ex: 1)'
                                        onChange={(e) => setUserSbtId({id: e.target.value})}
                                        value={userSbtId.id}
                                    />
                                </div>
                                <br/><br/>
                                <input type='submit' value="匯入我的SBT" />
                            </form>
                            <br/><br/><br/>
                        </div>
                    :   <div>
                            <alert color='warning'>
                                WARNNING : 權限不足 ! ! !
                                <br/><br/>
                            </alert>
                        </div>
                }
            </div>
            {userMetadata_fromSbt && userCred_fromSbt && (
                <div>
                <img src={`${userMetadata_fromSbt.image}`} alt="sbt image"/>
                    <alert>
                        <ul>
                            <li>用戶帳號名 : {username}</li>
                            <li>用戶ID : {userCred_fromSbt._id}</li>
                            <li>用戶以太坊錢包地址 : {sbtUserAddress}</li>
                            <li>用戶生物特徵數據ID : {userCred_fromSbt.credential.credentialID}</li>
                            <li>用戶生物特徵數據公鑰 : {userCred_fromSbt.credential.credentialPublicKey}</li>
                        </ul>
                        <br/><br/>
                    </alert>
                </div>
            )}
            <button onClick={() => authenticate()}>開始認證生物辨識數據</button>
            <br/>
            {authenticateStatus && <p>認證成功</p>}
        </div>
    );
}