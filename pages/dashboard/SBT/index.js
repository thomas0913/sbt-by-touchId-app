import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SBT() {

    const router = useRouter();

    return (
        <div>
            <h1>SBT專區</h1>
            <button onClick={() => router.push('/dashboard/SBT/fingerprint/signUp')}>SBT註冊</button>
            <button onClick={() => router.push('/dashboard/SBT/fingerprint/identityVerify')}>SBT驗證</button>
            <button onClick={() => router.push('/dashboard/SBT/fingerprint/deleteAccount')}>SBT註銷</button>
        </div>
    );
}