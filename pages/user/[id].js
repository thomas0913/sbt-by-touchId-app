import React from "react";

export const getStaticPaths = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();

    const paths = data.map((member) => {
        return {
            params: { id: member.id.toString() }
        }
    })

    return {
        paths,
        fallback: false
    };
}

export const getStaticProps = async (context) => {
    const id = context.params.id;
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data = await res.json();

    return {
        props: { account: data }
    }
}

export default function Details(props) {
    return (
        <div>
            <h1>Details page by {props.account.name}</h1>
        </div>
    );
}