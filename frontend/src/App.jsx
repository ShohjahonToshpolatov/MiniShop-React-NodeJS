import { useState, useEffect } from "react";
import { request } from "./api";
import Header from "./components/Header";
import AuthForm from "./components/Auth";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Modal from "./components/Modal";

import "./index.css";

function App() {
  const [products, setProducts] = useState();
  const [cart, setCart] = useState();
  const [page, setPage] = useState();
  const [showAuth, setShowAuth] = useState(false);
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    JSON.parse(localStorage.getItem("user"));
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    request("/products")
      .then(setProducts)
      .catch((e) => {
        setMessage(e.message);
      });
  });

  function addToCart(product) {
    setCart((prev) => {
      const found = prev.find((p) => {
        p.id === product.id;
      });
      if (found) {
        return prev.map((p) => {
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p;
        });
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function handleAuth(data) {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", JSON.stringify(data.token));
    setShowAuth(false);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.clear();
  }

  async function checkout() {
    if (!user) return setShowAuth(true);
    try {
      const items = cart.map((p) => ({ producId: p.id, quantity: p.quantity }));
      const data = await request("/orders", {
        method: "POST",
        body: { items },
        token,
      });
      setMessage(
        `✅ Buyurma #${data.order.id} qabul qilindi ! Emailingizni tekshiring`,
      );
      clearCart();
      setPage("shop");
    } catch (e) {
      setMessage("❌ " + e.message);
    }
  }
  const cartCount = Cart.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="container">
      <Header
        user={user}
        cartCount={cartCount}
        onLogin={() => setShowAuth(true)}
        onLogout={logout}
        onNavigate={setPage}
      />

      {message && (
        <div className="alert" onClick={() => setMessage("")}>
          {message} <small>(yopish uchun bosing)</small>
        </div>
      )}

      {page === "shop" ? (
        <ProductList products={products} onAdd={addToCart} />
      ) : (
        <Cart
          items={cart}
          onRemove={removeFromCart}
          onClear={clearCart}
          onCheck={checkout}
        />
      )}

      {showAuth && (
        <Modal title="Tizimga kirish" onClose={() => setShowAuth(false)}>
          <AuthForm onSuccess={handleAuth} />
        </Modal>
      )}
    </div>
  );
}

export default App;
