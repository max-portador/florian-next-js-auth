import {UserDocument} from "@shared";
import {createContext, FC, PropsWithChildren, useContext, useState} from "react";

export interface UserContext {
    user?: UserDocument
    setUser: (user?: UserDocument) => void
}

export const UserContextImpl = createContext<UserContext>(null!)

export function useUser() {
    return useContext(UserContextImpl)
}

interface Props extends PropsWithChildren{
    initialUser?: UserDocument
}

export const UserProvider: FC<Props> = ({children, initialUser}) => {
    const [user, setUser] = useState(initialUser)

    return <UserContextImpl.Provider value={{user, setUser}}>{children}</UserContextImpl.Provider>
}