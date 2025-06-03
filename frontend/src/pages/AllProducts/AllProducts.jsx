import React, { useContext, useEffect, useState } from 'react'
import "./AllProducts.css"
import SearchBar from '../../components/SearchBar/SearchBar'
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';

const AllProducts = () => {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { BASE_URL, loading, setLoading } = useContext(context)

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

  useEffect(() => {
    getProducts()
  }, [page])

  if (loading || !products) {
    return <Loading />
  }

  return (
    <div className='allproducts'>
      <SearchBar />
      <div className="prod-container">
        <div className="prod-cont">
          {
            products.map((prod) => (
              <div key={prod._id} className="product-card">
                <img src={`${BASE_URL}/uploads/${prod.image}`} className="product-image" loading='lazy' />
                <div className="product-info">
                  <h3>{prod.title.length > 30 ? prod.title.slice(0, 30) + "..." : prod.title}</h3>
                  <p className="price">Rs {prod.price}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
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

    </div>
  )
}

export default AllProducts