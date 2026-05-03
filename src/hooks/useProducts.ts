import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import { getProductImage, FALLBACK_IMAGE } from "@/utils/imageHelper";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  offerPrice: number;
  discount: number;
  image: string;
  brand: string;
  category: string;
  subcategory: string;
}

export const mapProduct = (
  item: any,
  subCategoryId?: string | number,
  primaryCategoryId?: string | number
): Product => {
  const imageId =
    item.productImageList?.[0]?.id ||
    item.productImageList?.[0]?.productImageId ||
    item.productImageId ||
    null;

  return {
    id: item.subProduct?.id?.toString() || item.subProduct?.subProductId?.toString() || item.id?.toString() || "",
    name: item.productName || item.name || "Product",
    price: item.subProduct?.sellingPrice || 0,
    mrp: item.subProduct?.mrp || item.subProduct?.sellingPrice || 0,
    offerPrice: item.subProduct?.sellingPrice || 0,
    discount: item.subProduct?.discountPercent || 0,
    image: imageId ? getProductImage(imageId) : FALLBACK_IMAGE,
    brand: item.brand?.brandName || item.brandName || "",
    category: primaryCategoryId?.toString() || "",
    subcategory: subCategoryId?.toString() || "",
  };
};

const productCache = new Map<string, Product[]>();

export const useProducts = (subCategoryId: number | string, primaryCategoryId?: number | string) => {
  const [data, setData] = useState<Product[]>(() => {
    const key = subCategoryId?.toString();
    return key ? (productCache.get(key) || []) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!subCategoryId) return;
    const key = subCategoryId.toString();

    if (productCache.has(key)) {
      setData(productCache.get(key)!);
      return;
    }

    setLoading(true);
    api
      .get("/product", {
        headers: {
          subCategoryId: key,
          pageNumber: "1",
        },
      })
      .then((res) => {
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data?.products || res.data?.data || [];
        const mapped = raw.map((item: any) => mapProduct(item, subCategoryId, primaryCategoryId));
        productCache.set(key, mapped);
        setData(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subCategoryId, primaryCategoryId]);

  return { products: data, loading };
};
