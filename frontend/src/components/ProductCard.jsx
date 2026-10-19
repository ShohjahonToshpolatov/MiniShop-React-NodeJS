import { Card } from "./Card";

export default function ProductCard({ product, onAdd }) {
  const { title, price, image, in_stock } = product;

  return (
    <Card>
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p className="price">{price.toLocaleString()} so'm</p>

      {in_stock ? (
        <button className="btn-primary" onClick={() => onAdd(product)}>
          Savatga qoshilsin
        </button>
      ) : (
        <span className="out">Tugagan</span>
      )}
    </Card>
  );
}
