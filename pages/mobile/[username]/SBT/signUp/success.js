import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../../../styles/Home.module.css";

export default function success() {
    return (
        <div>
            <h1 className={styles.title}>指紋註冊成功</h1>
            <p>工作人員將開始為您鑄造個人之靈魂綁定代幣 . . .</p>
        </div>
    );
}