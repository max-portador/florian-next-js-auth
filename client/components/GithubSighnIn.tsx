import React from 'react';
import {environment} from "../lib/enviroment";
import Link from "next/link";
import GithubIcon from "./GithubIcon";

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?scope=user:email`


const GithubSighnIn = () => {
    return (
        <Link href={gitHubUrl}>
            <a className="flex items-center px-4 py-2 space-x-4 font-medium text-white bg-gray-900 rounded">
        <span className="w-8 fill-current">
         <GithubIcon/>
        </span>
                <span>Sign in with GitHub</span>
            </a>
        </Link>
    );
};

export default GithubSighnIn;