import React, { useState } from "react";
import "./BecomeSeller.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ApplicationSubmitted from "../../components/ApplicationSubmitted/ApplicationSubmitted";
import Loading from "../../components/Loading/Loading";

const BecomeSeller = () => {
    const [storeName, setStoreName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [storeBanner, setStoreBanner] = useState(null);
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!storeName || !contactNumber || !storeAddress || !storeDescription || !storeBanner) {
            toast.warning("All fields are required!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("storeName", storeName);
        formData.append("contactNumber", contactNumber);
        formData.append("storeAddress", storeAddress);
        formData.append("storeDescription", storeDescription);
        formData.append("storeBanner", storeBanner);

        try {
            const res = await fetch("http://localhost:3000/becomeSeller", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (res.ok) {
                toast.success("Application submitted successfully!");
                setSubmitted(true);
            } else {
                toast.error("An error occurred while submitting application!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        submitted ? (
            <ApplicationSubmitted />
        ) : (
            <div className="become-seller-page">
                <div className="seller-right">
                    <h2>Seller Application</h2>
                    <form className="seller-form" onSubmit={handleSubmit}>
                        <label>
                            Store Name
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Contact Number
                            <input
                                type="tel"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Store Address
                            <input
                                type="text"
                                value={storeAddress}
                                onChange={(e) => setStoreAddress(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Store Description
                            <textarea
                                value={storeDescription}
                                onChange={(e) => setStoreDescription(e.target.value)}
                                rows="4"
                                required
                            />
                        </label>

                        <label>
                            Store Banner
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setStoreBanner(e.target.files[0])}
                            />
                        </label>

                        <button type="submit">Apply Now</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default BecomeSeller;
