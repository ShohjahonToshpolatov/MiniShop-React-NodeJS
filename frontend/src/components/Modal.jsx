export default function Modal({ title, children, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head}">
          <h3>{title}</h3>
          <button onClick={onClose}>❌</button>
        </div>
        {children}
      </div>
    </div>
  );
}
