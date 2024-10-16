export type NewProduct = {
  title: string;
  price: number;
  description: string;
  sellerId: string;
  _id?: string;
};

export type Product = {
  _id: string;
  seller: {
    _id: string;
    username: string;
  };
  title: string;
  description: string;
  price: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
