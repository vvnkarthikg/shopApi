import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import './Products.css';
import no from '../images/no.jpg';
import bannerImage from '../images/minibanner5.png';
import brand1 from '../images/kinderjoy.png';
import brand2 from '../images/parle.svg';
import brand3 from '../images/tictac.png';
import { ProductsContext } from './ProductContext'; // Import ProductsContext

const Products = () => {
  const { products, error } = useContext(ProductsContext); // Use context instead of props

  return (
    <>
      <div className="banner-image">
        <img src={bannerImage} alt="Banner" className="banner-img" />
      </div>

      {/* Brand Logos Section */}
      <div className="brand-section">
        <h2 className="brand-heading">Brands We Sell</h2>
        <div className="brand-logos">
          <img src={brand1} alt="Brand 1" className="brand-logo" />
          <img src={brand2} alt="Brand 2" className="brand-logo" />
          <img src={brand3} alt="Brand 3" className="brand-logo" />
        </div>
      </div>

      <div className="home-container">
        {error && <p className="error-text">{error}</p>}
        
        <div className="prod-list">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map(product => {
              const discountedPrice = (product.price * 0.9).toFixed(2); // Calculate 10% discount
              return (
                <Link key={product._id} to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                  <div className="prod-card">
                    <div className="prod-image">
                      <img
                        src={product.productImage && product.productImage !== "" ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no}
                        alt={product.name}
                      />
                    </div>
                    <div className="prod-details">
                      <p className="prod-category">{product.category}</p>
                      <h2>{product.name}</h2>
                      <div className="prod-price-container">
                      <p className="prod-price">₹{discountedPrice}</p>
                      <p className="prod-mrp-price">
                        MRP: <span className="prod-mrp-price" style={{ textDecoration: 'line-through',  fontSize: 'small' }}>₹{product.price}</span>
                      </p>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
