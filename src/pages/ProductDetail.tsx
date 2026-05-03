import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Header from "@/components/Header/Header";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getDiscountLabel } from "@/utils/helpers";
import BottomNav from "@/components/BottomNav/BottomNav";
import { useCartStore } from "@/store/useCartStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore(state => state.items);
  const product = location.state?.product || cartItems.find(i => i.product.id === id)?.product;
  const { addToCart, increaseQty, decreaseQty, getQty } = useCart();
  const qty = getQty(id || "");

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const similar: any[] = [];
  const boughtTogether: any[] = [];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-3 bg-background dark:bg-[#0a0a0a] border-b border-border dark:border-[#1f1f1f] px-4 py-3.5">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary active:scale-90 transition-all">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="flex-1 text-[16px] font-semibold text-foreground line-clamp-1">{product.name}</span>
      </div>

      <div className="hidden md:block"><Header /></div>

      <main className="flex-1 w-full mx-auto max-w-7xl md:px-6 lg:px-8 pt-0 md:pt-10">
        <div className="flex flex-col md:flex-row md:gap-16">
          <div className="w-full md:w-5/12 animate-fade-up">
            <div className="relative aspect-square bg-card border border-border md:rounded-2xl md:shadow-sm overflow-hidden flex items-center justify-center p-8">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-contain animate-float" />
              ) : (
                <div className="h-full w-full" />
              )}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 rounded-full bg-success/10 px-3 py-1 text-[11px] font-medium text-success">
                  {getDiscountLabel(product.discount)}
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col bg-card md:bg-transparent px-5 pt-5 pb-6 md:p-0 md:py-2 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-[22px] md:text-3xl font-semibold text-foreground leading-tight tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3 mb-5">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-700/40 px-2.5 py-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[12px] font-semibold text-amber-700 dark:text-amber-400">4.3</span>
              </div>
              <span className="text-[12px] text-muted-foreground">1,284 ratings</span>
            </div>
            <div className="flex items-end gap-3 pb-5 border-b border-border">
              <span className="text-[30px] md:text-4xl font-semibold text-foreground tracking-tight">{formatPrice(product.offerPrice)}</span>
              {product.mrp > product.offerPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through mb-0.5">{formatPrice(product.mrp)}</span>
                  <span className="mb-0.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                    {getDiscountLabel(product.discount)}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-5 mb-6">
              {[
                { icon: Truck, label: "10-min delivery" },
                { icon: ShieldCheck, label: "100% genuine" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
                  <span className="text-[12px] font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              {qty === 0 ? (
                <button onClick={() => addToCart(product)} className="rounded-xl bg-foreground px-10 py-3.5 text-[15px] font-medium text-background hover:opacity-90 active:scale-[0.98] transition-all">Add to Cart</button>
              ) : (
                <div className="flex h-[52px] items-center gap-6 rounded-xl bg-foreground px-5 text-background">
                  <button onClick={() => decreaseQty(product.id)} className="p-1.5 active:scale-90 transition-transform hover:bg-muted/50 rounded-lg"><Minus className="h-5 w-5" strokeWidth={2} /></button>
                  <span className="min-w-[24px] text-center text-lg font-semibold">{qty}</span>
                  <button onClick={() => increaseQty(product.id)} className="p-1.5 active:scale-90 transition-transform hover:bg-muted/50 rounded-lg"><Plus className="h-5 w-5" strokeWidth={2} /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10 md:mt-16 px-4 md:px-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <h2 className="text-[17px] font-semibold text-foreground tracking-tight mb-5">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {similar.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {boughtTogether.length > 0 && (
          <div className="mt-8 md:mt-12 px-4 md:px-0 mb-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
            <h2 className="text-[17px] font-semibold text-foreground tracking-tight mb-5">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {boughtTogether.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>

      <div className="md:hidden fixed inset-x-0 z-50 flex items-center justify-between bg-card/95 backdrop-blur-xl px-5 pt-3 pb-4 border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}>
        <div>
          <span className="text-[20px] font-semibold text-foreground tracking-tight">{formatPrice(product.offerPrice)}</span>
          {product.mrp > product.offerPrice && <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(product.mrp)}</span>}
        </div>
        {qty === 0 ? (
          <button onClick={() => addToCart(product)} className="rounded-xl bg-foreground px-7 py-2.5 text-[14px] font-medium text-background hover:opacity-90 active:scale-[0.97] transition-all">Add to Cart</button>
        ) : (
          <div className="flex h-[42px] items-center gap-5 rounded-xl bg-foreground px-5 text-background">
            <button onClick={() => decreaseQty(product.id)} className="active:scale-90 transition-transform"><Minus className="h-4 w-4" strokeWidth={2} /></button>
            <span className="min-w-[20px] text-center font-semibold">{qty}</span>
            <button onClick={() => increaseQty(product.id)} className="active:scale-90 transition-transform"><Plus className="h-4 w-4" strokeWidth={2} /></button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProductDetail;
