import React from 'react'
import { useContext } from 'react'
import { context } from '../../components/Context/Context'
import Loading from '../../components/Loading/Loading'
import { useNavigate, Link } from 'react-router'
import { Search } from 'lucide-react'
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
        <main className="search-page" aria-label="Search results">
            <h1 className="search-page-heading">Search Results</h1>
            <div className="container">
                {
                    searchProduct.length > 0 ? (
                            searchProduct.map((prod) => (
                                <div key={prod._id} className="product-card" onClick={() => navigate(`/product/details/${prod._id}`)}>
                                    <img src={`${BASE_URL}/uploads/${prod.image}`} alt={prod.title} className="product-image" loading="lazy" />
                                    <div className="product-info">
                                        <h3>{prod.title.length > 30 ? prod.title.slice(0, 30) + "..." : prod.title}</h3>
                                        <p className="price">Rs {prod.price}</p>
                                        <button className="add-to-cart-btn" onClick={(e) => handleAddToCartClick(e, prod._id)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-search">
                                <Search className="empty-search-icon" size={48} aria-hidden />
                                <p className="empty-search-msg">No products found</p>
                                <p className="empty-search-sub">Try different keywords or browse all products.</p>
                                <Link to="/products" className="empty-search-cta">Browse all products</Link>
                            </div>
                        )
                }
            </div>
        </main>
    )
}

export default SearchResults