import React from "react";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search products..." />
      <FiSearch className="search-icon" />
    </div>
  );
};

export default SearchBar;
