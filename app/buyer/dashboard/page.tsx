// import Image from "next/image";
"use client";
import API from "@/constants/APIs";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import instance from "@/utils/axios";
import { GetToken, GetUser } from "@/utils/helper";
import { Modal } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const currentUser = GetUser();
  const token = GetToken();

  const [products, setProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [openModal, setOpenModal] = useState(false);
  const [order, setOrder] = useState({
    sellerId: "",
    quantity: 0,
    productId: "",
    buyerId: currentUser.id,
  });

  const getAllProducts = async () => {
    try {
      const res = await instance.get(API.GET_PRODUCTS);
      console.log(res.data);
      setProducts(res.data.products);
    } catch (err) {
      const axiosError = err as AxiosError;
      alert(axiosError);
    }
  };

  const placeOrder = async () => {
    try {
      const res = await instance.post(
        API.PLACE_ORDER,
        {
          ...order,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      getMyOrders();
      setOpenModal(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      alert(axiosError);
    }
  };

  const getMyOrders = async () => {
    try {
      const res = await instance.get(API.BUYER_ORDERS, {
        params: {
          buyerId: currentUser.id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data);
      setMyOrders(res.data.orders);
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError);
    }
  };

  const { logout } = useAuth();

  useEffect(() => {
    getAllProducts();
    getMyOrders();
  }, []);

  return (
    <>
      <div className="h-screen flex- flex-col container">
        <h1 className="title my-2">Buyer Dashboard</h1>
        <div className="flex justify-between items-center w-full px-4">
          <p>
            Welcome <span className="subtitle">{currentUser.username}!</span>
          </p>
          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="px-4">
          <h1 className="head mt-4">All Products</h1>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((item) => {
              return (
                <div key={item._id} className="card">
                  <p className="bold">{item.title}</p>
                  <p className="normal text-ellipsis">{item.description}</p>
                  <p className="bold">${item.price}</p>
                  <button
                    className="btn-primary py-1 px-3"
                    onClick={() => {
                      setSelectedProduct(item);
                      setOpenModal(true);
                      setOrder((prev) => {
                        return {
                          ...prev,
                          productId: item._id,
                          sellerId: item.seller._id,
                        };
                      });
                    }}
                  >
                    Buy
                  </button>
                </div>
              );
            })}
          </div>
          <h1 className="head mt-8">My Orders</h1>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {myOrders.map((item) => {
              return (
                <div key={item._id} className="card relative">
                  <h2 className="bold">{item.product.title}</h2>
                  <p className="bold absolute top-2 right-2">
                    X{item.quantity}
                  </p>
                  <p className="bold text-violet-500">
                    ${item.product.price * item.quantity}
                  </p>
                  <p
                    className="px-2 py-1 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor:
                        item.status === "pending" ? "#dc2626 " : "#16a34a ",
                      width: "auto",
                    }}
                  >
                    Status: {item.status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex justify-center items-center outline-none border-none"
      >
        <div className="flex flex-col py-8 bg-white gap-2 p-4h-auto w-1/2 max-w-[500px] min-w-[200px] self-center rounded-xl items-center">
          <p className="head">{selectedProduct?.title}</p>
          <p className="normal">{selectedProduct?.description}</p>
          <div className="flex gap-8 items-center">
            <input
              type="number"
              placeholder="Quantity"
              value={order.quantity}
              onChange={(e) => {
                setOrder({ ...order, quantity: parseInt(e.target.value) });
              }}
              className="input"
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              placeOrder();
            }}
          >
            Place order
          </button>
        </div>
        {/* </ModalContent> */}
      </Modal>
    </>
  );
}
