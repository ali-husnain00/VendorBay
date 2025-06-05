import React, { useContext, useEffect, useState } from 'react';
import './Checkout.css';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';

const Checkout = () => {
    const { user, BASE_URL, loading, setLoading } = useContext(context);
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [selectedMethod, setSelectedMethod] = useState("");
    const navigate = useNavigate();

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/getCartProducts`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setCartItems(data);
        } catch (err) {
            toast.error("Failed to fetch cart.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            toast.warning("Please login to proceed.");
            navigate('/login');
        }
    }, [user]);

    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        setLoading(true)
        if (!address || !phone || !country || !postalCode || !city || !selectedMethod) {
            toast.warning("Please fill the complete form!");
            setLoading(false); 
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/orderNow `, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    fullName: user.username, address,
                    phone,
                    country,
                    postalCode,
                    city,
                    paymentMethod: selectedMethod,
                    orderedProducts: cartItems,
                    totalAmount:total,
                })
            })
            if (res.ok) {
                toast.success("Order placed successfully!");
                navigate("/profile")
            }
        }
        catch (error) {
            toast.error("An error occured while placing order!")
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <div className="checkout-container">
                <div className="checkout-left">
                    <h3>Shipping Info</h3>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={user?.username} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={user?.email} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Shipping Address</label>
                        <textarea
                            placeholder="Enter your full address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" pattern="[0-9]{10,13}" maxLength="13" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                    <label htmlFor="paymentMethod" className="form-label">
                        Payment Method
                    </label>
                    <select
                        id="paymentMethod"
                        className="payment-select"
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                    >
                        <option value="">Select a payment method</option>
                        <option value="Cash on delivery">Cash on delivery</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="jazzcash">JazzCash</option>
                        <option value="easypaisa">EasyPaisa</option>
                    </select>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Postal Code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </div>
                </div>

                <div className="checkout-right">
                    <h3>Order Summary</h3>
                    <div className="order-items">
                        {cartItems.map(item => (
                            <div key={item.product._id} className="order-item">
                                <img src={`${BASE_URL}/uploads/${item.product.image}`} alt="" loading='lazy' className='order-prod-img' />
                                <div className="order-info">
                                    <strong>{item.product.title.length > 35 ? item.product.title.slice(0, 35) + "..." : item.product.title}</strong>
                                    <p>Vendor: {item.product.seller.username || 'Unknown'}</p>
                                    <span>Qty: {item.quantity}</span>
                                    <div>Rs {item.product.price * item.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="summary-total">
                        <p>Subtotal: Rs {total}</p>
                        <p>Shipping: Rs 100</p>
                        <h4>Total: Rs {total + 100}</h4>
                    </div>
                    <div>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
