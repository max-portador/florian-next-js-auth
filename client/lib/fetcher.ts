import axios, {AxiosResponse} from "axios";
import {environment} from "./enviroment";

export type QueryResponse<T> = [error: string | null, data: T | null]


export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
    try {
        console.log(url)
        const request = () => axios.get(url, {withCredentials: true})
        const {data} = await handleRequest(request)
        return [null, data]
    }
    catch (error) {
        return [error as string | null, null]
    }
}

async function handleRequest(request: () => Promise<AxiosResponse>): Promise<AxiosResponse>{
    try {
        return await request()
    } catch (error: any) {
        console.table(error.response)
        if (error?.response?.status === 401){
            try {
                await refreshTokens()
                return await request()
            }
            catch (innerError: any){
                return innerError
            }

        }
        throw error
    }
}

async function refreshTokens() {
    return axios.post(`${environment.apiUrl}/refresh`, undefined, {withCredentials: true})
}