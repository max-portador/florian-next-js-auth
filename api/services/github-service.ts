import axios from "axios"
import * as dotenv from "dotenv";
dotenv.config({path: '.env.development'})

interface GitHubUser {
    id: number
    name: string
}

interface AccessTokenResponse {
    access_token: string
}

interface UserResponse {
    id: number
    name: string
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
        const response = await axios.get<UserResponse>(
            USER_URL,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
        return response.data as GitHubUser
    }


}


export default new githubService()
