import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { loading, setLoading, BASE_URL, products, handleAddToCart } = useContext(context);
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const navigate = useNavigate()

    const relProducts = useMemo(() =>{
        if(!product || !products) return [];
        return products.filter(prod => prod._id !== product._id && prod.category.toLowerCase() === product.category.toLowerCase()).slice(0,6)
    },[product, products])

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/product/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const increase = () => setQty(qty + 1);
    const decrease = () => qty > 1 && setQty(qty - 1);

    if (loading || !product) return <Loading />;

    return (
        <main className="prod-details-page" aria-label="Product details">
            <div className="product-details-cont">
                <div className="left-sec">
                    <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title} loading="lazy" />
                </div>

                <div className="right-sec">
                    <h2 className="title">{product.title}</h2>

                    <div className="desc">
                        <h3>Description:</h3>
                        {product.desc.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>

                    <div className="info-line">
                        <span className="category">Category: <strong>{product.category}</strong></span>
                        <span className="availability">
                            {product.stock > 0 ? "In Stock ✅" : "Out of Stock ❌"}
                        </span>
                    </div>

                    <p className="pd-price">Rs {product.price}</p>

                    <div className="actions">
                        <div className="quantity-control">
                            <button type="button" onClick={decrease} aria-label="Decrease quantity">−</button>
                            <input type="number" value={qty} readOnly aria-label="Quantity" />
                            <button type="button" onClick={increase} aria-label="Increase quantity">+</button>
                        </div>
                        <button className="btn add" onClick={() =>handleAddToCart(product._id, qty)}>Add to Cart</button>
                    </div>
                </div>
            </div>
            <div className="related-products-container">
                <h2>Related Products</h2>
                <div className="related-products">
                    {
                    relProducts.length > 0 ?(
                        relProducts.map(prod => (
                            <div key={prod._id} className="product-card" onClick={() => navigate(`/product/details/${prod._id}`)}>
                                <img src={`${BASE_URL}/uploads/${prod.image}`} alt={prod.title} className="product-image" loading="lazy" />
                                <div className="product-info">
                                    <h3>{prod.title.length > 30 ? prod.title.slice(0, 30) + "..." : prod.title}</h3>
                                    <p className="price">Rs {prod.price}</p>
                                    <button className="add-to-cart-btn" onClick={() =>handleAddToCart(prod._id)}>Add to Cart</button>
                                </div>
                            </div>
                        ))
                    )
                    :
                    (
                        <div className="related-empty">
                            <p className="related-empty-msg">No related products at the moment.</p>
                        </div>
                    )
                }
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
