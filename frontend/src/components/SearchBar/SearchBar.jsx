import React, { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";
import { context } from "../Context/Context";
import Loading from "../Loading/Loading";

const SearchBar = () => {

  const {searchVal, setSearchVal, handleSearchedProduct, loading} = useContext(context)

  if(loading){
    return <Loading/>
  }

  return (
    <div className="search-bar">
      <input type="text" value={searchVal} onChange={(e) =>setSearchVal(e.target.value)} placeholder="Search products..." />
      <FiSearch className="search-icon" onClick={handleSearchedProduct} />
    </div>
  );
};

export default SearchBar;
