import { Card } from "./Card";
import CardItem from "./CardItem";

export default function Cart({ items, onRemove, onClear, onCheck }) {
  if (items.length === 0) {
    return (
      <Card className="center">
        <h3>Savat bosh 😔</h3>
        <p>Mahsulotlar sahifasidan biror narsa qo'shing</p>
      </Card>
    );
  }

  const total = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <Card>
      <h3>Savat</h3>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Mahsulot</th>
            <th>Soni</th>
            <th>Narxi</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <CardItem item={item} onRemove={onRemove} />
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-footer">
        <b>Jami :{total.toLocaleString()} som</b>
      </div>

      <button className="btn-outline" onClick={onClear}>
        Tozalash
      </button>
      <button className="btn-primary" onClick={onCheck}>
        Buyurtma berish
      </button>
    </Card>
  );
}
