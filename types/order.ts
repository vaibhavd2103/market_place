export interface Order {
  _id: string;
  buyer: {
    _id: string;
    username: string;
  };
  product: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Buyer {
  _id: string;
  username: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
}
