import React, { useEffect, useState, useContext } from 'react';
import './ProductsList.css';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { BASE_URL } = useContext(context);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/products`, {
        credentials: 'include',
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/delete/product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/products/feature/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success("Feature status updated");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to update feature status");
    }
  };

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</td>
                <td>{product.category}</td>
                <td>Rs {product.price}</td>
                <td>{product.stock}</td>
                <td>{product.isFeatured ? 'Yes' : 'No'}</td>
                <td className='action-btns-admin'>
                  <button className="btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                  <button className="btn-accent" onClick={() => toggleFeatured(product._id)}>
                    {product.isFeatured ? 'Unmark' : 'Mark'} Featured
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsList;
