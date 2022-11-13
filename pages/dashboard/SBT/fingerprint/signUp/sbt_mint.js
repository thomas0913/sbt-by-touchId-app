import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ethers } from 'ethers';

import abi from "../../../../../smartContract/contracts/SBT_biometric.json";
import sbtMetadata from "../../../../../smartContract/metadata/sbt_metadata.json";

export default function Sbt_mint() {
    const [biometricRegisterStatus, setBiometricRegisterStatus] = useState(false);
    const [userData_DB, setUserData_DB] = useState(null);
    const [mintStatus, setMintStatus] = useState("");
    const [error, setError] = useState(null);

    const isNetworkOnTestChain = useSelector(states => states.accountStatus.wallet_network_status);
    const isWalletConnected = useSelector(states => states.accountStatus.wallet_status);
    const customerAddress = useSelector(states => states.accountStatus.wallet_account);
    const permissionAllowed = useSelector(states => states.accountStatus.permission_status);
    const isContractManager = useSelector(states => states.accountStatus.isManager);
    const username = useSelector(states => states.sbt_user.username);
    const userWalletAddress = useSelector(states => states.sbt_user.userWalletAddress);

    const router = useRouter();
    const origin = process.env.NEXT_PUBLIC_HEROKU_SERVER_URL;

    const contractAddress = "0x087bd06dBd076c579400e144566069Bf1D00D0A3";
    const contractABI = abi;

    //取得用戶資料，並查看是否已註冊完成生物辨識數據
    const refreshUserData = async () => {
        try {
            await fetch(`${origin}/getUserData`, {
                method: 'POST',
                headers: {
                    'content-type': 'Application/Json'
                },
                body: JSON.stringify({ username })
            })
                .then(res => res.json())
                .then(res => {
                    setBiometricRegisterStatus(res.biometric_register_status);
                    setUserData_DB(res);
                })
                .catch(err => console.log(err))
        } catch(err) {
            console.log(err);
        }
    }

    /* 利用公鑰數據注入SBT智能合約中 */
    const sbt_mint = async () => {
        try{
            if (isContractManager) {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const sbtContract = new ethers.Contract(contractAddress, contractABI, signer)

                    const metadataURI = `https://gateway.pinata.cloud/ipfs/QmdXtJjTGfQhxhXZRva6KPzPDaSfEd4XHvmAmKvAvuSpec/1.json`;
                    /*  <<調用 ABI 方法 (Pseudocode)>>
                    *
                    *   safeMint(
                    *       wallet_address(目標錢包地址),
                    *       metadata_URI(元數據URI),
                    *       user_id(用戶ID),
                    *       user_name(用戶帳號名),
                    *       credential_id(用戶生物特徵數據之ID),
                    *       credential_publickey(用戶生物特徵數據之公鑰)
                    *   );
                    *
                    */
                    const txn = await sbtContract.safeMint(
                        userWalletAddress,
                        metadataURI,
                        userData_DB._id,
                        userData_DB.name,
                        userData_DB.credential.credentialID,
                        userData_DB.credential.credentialPublicKey
                    );
                    console.log("NFT Minting...");
                    setMintStatus("⌛Minting...");
                    await txn.wait();
                    console.log("NFT Minted", txn.hash);
                    setMintStatus("✅ Minted");
                } else {
                    console.log("Ethereum object not found, install Metamask.");
                    setError("Install a Metamask wallet to mint an SBT");
                }
            } else {
                console.log("You must be the creator of the contract.");
                setError("Function caller was not the owner of the contract.");
            }
        } catch(err) {
            console.log(err);
        }
    }

    
    useEffect(() => {
        if (mintStatus === "✅ Minted") {
            setTimeout(() => {
                router.push('/dashboard/SBT/fingerprint/signUp/sbt_mint_success');
            }, 3000);
        }
    }, [mintStatus]);
    
    return (
        <div>
            <h1>靈魂綁定代幣鑄造程序</h1>
            <button onClick={() => refreshUserData()}>重新整理</button>
            <br/><br/>
            {isWalletConnected && permissionAllowed && isContractManager
                ?   <alert color='success'>
                        SUCCESS : 歡迎使用代幣管理中心 ! ! !
                        {isWalletConnected && <div><span className="font-bold">您當前的錢包地址 : </span>{customerAddress}</div>}
                        <br/>
                    </alert>
                :   <></>
            }
            <div>
                {permissionAllowed && isContractManager
                    ?   <div>
                            <figure><img src={sbtMetadata.image} alt={sbtMetadata.name} /></figure>
                        </div>
                    :   <div>
                            <alert color='warning'>
                                WARNNING : 權限不足 ! ! !
                                <br/><br/>
                            </alert>
                        </div>
                }
            </div>
            {biometricRegisterStatus
                ?   <alert>
                        <ul>
                            <li>用戶帳號名 : {username}</li>
                            <li>用戶ID : {userData_DB._id}</li>
                            <li>用戶電子信箱 : {userData_DB.email}</li>
                            <li>用戶以太坊錢包地址 : {userWalletAddress}</li>
                            <li>用戶生物特徵數據ID : {userData_DB.credential.credentialID}</li>
                            <li>用戶生物特徵數據公鑰 : {userData_DB.credential.credentialPublicKey}</li>
                        </ul>
                        <br/><br/>
                    </alert>
                :   <></>
            }
            <button onClick={() => sbt_mint()}>鑄造SBT</button>
            <br/>
            <alert>{mintStatus}</alert>
        </div>
    );
}