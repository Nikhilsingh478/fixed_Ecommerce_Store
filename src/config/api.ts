// Central API configuration
// Override via VITE_API_URL in .env (Vite project)
export const BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8080/ecommerce";

export const API_ENDPOINTS = {
  // Auth
  login: "/login",
  applicationUser: "/applicationuser",

  // Products
  allProducts: "/allproduct",
  product: "/product",
  search: "/search",

  // Categories
  allPrimaryCategories: "/allprimarycategory",
  primaryCategories: "/primarycategory",
  subCategories: "/subcategory",

  // Cart
  addToCart: "/addtocart",
  viewCart: "/viewcart",
  removeFromCart: "/removefromcart",

  // Orders
  orders: "/order",
  orderDetails: "/orderdetails",
  invoice: "/invoice",
  cancelOrder: "/cancelorder",

  // Address
  address: "/address",

  // Product image
  productImage: (id: string | number) => `/productimage?productImageId=${id}`,
} as const;
