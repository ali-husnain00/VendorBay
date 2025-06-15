import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const context = createContext(null);

const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [userOrders, setUserOrders] = useState([])
    const [seller, setSeller] = useState(null)
    const [products, setProducts] = useState([]);
    const [sellerStats, setSellerStats] = useState({})
    const [sellerProducts, setSellerProducts] = useState([])
    const [searchProduct, setSearchedProduct] = useState([]);
    const [searchVal, setSearchVal] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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
            const res = await fetch(`${BASE_URL}/getLoggedInUser`, {
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

    const getUserOrders = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/getUserOrders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json()
                setUserOrders(data)
            }
        } catch (error) {
            console.log("An error occured while getting user orders" + error)
        }
        finally {
            setLoading(false)
        }
    }


    const getSellerInfo = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/getSellerInfo`, {
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
            const res = await fetch(`${BASE_URL}/seller/dashboard-stats`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json()
                setSellerStats(data)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleAddToCart = async (id, qty = 1) => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/addtocart/product/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ qty })
            })
            if (res.ok) {
                const data = await res.json();
                toast.success(data.message);
            }
            else {
                toast.warning("Login to add product to cart!")
            }
        } catch (error) {
            console.log("An error occured while adding product to cart" + error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearchedProduct = async () => {
        if(!searchVal || searchVal === null){
            toast.warning("Please enter something to search..");
            return;
        }
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/getSearchedProduct/?search=${searchVal}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.ok) {
                const data = await res.json();
                setSearchedProduct(data);
                setSearchVal('')
                navigate("/searchResults")
            }
        } catch (error) {
            console.log("An error occured while getting searched products" + error)
        }
        finally {
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
        getUserOrders,
        userOrders,
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
        handleAddToCart,
        searchVal,
        setSearchVal,
        handleSearchedProduct,
        searchProduct
    }

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default ContextProvider