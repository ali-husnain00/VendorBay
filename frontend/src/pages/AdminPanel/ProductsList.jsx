import React, { useEffect, useState, useContext } from 'react';
import './ProductsList.css';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';
import { Star, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
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
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/delete/product/${deleteConfirmId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Product deleted successfully');
        setDeleteConfirmId(null);
        fetchProducts();
      } else {
        toast.error('Error deleting product');
      }
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/products/feature/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Feature status updated');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to update feature status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-products-container">
      <div className="admin-card admin-products-card">
        {products.length === 0 ? (
          <p className="admin-empty-state">No products found.</p>
        ) : (
          <div className="admin-table-wrap">
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
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.title?.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</td>
                    <td>{product.category}</td>
                    <td>Rs {product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.isFeatured ? (
                        <Star size={18} className="admin-featured-icon admin-featured-yes" fill="currentColor" />
                      ) : (
                        <Star size={18} className="admin-featured-icon admin-featured-no" />
                      )}
                    </td>
                    <td>
                      <div className="admin-products-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger"
                          onClick={() => setDeleteConfirmId(product._id)}
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => toggleFeatured(product._id)}
                        >
                          {product.isFeatured ? 'Unmark' : 'Mark'} Featured
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteConfirmId}
        title="Delete product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default ProductsList;
