import { Search, ShoppingCart, User, Package, X, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useState, useRef, useEffect, useMemo } from "react";
import { formatPrice } from "@/utils/helpers";

const Header = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const products: any[] = [];
  const cartAmount = totalItems();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const liveResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return [];
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 dark:bg-[#0a0a0a] backdrop-blur-xl dark:backdrop-blur-none border-b border-border dark:border-[#1f1f1f]">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0 active:opacity-70 transition-opacity"
          >
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-foreground">
              <ShoppingCart className="h-4 w-4 text-background" strokeWidth={2} />
            </div>
            <span className="hidden sm:block text-[17px] font-semibold tracking-tight text-foreground">
              Swift<span className="text-primary">Cart</span>
            </span>
          </button>

          <div className="hidden md:flex flex-1 max-w-lg mx-auto relative">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2.5 rounded-full bg-secondary px-4 py-2.5 border border-transparent transition-all duration-200 focus-within:bg-card focus-within:border-border focus-within:shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>
          </div>

          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden flex-1 flex items-center gap-2.5 rounded-full bg-secondary px-4 py-2.5 text-sm text-muted-foreground active:bg-border transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span>Search products...</span>
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            {[
              { icon: RotateCcw, label: "Buy Again", path: "/buy-again" },
              { icon: Package, label: "Orders", path: "/orders" },
              { icon: User, label: "Account", path: "/account" },
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            ))}

            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 ml-0.5"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.7} />
              <span className="text-[10px] font-medium">Cart</span>
              {cartAmount > 0 && (
                <span
                  key={cartAmount}
                  className="absolute -top-0.5 right-1.5 flex h-[17px] min-w-[17px] animate-badge-pop items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold"
                >
                  {cartAmount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-background dark:bg-[#080808] animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <button
              onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary active:scale-90 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2.5 rounded-full bg-secondary px-4 py-2.5 focus-within:bg-background focus-within:border focus-within:border-border transition-all">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}> 
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </form>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim().length < 2 ? (
              <div className="p-5 text-sm text-muted-foreground">Type to search backend products.</div>
            ) : (
              <div>
                {liveResults.length > 0 ? null : (
                  <div className="py-24 flex flex-col items-center justify-center text-center">
                    <p className="text-base font-semibold text-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
