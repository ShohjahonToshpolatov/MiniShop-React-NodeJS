import ProductCard from "./ProductCard";

export default function ProductList({ products, loading, onAdd }) {
  if (loading) {
    return <p className="empty">Mahsulotlar yuklanmoqda...</p>;
  }

  if (products.length === 0) {
    return <p className="empty">Hozircha mahsulotlar yo'q</p>;
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
