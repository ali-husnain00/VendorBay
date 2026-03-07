import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import "./AllProducts.css"
import SearchBar from '../../components/SearchBar/SearchBar'
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import { Package } from 'lucide-react';

const AllProducts = () => {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()

  const { BASE_URL, loading, setLoading, products, setProducts, handleAddToCart } = useContext(context)

  const getProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/getProducts?page=${page}&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        const data = await res.json();
        setPage(data.page);
        setTotalPages(data.totalPages);
        setProducts(data.allProd)
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleAddToCartClick = (e, id) =>{
    e.stopPropagation();
    handleAddToCart(id);
  }

  useEffect(() => {
    getProducts()
  }, [page])

  if (loading || !products) {
    return <Loading />
  }

  return (
    <main className="allproducts" aria-label="All products">
      <SearchBar />
      <div className="prod-container">
        {products.length > 0 ? (
        <div className="prod-cont">
          {
            products.map((prod) => (
              <div key={prod._id} className="product-card" onClick={() =>navigate(`/product/details/${prod._id}`)}>
                <img src={`${BASE_URL}/uploads/${prod.image}`} alt={prod.title} className="product-image" loading="lazy" />
                <div className="product-info">
                  <h3>{prod.title.length > 30 ? prod.title.slice(0, 30) + "..." : prod.title}</h3>
                  <p className="price">Rs {prod.price}</p>
                  <button className="add-to-cart-btn" onClick={(e) =>handleAddToCartClick(e, prod._id)}>Add to Cart</button>
                </div>
              </div>
            ))
          }
        </div>
        ) : (
          <div className="empty-products">
            <Package className="empty-products-icon" size={48} aria-hidden />
            <p className="empty-products-msg">No products found.</p>
            <p className="empty-products-sub">Check back later or try a different search.</p>
            <Link to="/" className="empty-products-cta">Back to home</Link>
          </div>
        )}
      </div>
      {products.length > 0 && (
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
      )}
    </main>
  )
}

export default AllProducts