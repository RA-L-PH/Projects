import { Link } from 'react-router-dom';

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image"
          />
        </div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </Link>
      <button 
        className="add-to-cart-btn" 
        onClick={(e) => {
          e.preventDefault();
          addToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;