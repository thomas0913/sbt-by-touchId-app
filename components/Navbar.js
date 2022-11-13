import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import {updatingPermissionStatus, updatingWalletAccount, updatingWalletNetworkStatus, updatingWalletStatus, checkIfIsManager} from "../redux/action/accountStatus";

export default function Navbar() {
    const [error, setError] = useState(null);
    const [walletConnectingStatus, setWalletConnectingStatus] = useState(false); //for spinner

    const alreadyLogin = useSelector(states => states.accountStatus.alreadylogin_state);
    const isNetworkOnTestChain = useSelector(states => states.accountStatus.wallet_network_status);
    const isWalletConnected = useSelector(states => states.accountStatus.wallet_status);
    const customerAddress = useSelector(states => states.accountStatus.wallet_account);
    const permissionAllowed = useSelector(states => states.accountStatus.permission_status);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("walletStatus", {isNetworkOnTestChain, isWalletConnected, customerAddress, permissionAllowed});
    }, [isNetworkOnTestChain, isWalletConnected, customerAddress, permissionAllowed]);

    //錢包連接
    const checkIfWalletIsConnected = async () => {
        try {
            if (window.ethereum) {
                setWalletConnectingStatus(true);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); //請求當前使用人錢包地址
                const account = accounts[0];
                dispatch(updatingWalletStatus(true));
                dispatch(updatingWalletAccount(account));
                console.log("Account Connected: ", account);
                setWalletConnectingStatus(false);
            } else {
                setError("Please install a MetaMask wallet to use our Dapp web.");
                console.log("No MetaMask detected");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletNetworkCorrect = async () => {
        try {
            if (window.ethereum) {
                const networks = await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }], 
                });
                if (networks == null) {
                    dispatch(updatingWalletNetworkStatus(true));
                    console.log("Connected to testNet on Rinkeby successfully.");
                }
            } else {
                setError("Please install a MetaMask wallet to use our Dapp web.");
                console.log("No MetaMask detected");
            }
        } catch (error) {
            console.log(error);
        }
    }

    //驗證當前錢包是否為管理員(同時為NFT系列創造人)
    const verifyIfWalletIsManager = async () => {
        try {
            if (window.ethereum) {
                const owner = "0x57903759493b5C0982F91c478FF24a06163f089B";
                const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'});
                    
                if (owner.toLowerCase() === account.toLowerCase()) {
                    dispatch(updatingPermissionStatus(true));
                    dispatch(checkIfIsManager(true));
                } else {
                    dispatch(updatingPermissionStatus(true));
                    dispatch(checkIfIsManager(false));
                }
            } else {
                console.log("Ethereum object not found, install MetaMask.");
                setError("Please install a MetaMask wallet to use our Dapp web.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    //解除錢包連接
    const disconnectWallet = () => {
        try{
            dispatch(updatingPermissionStatus(false));
            dispatch(updatingWalletAccount(null));
            dispatch(updatingWalletNetworkStatus(false));
            dispatch(updatingWalletStatus(false));
        } catch(err) {
            console.log(err);
        }
    }

    //利用錢包取得網站使用權限
    const checkPermission = () => {
        checkIfWalletNetworkCorrect();
        verifyIfWalletIsManager();
        checkIfWalletIsConnected();
    }

    return (
        <nav>
            <div className="logo">
                <Link href="/"><a><Image src="/ethereum.png" width={128} height={120}/></a></Link>
            </div>
            {/* <Link href="/about"><a>About</a></Link>
            <Link href="/guide"><a>Guide</a></Link> */}
            <div>
                {alreadyLogin === true
                    ?   <>
                            <Link href="/dashboard"><a>DashBoard</a></Link>
                            <Link href="/user/logout"><a>Logout</a></Link>
                        </>
                    :   <Link href="/user"><a>Login</a></Link>
                }
            </div>
            <div>
                <Link href="#"><a></a></Link>
            </div>
            <div>
                <button className="btn-connect" onClick={
                    () => {
                        if (isWalletConnected === false) {
                            checkPermission();
                        } else {
                            disconnectWallet();
                        }
                    }
                } style={{
                    borderRadius: "4px",
                    background: "#df6d2a",
                    color: "white",
                    padding: "3px 0",
                    width: "175px",
                    borderColor: "white",
                }}>
                    {isWalletConnected
                        ?   "錢包解除連接 🔒"
                        :   <div>
                                {walletConnectingStatus === true
                                    ?   <div>
                                            <spinner size="sm">
                                                Loading...
                                            </spinner>
                                            <span>
                                                {' '}加載中 . . .
                                            </span>
                                        </div>
                                    : "連接MetaMask錢包 🔑"
                                }
                            </div>
                    }
                </button>
            </div>
        </nav>
    );
}