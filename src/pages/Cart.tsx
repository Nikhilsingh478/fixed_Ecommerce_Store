import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/helpers";
import BottomNav from "@/components/BottomNav/BottomNav";
import Header from "@/components/Header/Header";

const Cart = () => {
  const navigate = useNavigate();
  const { items, increaseQty, decreaseQty, removeFromCart, totalPrice } = useCart();

  const savings = items.reduce(
    (acc, item) => acc + ((item.product?.mrp || 0) - (item.product?.offerPrice || 0)) * item.qty,
    0
  );

  const cartTotal = totalPrice();
  const deliveryFee = cartTotal >= 499 ? 0 : 40;

  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col bg-background animate-fade-in pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="hidden md:block"><Header /></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-8">
          <div className="h-20 w-20 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-foreground px-8 py-3 text-sm font-medium text-background hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Start Shopping
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background animate-fade-in pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="sticky top-0 z-40 flex md:hidden items-center gap-3 bg-card/90 backdrop-blur-xl px-4 py-3.5 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary active:scale-90 transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <span className="text-[17px] font-semibold text-foreground">Cart</span>
          <span className="ml-1.5 text-[13px] text-muted-foreground">({items.length})</span>
        </div>
      </div>

      <div className="hidden md:block"><Header /></div>

      <main className="flex-1 w-full mx-auto max-w-2xl px-0 md:px-6 flex flex-col pt-0 md:pt-10 md:pb-16">
        <h1 className="hidden md:block text-3xl font-semibold text-foreground tracking-tight mb-8">
          Cart <span className="text-muted-foreground text-2xl font-normal">({items.length})</span>
        </h1>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2 px-4 md:px-0 py-2">
            {items.map((item, i) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl bg-card border border-border/60 p-4 animate-slide-right"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {item.product.image ? (
                  <div className="h-[70px] w-[70px] shrink-0 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-[70px] w-[70px] shrink-0 rounded-xl bg-background border border-border" />
                )}

                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground line-clamp-2 leading-snug">
                    {item.product.name}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-semibold text-foreground">
                      {formatPrice(item.product.offerPrice)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 line-through">
                      {formatPrice(item.product.mrp)}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-0.5">
                      <button
                        onClick={() => decreaseQty(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-card border border-border active:scale-90 transition-transform"
                      >
                        <Minus className="h-3 w-3 text-foreground" strokeWidth={2.5} />
                      </button>
                      <span className="px-2.5 text-[12px] font-semibold text-foreground">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-foreground active:scale-90 transition-transform"
                      >
                        <Plus className="h-3 w-3 text-background" strokeWidth={2.5} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-90 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>

                <span className="shrink-0 text-[13px] font-semibold text-foreground">
                  {formatPrice(item.product.offerPrice * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {savings > 0 && (
            <div className="mx-4 md:mx-0 mt-2 flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 px-4 py-2.5 animate-fade-up">
              <span className="text-[12px] font-medium text-green-700 dark:text-green-400">
                You save {formatPrice(savings)} on this order 🎉
              </span>
            </div>
          )}

          {deliveryFee > 0 && (
            <div className="mx-4 md:mx-0 mt-2 rounded-xl border border-border bg-card px-4 py-2.5">
              <span className="text-[12px] text-muted-foreground">
                Add <span className="font-semibold text-foreground">{formatPrice(499 - cartTotal)}</span> more for <span className="font-semibold text-foreground">FREE delivery</span>
              </span>
            </div>
          )}

          <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:relative md:bottom-auto z-40 mx-4 md:mx-0 mt-4 rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                  {deliveryFee > 0 ? `Total + ₹${deliveryFee} delivery` : "Total · Free delivery ✓"}
                </p>
                <p className="text-[22px] font-bold text-foreground tracking-tight">
                  {formatPrice(cartTotal + deliveryFee)}
                </p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center justify-center min-w-[130px] rounded-xl bg-foreground px-7 py-3.5 text-[14px] font-semibold text-background hover:opacity-90 active:scale-[0.97] transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Cart;
