import React, {  useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CheckIfLoginOrNot(props) {
    const router = useRouter();

    useEffect(() => {
        router.push('/user/login');
    }, []);
}