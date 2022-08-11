import {IncomingMessage, ServerResponse} from "http";
import {QueryResponse} from "./fetcher";
import axios, {AxiosResponse} from "axios";
import {environment} from "./enviroment";

const SET_COOKIE_HEADER = 'set-cookie'

export const fetcherSSR = async <T>(
    req: IncomingMessage,
    res: ServerResponse,
    url: string
): Promise<QueryResponse<T>> => {
    try{
        const request = () => axios.get<T>(url, {headers: {cookie: req.headers.cookie!}})
        const {data} = await handleRequest(req, res, request)
        return [null, data]
    }
    catch (error: any) {
        return [error, null]
    }
}

async function handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    request: () => Promise<AxiosResponse>
){
    try{
        return await request()
    }
     catch (e: any) {
         if (e?.response?.status === 401){
          try {
                await refreshTokens(req, res)
                return await request()
          }
          catch (innerError) {
            throw innerError
          }

         }

         throw e
     }

}


async function refreshTokens(req: IncomingMessage, res: ServerResponse){
    const response = await axios.post(`${environment.apiUrl}/refresh`, undefined,
        {
            headers: {
                cookie: req.headers.cookie!,
            }
        }
    )

    const cookies = response.headers[SET_COOKIE_HEADER] as unknown as string
    req.headers.cookie = cookies
    res.setHeader(SET_COOKIE_HEADER, cookies)
}
