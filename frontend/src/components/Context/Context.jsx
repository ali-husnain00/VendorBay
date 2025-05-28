import {createContext, useEffect, useState } from "react";

export const context = createContext(null);

const ContextProvider = ({children}) =>{

    const [user, setUser] = useState(null);

    const getLoggedInUser = async () =>{
        try {
            const res = await fetch("http://localhost:3000/getLoggedInUser",{
                method:"GET",
                credentials:"include"
            })
            if(res.ok){
                const data = await res.json();
                setUser(data)
            }
        } catch (error) {
            console.log("An error occured while getting loggedIn User"+ error)
        }
    }

    useEffect(() =>{
        getLoggedInUser();
    },[])

    const value = {
        getLoggedInUser,
        user,
        setUser,
    }

    return(
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default ContextProvider