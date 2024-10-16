const API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  CREATE_PRODUCT: "/products/createProduct",
  GET_PRODUCTS: "/products/getProducts",
  GET_SELLER_PRODUCTS: "/products/getSellerProducts",
  GET_NON_APPROVED_PRODUCTS: "/products/getNonApprovedProducts",
  APPROVE_PRODUCT: "/products/approveProductById",
  PLACE_ORDER: "/orders/createOrder",
  GET_SELLER_PENDING_ORDERS: "/orders/getSellerPendingOrders",
  BUYER_ORDERS: "/orders/getBuyerOrders",
  APPROVE_ORDER: "/orders/approveOrder",
  EDIT_PRODUCT: "/products/updateProductById",
  DELETE_PRODUCT: "/products/deleteProductById",
  // REJECT_PRODUCT: "/products/rejectProduct",
  // UPDATE_PRODUCT: "/products/updateProduct",
  // GET_ALL_PRODUCTS: "/products/getAllProducts",
};

export default API;
