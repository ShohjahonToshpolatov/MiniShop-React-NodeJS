import { Fragment } from "react";

export default function CartItem({ item, onRemove }) {
  return (
    <Fragment>
      <td>{item.title}</td>
      <td>{item.quantity}</td>
      <td>{(item.price * item.quantity).toLocaleString()} som</td>

      <td>
        <button className="btn-danger" onClick={() => onRemove(item.id)}>
          🗑️ O'chirish
        </button>
      </td>
    </Fragment>
  );
}
