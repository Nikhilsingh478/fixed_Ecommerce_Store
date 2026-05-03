import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import { getProductImage } from "@/utils/imageHelper";

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

const mapProduct = (item: any, subCategoryId?: string | number, primaryCategoryId?: string | number): Product => {
  const subProduct = item.subProduct ?? item;
  const imageId = item.productImageList?.[0]?.id ?? item.productImageList?.[0]?.productImageId ?? item.productImageId ?? null;

  return {
    id: subProduct.subProductId?.toString() || subProduct.id?.toString() || item.subProductId?.toString() || item.id?.toString() || "",
    name: item.productName || subProduct.productName || item.name || subProduct.name || "",
    price: Number(subProduct.sellingPrice || subProduct.price || 0),
    mrp: Number(subProduct.mrp || subProduct.maximumRetailPrice || subProduct.sellingPrice || subProduct.price || 0),
    offerPrice: Number(subProduct.sellingPrice || subProduct.price || 0),
    discount: Number(subProduct.discountPercent || 0),
    image: getProductImage(imageId),
    brand: item.brand?.brandName || item.brandName || "",
    category: primaryCategoryId?.toString() || "",
    subcategory: subCategoryId?.toString() || "",
  };
};

export const useProducts = (primaryCategoryId?: number | string, subCategoryId?: number | string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesRes = await api.get("/primarycategory", {
          headers: { pageNumber: "1" },
        });

        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.data || [];
        console.log("Categories:", categories);

        const categoryIds = primaryCategoryId
          ? [primaryCategoryId.toString()]
          : categories.map((category: any) => category.primaryCategoryId?.toString()).filter(Boolean);

        const allSubCategories = await Promise.all(
          categoryIds.map(async (catId) => {
            const subRes = await api.get("/subcategory", {
              headers: {
                primaryCategoryId: catId,
                pageNumber: "1",
              },
            });
            return Array.isArray(subRes.data) ? subRes.data : subRes.data?.data || [];
          }),
        );

        const subCategories = allSubCategories.flat();
        const filteredSubCategories = subCategoryId
          ? subCategories.filter((sub: any) => sub.subCategoryId?.toString() === subCategoryId.toString())
          : subCategories;

        const productGroups = await Promise.all(
          filteredSubCategories.map(async (sub: any) => {
            const productRes = await api.get("/product", {
              headers: {
                subCategoryId: sub.subCategoryId?.toString(),
                pageNumber: "1",
              },
            });
            return {
              subCategoryId: sub.subCategoryId,
              primaryCategoryId: sub.primaryCategoryId,
              products: Array.isArray(productRes.data) ? productRes.data : productRes.data?.data || [],
            };
          }),
        );

        const mapped = productGroups.flatMap((group) =>
          group.products.map((item: any) => mapProduct(item, group.subCategoryId, group.primaryCategoryId)),
        );

        if (active) {
          console.log("Products:", mapped);
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (active) {
          setProducts([]);
          setError("Failed to load products");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [primaryCategoryId, subCategoryId]);

  return { products, loading, error };
};
