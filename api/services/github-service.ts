import axios from "axios"
import * as dotenv from "dotenv";
import {Octokit} from "octokit";
dotenv.config({path: '.env.development'})

interface AccessTokenResponse {
    access_token: string
}

const TOKEN_URL = 'https://github.com/login/oauth/access_token'
const USER_URL = 'https://api.github.com/user'


class githubService{

    async getGitHubUser(code:string){
        const token =  await this.getAccessToken(code)
        return this.getUser(token)
    }


    async getAccessToken(code: string) {
        const response = await axios.post<AccessTokenResponse>(
            TOKEN_URL,
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers:{ 'Accept': 'application/json'}
            }
        )

        return response.data.access_token
    }


    async getUser(token: string) {
        const octokit = new Octokit({ auth: token });

        try {
            const res = await octokit.request('GET /user', {})
            return res.data
        }

        catch (e) {
            throw e
        }

    }


}


export default new githubService()
