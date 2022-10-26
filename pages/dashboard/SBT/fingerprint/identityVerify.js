import { useState, useEffect } from 'react';

export default function IdentityVerify() {

    const identityVerify_SBT = async () => {
        const option = {
            method: 'GET'
        }

        await fetch("https://sbt-manage-node-server.herokuapp.com/email/identityVerify_sbt", option)
            .then(res => {
                console.log("成功發送驗證Email.");
            })
            .catch(err => {
                console.log(err);
            })
    };

    return (
        <div>
           <h1>SBT驗證</h1>
           <button onClick={identityVerify_SBT}>start to sign</button>
        </div>
    );
}