import { useState, useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string[]>) => void;
}

const filterTabs = ["Category", "Brand", "Discount", "Price"];

const discountOptions = ["10% & above", "20% & above", "30% & above", "50% & above"];
const priceOptions = ["Under ₹100", "₹100 – ₹300", "₹300 – ₹500", "Above ₹500"];

const FilterDrawer = ({ open, onClose, onApply }: FilterDrawerProps) => {
  const [activeTab, setActiveTab] = useState("Category");
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  const toggle = (group: string, value: string) => {
    setSelected((s) => {
      const arr = s[group] || [];
      return {
        ...s,
        [group]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const categories = useCategories();

  console.log("Categories from API:", categories);

  const getOptions = () => {
    if (activeTab === "Category") return categories.map((c: any) => ({ id: c.primaryCategoryId?.toString(), label: c.primaryCategoryName }));
    if (activeTab === "Brand") return [];
    if (activeTab === "Discount") return discountOptions.map((d) => ({ id: d, label: d }));
    return priceOptions.map((p) => ({ id: p, label: p }));
  };

  const totalSelected = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);

  const tabCount = (tab: string) => (selected[tab] || []).length;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        style={{
          transition: "opacity 0.25s ease",
          opacity: visible ? 1 : 0,
        }}
        onClick={handleClose}
      />

      <div
        className="relative flex flex-col rounded-t-2xl bg-background shadow-2xl"
        style={{
          maxHeight: "78vh",
          transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1), opacity 0.25s ease",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-foreground" strokeWidth={2.2} />
            <span className="text-base font-bold text-foreground tracking-tight">Filters</span>
            {totalSelected > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
                {totalSelected}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden border-t border-border">
          <div className="flex w-28 shrink-0 flex-col border-r border-border bg-muted/40 overflow-y-auto">
            {filterTabs.map((tab) => {
              const count = tabCount(tab);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center justify-between px-4 py-3.5 text-left transition-colors ${
                    isActive
                      ? "bg-background text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-foreground" />
                  )}
                  <span className="text-xs">{tab}</span>
                  {count > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "Brand" ? (
              <div className="p-4 text-sm text-muted-foreground">No brand data available.</div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {getOptions().map((opt) => {
                  const isChecked = (selected[activeTab] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggle(activeTab, opt.id)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                        isChecked
                          ? "bg-foreground text-background"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xs font-medium">{opt.label}</span>
                      {isChecked && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background/20">
                          <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-border px-4 py-4">
          <button
            onClick={() => setSelected({})}
            disabled={totalSelected === 0}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={() => {
              onApply(selected);
              handleClose();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Apply
            {totalSelected > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background/20 text-[9px] font-bold">
                {totalSelected}
              </span>
            )}
          </button>
        </div>

        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
};

export default FilterDrawer;
