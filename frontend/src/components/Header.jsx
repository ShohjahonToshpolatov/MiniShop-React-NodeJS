export default function Header({
  user,
  cartCount,
  onLogin,
  onLogout,
  onNavigate,
}) {
  return (
    <header className="header">
      <h1 className="logo" onClick={() => onNavigate("shop")}>
        {" "}
        🛍️ Shop
      </h1>

      <nav className="nav">
        <button onClick={() => onNavigate("shop")}>Mahsulotlar</button>

        <button onClick={() => onNavigate("cart")}>
          🛒 Savat
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            <span className="user">👨‍💼 {user.name}</span>
            <button className="btn-outline" onClick={onLogout}>
              Chiqish
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={onLogin}>
            Kirish
          </button>
        )}
      </nav>
    </header>
  );
}
