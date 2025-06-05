import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const context = createContext(null);

const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(null)
    const [products, setProducts] = useState([]);
    const [sellerStats, setSellerStats] = useState({})
    const [sellerProducts, setSellerProducts] = useState([])
    const [cartProduct, setCartProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const BASE_URL = import.meta.env.VITE_API_URL;

    const getSellerProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/seller/allProducts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                setSellerProducts(data)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const getLoggedInUser = async () => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:3000/getLoggedInUser", {
                method: "GET",
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                setUser(data)
            }
        } catch (error) {
            console.log("An error occured while getting loggedIn User" + error)
        }
        finally {
            setLoading(false)
        }
    }

    const getSellerInfo = async () => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:3000/getSellerInfo", {
                method: "GET",
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                setSeller(data)
            }
        } catch (error) {
            console.log("An error occured while getting seller info" + error)
        }
        finally {
            setLoading(false)
        }
    }

    const getSellerStats = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/seller/dashboard-stats`,{
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if(res.ok){
                const data = await res.json()
                setSellerStats(data)
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    const handleAddToCart = async (id, qty = 1) =>{
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/addtocart/product/${id}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body: JSON.stringify({qty})
            })
            if(res.ok){
                const data = await res.json();
                toast.success(data.message);
            }
            else{
                toast.warning("Login to add product to cart!")
            }
        } catch (error) {
            console.log("An error occured while adding product to cart"+ error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getLoggedInUser();
        getSellerInfo();
        getSellerStats()
    }, [])

    useEffect(() => {
        if (user && user.role === "seller") {
            getSellerProducts()
        }
    }, [user])

    const value = {
        getLoggedInUser,
        user,
        setUser,
        BASE_URL,
        getSellerInfo,
        sellerProducts,
        getSellerProducts,
        loading,
        setLoading,
        seller,
        sellerStats,
        getSellerStats,
        products,
        setProducts,
        handleAddToCart
    }

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default ContextProvider