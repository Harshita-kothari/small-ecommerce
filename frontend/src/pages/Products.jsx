import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const API = "https://small-ecommerce-sffc.onrender.com/api";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });

    setEditingId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(`${API}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product added successfully");

      resetForm();
      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${API}/products/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product updated successfully");

      resetForm();
      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${API}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product deleted");

      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  return (
    <div className="products-page">

      <div className="products-header">
        <h1>Small Ecommerce</h1>
        <p>Manage your products easily</p>
      </div>

      {/* Add / Edit Form */}
      <div className="product-form">
        <h2>
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form
          onSubmit={
            editingId
              ? handleUpdateProduct
              : handleAddProduct
          }
        >
          <input
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                marginLeft: "10px",
                background: "#e5e7eb",
                color: "#333",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Products */}
      <h2>Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
          >
            <h3>{product.name}</h3>

            <p className="product-description">
              {product.description}
            </p>

            <p className="product-price">
              ₹{product.price}
            </p>

            <p className="product-stock">
              Stock: {product.stock}
            </p>

            <div className="product-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(product._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Products;   