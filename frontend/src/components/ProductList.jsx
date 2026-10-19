import ProductCard from "./ProductCard";

export default function ProductList({ products, onAdd }) {
  if (products.length === 0) {
    return <p className="empty">Mahsulotlar yuklanmoqda...</p>;
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
