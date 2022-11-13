import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function success() {
    return (
        <div>
            <h1>個人生物特徵數據註冊成功</h1>
            <p>工作人員將開始為您鑄造個人之靈魂綁定代幣，如SBT鑄造成功，我們會寄送成功之郵件至您的信箱 . . .</p>
        </div>
    );
}