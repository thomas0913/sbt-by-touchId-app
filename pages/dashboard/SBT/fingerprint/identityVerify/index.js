import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { ethers } from 'ethers';
import { useSelector } from "react-redux";
import styles from "../../../../../styles/Home.module.css";

import abi from "../../../../../smartContract/contracts/SBT_biometric.json";
import sbtMetadata from "../../../../../smartContract/metadata/sbt_metadata.json";

export default function IdentityVerify() {
    const [username, setUsername] = useState({name: ""});
    const [username_check, setUsername_check] = useState({name: ""});
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
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;

    const contractAddress = "0x42615207546fC235ff8d33c046EeC96C4bbAbF94";
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
            const sbt_credential = await sbtContract.getUserCredential_byName(userSbtId.id, username.name);
            console.log(sbt_credential);
            const sbt_credential_object = {
                credential: {
                    credentialID: sbt_credential[2],
                    credentialPublicKey: sbt_credential[3]
                },
                _id: sbt_credential[1]
            }
            setUserCred_fromSbt(sbt_credential_object);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log("sbt info", { userMetadata_fromSbt, userCred_fromSbt });
    }, [userMetadata_fromSbt, userCred_fromSbt]);

    /* 發送驗證電子郵件 */
    const identityVerify_SBT = async (event) => {
        event.preventDefault();
        try{
            await fetch(`${origin}/email/identityVerify_sbt`, {
                method: 'POST',
                headers: {"Content-Type": "Application/json"},
                body: JSON.stringify({ username, userCred_fromSbt })
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
           <h1 className={styles.title}>靈魂驗證程序</h1>
           {isWalletConnected && permissionAllowed && isContractManager === false
                ?   <alert color='success'>
                        SUCCESS : 歡迎使用SBT管理中心 ! ! !
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
                                    <h3>Username :</h3>
                                    <input
                                        type="text"
                                        name='username'
                                        placeholder='the text of your username'
                                        onChange={(e) => setUsername({name: e.target.value})}
                                        value={username.name}
                                    />
                                </div>
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
                <img src={`${userMetadata_fromSbt.image}`} alt="sbt image" style={{width: "30%"}}/>
                    <alert>
                        <ul>
                            <li>用戶帳號名 : {username.name}</li>
                            <li>用戶ID : {userCred_fromSbt._id}</li>
                            <li>用戶以太坊錢包地址 : {sbtUserAddress}</li>
                            <li>用戶生物特徵數據ID : {userCred_fromSbt.credential.credentialID}</li>
                            <li>用戶生物特徵數據公鑰 : {userCred_fromSbt.credential.credentialPublicKey}</li>
                        </ul>
                        <br/><br/>
                    </alert>
                </div>
            )}
            <form onSubmit={identityVerify_SBT}>
                <div>
                    <h3>Username Check :</h3>
                    <input
                        type="text"
                        name='username'
                        placeholder='the text of your username'
                        onChange={(e) => setUsername_check({name: e.target.value})}
                        value={username_check.name}
                    />
                </div>
                <br/>
                <input type='submit' value="提出驗證申請" />
            </form>
        </div>
    );
}