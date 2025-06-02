import React from 'react'
import "./OrderCard.css"

const OrderCard = () => {
  return (
    <div className="order-card">
            <div className="order-header">
              <img src="/product-sample.jpg" alt="product" loading='lazy' className="order-img" />
              <div className='order-info'>
                <div><span className="order-status processing">Processing</span></div>
                <h4>Wireless Headphones</h4>
                <p>Order ID: #123456</p>
              </div>
            </div>

            <div className="order-details">
              <p><strong>Quantity:</strong> 2</p>
              <p><strong>Total:</strong> $120</p>
              <p><strong>Ordered on:</strong> 2024-05-20</p>
            </div>

            <div className="order-actions">
              <button className="view-btn">View</button>
              <button className="cancel-btn">Cancel</button>
            </div>
          </div>
  )
}

export default OrderCard