import { useState } from "react";
import { useRouter } from 'next/router';

export default function Dashboard() {
    
    const router = useRouter();
    
    return (
        <div>
            <h1>監控版</h1>
            <button onClick={() => router.push('/dashboard/SBT')}>SBT專區</button>
            <button onClick={() => router.push('/dashboard/NFT')}>NFT專區</button>
        </div>
    );
}