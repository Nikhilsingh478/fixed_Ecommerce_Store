import { useState, useEffect } from "react";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from "@/services/cartService";
import { getProductImage, FALLBACK_IMAGE } from "@/utils/imageHelper";

export function mapCartItem(item: any) {
  const imageId =
    item.subProduct?.productImageList?.[0]?.id ||
    item.subProduct?.productImageList?.[0]?.productImageId ||
    item.subProduct?.productImageId ||
    null;

  return {
    product: {
      id: item.subProduct?.id?.toString() || item.subProduct?.subProductId?.toString() || "",
      name: item.subProduct?.productName || item.subProduct?.name || "Product",
      price: item.sellingPricePerUnit || item.subProduct?.sellingPrice || 0,
      offerPrice: item.sellingPricePerUnit || item.subProduct?.sellingPrice || 0,
      mrp: item.subProduct?.mrp || item.sellingPricePerUnit || 0,
      image: imageId ? getProductImage(imageId) : FALLBACK_IMAGE,
    },
    qty: item.quantity || 1,
    cartId: item.cart?.id || item.cart?.cartId || "",
  };
}

let globalCartItems: any[] = [];
let globalCartId: string = "";
let listeners: Array<(items: any[], cartId: string) => void> = [];

export const refreshCart = async () => {
  try {
    const data = await getCart();
    const arr = Array.isArray(data) ? data : (data?.items || data?.cartItems || []);
    const mapped = arr.map(mapCartItem);
    globalCartItems = mapped;
    if (mapped.length > 0) {
      globalCartId = mapped[0].cartId?.toString();
    }
    listeners.forEach((l) => l(mapped, globalCartId));
  } catch (err) {
    console.error("Cart fetch failed", err);
  }
};

export const useCart = () => {
  const [items, setItems] = useState<any[]>(globalCartItems);
  const [cartId, setCartId] = useState<string>(globalCartId);

  useEffect(() => {
    const handler = (newItems: any[], newCartId: string) => {
      setItems(newItems);
      setCartId(newCartId);
    };
    listeners.push(handler);
    if (!globalCartItems.length) {
      if (localStorage.getItem("emailId")) {
        refreshCart();
      }
    }
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  const addToCart = async (product: any, qty = 1) => {
    try {
      if (!product || !product.id) return;
      await apiAddToCart(product.id, qty);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = async (productId: string | number) => {
    try {
      await apiAddToCart(productId, 1);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (productId: string | number) => {
    const item = items.find((i) => i.product?.id === productId?.toString());
    if (!item) return;
    if (item.qty <= 1) {
      return removeFromCart(productId);
    }
    try {
      await apiAddToCart(productId, -1);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId: string | number) => {
    try {
      await apiRemoveFromCart(productId);
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const getQty = (productId: string | number) => {
    return items.find((i) => i.product?.id === productId?.toString())?.qty || 0;
  };

  const totalItems = () => items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = () => items.reduce((sum, i) => sum + (i.product?.offerPrice || 0) * i.qty, 0);

  const clearCart = () => {
    globalCartItems = [];
    globalCartId = "";
    listeners.forEach((l) => l([], ""));
  };

  return {
    items,
    cartId,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    getQty,
    totalItems,
    totalPrice,
    clearCart,
  };
};
