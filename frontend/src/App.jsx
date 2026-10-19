import { useState, useEffect } from "react";
import { request } from "./api";
import Header from "./components/Header";
import AuthForm from "./components/Auth";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Modal from "./components/Modal";

import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("shop");
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    try {
      return saved?.startsWith('"') ? JSON.parse(saved) : saved;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let active = true;
    request("/products")
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((e) => {
        if (active) setMessage(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function addToCart(product) {
    if (!product.in_stock || ordering) return;
    const item = cart.find((p) => p.id === product.id);
    if (item && item.quantity >= 20) {
      setMessage("Bir mahsulotdan ko'pi bilan 20 dona olish mumkin");
      return;
    }
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
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
    localStorage.setItem("token", data.token);
    setShowAuth(false);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCart([]);
  }

  async function checkout() {
    if (ordering || cart.length === 0) return;
    if (!user || !token) return setShowAuth(true);
    setOrdering(true);
    try {
      const items = cart.map((p) => ({ productId: p.id, quantity: p.quantity }));
      const data = await request("/orders", {
        method: "POST",
        body: { items },
        token,
      });
      setMessage(
        `✅ Buyurtma #${data.order.id} qabul qilindi!`,
      );
      clearCart();
      setPage("shop");
    } catch (e) {
      setMessage("❌ " + e.message);
      if (e.status === 401) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setShowAuth(true);
      }
    } finally {
      setOrdering(false);
    }
  }
  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

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
        <ProductList products={products} loading={loading} onAdd={addToCart} />
      ) : (
        <Cart
          items={cart}
          onRemove={removeFromCart}
          onClear={clearCart}
          onCheck={checkout}
          ordering={ordering}
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
