import React from 'react';

const SearchBar = () => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search for a location..." />
            <button>Search</button>
        </div>
    );
};

export default SearchBar;
