import { useState, useEffect } from "react";
import { getOrders } from "@/services/orderService";
import { getProductImage } from "@/utils/imageHelper";

export function mapOrder(apiOrder: any) {
  return {
    id: apiOrder.orderId?.toString() || apiOrder.id?.toString() || "",
    placedAt: apiOrder.orderDate || new Date().toISOString(),
    status: apiOrder.status || "Confirmed",
    paymentMethod: apiOrder.paymentMethod || "Online",
    total: apiOrder.totalAmount || apiOrder.total || 0,
    savings: 0,
    address: {
      name: apiOrder.address?.fullName || apiOrder.address?.name || "User",
      line1: apiOrder.address?.street || apiOrder.address?.line1 || "",
      line2: apiOrder.address?.line2 || "",
      city: apiOrder.address?.city || "",
      state: apiOrder.address?.state || "",
      pincode: apiOrder.address?.zipCode || apiOrder.address?.pincode || "",
    },
    items: (apiOrder.orderItems || apiOrder.items || []).map((i: any) => {
      const imageId =
        i.subProduct?.productImageList?.[0]?.id ||
        i.subProduct?.productImageList?.[0]?.productImageId ||
        i.subProduct?.productImageId ||
        null;
      return {
        product: {
          id: i.subProduct?.id?.toString() || i.subProduct?.subProductId?.toString() || "",
          name: i.subProduct?.productName || i.subProduct?.name || "",
          price: i.sellingPricePerUnit || 0,
          offerPrice: i.sellingPricePerUnit || 0,
          image: getProductImage(imageId),
        },
        qty: i.quantity || 1,
      };
    }),
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("emailId")) {
      setLoading(false);
      return;
    }

    getOrders()
      .then((res) => {
        const arr = Array.isArray(res) ? res : res?.data || [];
        setOrders(arr.map(mapOrder));
      })
      .catch((err) => console.error("Failed to load orders", err))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading };
};
