import React, { useContext } from "react";
import { Search } from "lucide-react";
import "./SearchBar.css";
import { context } from "../Context/Context";

const SearchBar = () => {
  const { searchVal, setSearchVal, handleSearchedProduct } = useContext(context);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearchedProduct()}
        placeholder="Search products..."
        aria-label="Search products"
      />
      <button type="button" className="search-icon-btn" onClick={handleSearchedProduct} aria-label="Search">
        <Search className="search-icon" size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
