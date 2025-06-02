import React from 'react'
import "../LatestProducts/LatestProducts.css"
import { useState } from 'react'
import { useContext } from 'react'
import { context } from '../Context/Context'
import Loading from '../Loading/Loading'
import { useEffect } from 'react'

const FeaturedProducts = () => {

  const [featuredProducts, setFeaturedProducts] = useState([])
  const {BASE_URL, loading, setLoading} = useContext(context)

  const getLatestProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/featuredProducts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data)
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLatestProducts()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <section className="latest-products">
      <h2>Featured Products</h2>
      <div className="products-container">
        {featuredProducts.map(product => (
          <div key={product._id} className="product-card" tabIndex={0}>
            <img src={`${BASE_URL}/uploads/${product.image}`} className="product-image" loading='lazy' />
            <div className="product-info">
              <h3>{product.title.length > 30 ? product.title.slice(0,30) + "..." : product.title}</h3>
              <p className="price">Rs {product.price}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts