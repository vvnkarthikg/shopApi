import React, { useState, useRef, useEffect } from 'react';
import { FaArrowRight, FaSearch } from 'react-icons/fa'; // Import the arrow and search icons
import './SearchBar.css'; // Import the CSS for the SearchBar component
import no from './images/no.jpg';

const SearchBar = ({ products, onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const searchRef = useRef(null); // Create a ref for the search bar container

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter products based on the search term
        if (term) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]); // Clear results if search is cleared
        }
    };

    const handleProductClick = (productId) => {
        onProductSelect(productId); // Call function passed from Navbar
        setSearchTerm(''); // Clear the search bar
        setFilteredProducts([]); // Clear the search results
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setFilteredProducts([]); // Clear search results
                setSearchTerm(''); // Optionally clear the input as well
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="searchbar-container" ref={searchRef}>
            <input 
                type="text" 
                placeholder="search" 
                className="searchbar-input" 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <div className="search-icon">
                <FaSearch /> {/* Search icon */}
            </div>
            {/* Display the filtered products based on search */}
            {filteredProducts.length > 0 && (
                <div className="searchbar-results">
                    {filteredProducts.map(product => (
                        <div
                            key={product._id}
                            className="searchbar-item"
                            onClick={() => handleProductClick(product.productId)}  // Handle redirection on click
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={product.productImage ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no}
                                alt={product.name}
                                className="searchbar-product-image"
                            />
                            <p>{product.name}</p>
                            <FaArrowRight className="arrow-symbol" /> {/* Arrow icon */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;