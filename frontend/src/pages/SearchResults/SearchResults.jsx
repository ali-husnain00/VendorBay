import React from 'react'
import { useContext } from 'react'
import { context } from '../../components/Context/Context'
import { useEffect } from 'react'
import Loading from '../../components/Loading/Loading'
import { useNavigate } from 'react-router'
import "./SearchResults.css"

const SearchResults = () => {
    const { searchProduct, handleAddToCart, BASE_URL } = useContext(context)

    const navigate = useNavigate()

    const handleAddToCartClick = (e, id) => {
        e.stopPropagation();
        handleAddToCart(id);
    }


    if (!searchProduct) {
        return <Loading />
    }

    return (
        <div className='search-page'>
            <h2>Search Results</h2>
            <div className="container">
                {
                    searchProduct.length > 0 ?
                        (
                            searchProduct.map((prod) => (
                                <div key={prod._id} className="product-card" onClick={() => navigate(`/product/details/${prod._id}`)}>
                                    <img src={`${BASE_URL}/uploads/${prod.image}`} className="product-image" loading='lazy' />
                                    <div className="product-info">
                                        <h3>{prod.title.length > 30 ? prod.title.slice(0, 30) + "..." : prod.title}</h3>
                                        <p className="price">Rs {prod.price}</p>
                                        <button className="add-to-cart-btn" onClick={(e) => handleAddToCartClick(e, prod._id)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))
                        ) :
                        (
                            <p>No product found</p>
                        )
                }
            </div>
        </div>
    )
}

export default SearchResults