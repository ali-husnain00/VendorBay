import React, { useContext, useState } from 'react';
import './AddProducts.css';
import { toast } from "react-toastify"
import { context } from '../Context/Context';
import Loading from '../Loading/Loading';

const categories = [
    "Electronics",
    "Fashion",
    "Home & kitchen",
    "Beauty & personal care",
    "Books",
    "Toys",
    "Sports",
    "Automotive",
];

const AddProducts = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);

    const { BASE_URL, getSellerProducts, loading, setLoading } = useContext(context)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (!category) {
            toast.warning("Please select a category");
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('image', image);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);

        try {
            const res = await fetch(`${BASE_URL}/seller/addProduct`, {
                method: "POST",
                credentials: 'include',
                body: formData
            })

            if (res.ok) {
                setTitle("");
                setDesc("");
                setImage(null);
                setPrice(0);
                setCategory("");
                setStock(0);
                toast.success("Product added successfully!")
                getSellerProducts()
            }
            else {
                toast.error("An error occured while adding product!")
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    };

    if(loading){
        return <Loading/>
    }

    return (
        <div className="add-product">
            <form className="product-form" onSubmit={handleSubmit}>
                <h2>Add New Product</h2>

                <label>
                    Title
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="desc"
                        rows="4"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Image
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </label>

                <label>
                    Price
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>

                <label className='cat-select'>
                    Category
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {
                            categories.map((cat, index) => {
                                return (
                                    <option value={cat} key={index}>{cat}</option>
                                )
                            })
                        }
                    </select>
                </label>

                <label>
                    Stock
                    <input
                        type="number"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </label>

                <button type="submit">Submit Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
