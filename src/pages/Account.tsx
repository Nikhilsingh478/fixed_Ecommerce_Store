import { ArrowLeft, ChevronRight, ShoppingBag, Wallet, Phone, LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav/BottomNav";

const policyLinks = [
  { label: "About Us", path: "/static/about" },
  { label: "Terms of Use", path: "/static/terms" },
  { label: "Privacy Policy", path: "/static/privacy" },
  { label: "Shipping Policy", path: "/static/shipping" },
  { label: "Cancellation Policy", path: "/static/cancellation" },
  { label: "Return Policy", path: "/static/return" },
  { label: "Refund Policy", path: "/static/refund" },
];

const Account = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const menuItems = [
    { label: "Your Orders", icon: ShoppingBag, onClick: () => navigate("/orders") },
    { label: "Your Wallet", icon: Wallet, rightText: "₹ 5", onClick: () => {} },
    { 
      label: "Dark Mode", 
      icon: isDark ? Moon : Sun, 
      isToggle: true, 
      onClick: () => setTheme(isDark ? "light" : "dark") 
    },
    { label: "Contact Us", icon: Phone, onClick: () => {} },
    { label: "Logout", icon: LogOut, onClick: () => { import("@/services/authService").then(m => m.logout()); } },
  ];

  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-300 pb-16 bg-background text-foreground">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background dark:bg-[#0a0a0a] border-b border-border dark:border-[#1f1f1f] px-4 py-3">
        <button onClick={() => navigate(-1)} className="active:scale-90 transition-transform"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <span className="text-[15px] font-semibold text-foreground tracking-tight">Account</span>
      </div>

      <div className="bg-card p-5 mt-1 border-b border-border/40 shadow-sm">
        <p className="text-[15px] font-semibold text-foreground">+91 98765 43210</p>
        <p className="text-[12px] font-medium text-muted-foreground mt-0.5">My Account</p>
      </div>

      <div className="mt-2 bg-card border-y border-border/40 shadow-sm">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="flex w-full items-center gap-3.5 border-b border-border/40 px-4 py-3.5 last:border-b-0 group active:bg-muted/50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
              <item.icon className={`h-4 w-4 transition-colors duration-300 ${item.isToggle && isDark ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
            </div>
            <span className="flex-1 text-left text-[14px] font-medium text-foreground">{item.label}</span>
            {item.rightText && (
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mr-1">
                {item.rightText}
              </span>
            )}
            {item.isToggle ? (
              <div 
                className={`relative inline-flex h-[22px] w-[38px] shrink-0 items-center justify-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${isDark ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <span className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-background shadow-sm ring-0 transition-transform duration-300 ease-in-out ${isDark ? 'translate-x-[8px]' : '-translate-x-[8px]'}`} />
              </div>
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-active:translate-x-0.5" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-2 flex-1 bg-card border-t border-border/40 shadow-sm">
        {policyLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className="flex w-full items-center justify-between border-b border-border/40 px-4 py-3 last:border-b-0 active:bg-muted/50 transition-colors group"
          >
            <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{link.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-active:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
