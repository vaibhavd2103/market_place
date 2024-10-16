"use client";

import API from "@/constants/APIs";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/order";
import { NewProduct, Product } from "@/types/product";
import instance from "@/utils/axios";
import { GetToken, GetUser } from "@/utils/helper";
import { Modal } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Seller() {
  const router = useRouter();
  const currentUser = GetUser();
  const { logout } = useAuth();
  const [newProduct, setNewProduct] = useState<NewProduct>({
    title: "",
    description: "",
    price: 1,
    sellerId: currentUser.id,
    _id: "",
  });
  // const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const token = GetToken();

  const addProduct = async () => {
    try {
      const res = await instance.post(
        API.CREATE_PRODUCT,
        {
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          sellerId: currentUser.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setOpenModal(false);
      getAllSellerProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = async () => {
    try {
      const res = await instance.post(
        API.EDIT_PRODUCT,
        {
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          sellerId: currentUser.id,
          _id: newProduct._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setOpenModal(false);
      getAllSellerProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await instance.post(
        API.DELETE_PRODUCT,
        {
          productId,
          sellerId: currentUser.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      getAllSellerProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSellerProducts = async () => {
    try {
      const res = await instance.get(API.GET_SELLER_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sellerId: currentUser.id,
        },
      });
      console.log(res.data);
      setAllProducts(res.data.products);
    } catch (error) {
      const axiosError = error as AxiosError; // type assertion here
      console.log(axiosError);
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      alert(error);
    }
  };

  const getAllPendingOrders = async () => {
    try {
      const res = await instance.get(API.GET_SELLER_PENDING_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sellerId: currentUser.id,
        },
      });
      console.log(res.data);
      setPendingOrders(res.data.orders);
    } catch (error) {
      const axiosError = error as AxiosError; // type assertion here
      console.log(axiosError);
      alert(axiosError);
    }
  };

  const approveOrder = async (orderId: string) => {
    try {
      const res = await instance.post(
        API.APPROVE_ORDER,
        { orderId, sellerId: currentUser.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      getAllPendingOrders();
    } catch (error) {
      const axiosError = error as AxiosError; // type assertion here
      console.log(axiosError);
      alert(axiosError);
    }
  };

  useEffect(() => {
    getAllSellerProducts();
    getAllPendingOrders();
  }, []);

  return (
    <>
      <div className="h-screen flex- flex-col container">
        <h1 className="title my-2">Seller Dashboard</h1>
        <div className="flex justify-between items-center w-full px-4">
          <p>
            Welcome <span className="subtitle">{currentUser.username}!</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              className="btn-primary"
              onClick={() => {
                setMode("ADD");
                setOpenModal(true);
              }}
            >
              Add Product
            </button>
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="px-4">
          <h1 className="head mt-4">Pending Orders</h1>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {pendingOrders.map((item) => {
              return (
                <div key={item._id} className="card">
                  <p className="bold">{item.product.title}</p>
                  <p>
                    Quantity: <span className="bold">{item.quantity}</span>
                  </p>
                  <p>
                    Buyer: <span className="bold">{item.buyer.username}</span>
                  </p>
                  <button
                    className="btn-primary px-3 py-1"
                    onClick={() => {
                      approveOrder(item._id);
                    }}
                  >
                    Approve Order
                  </button>
                </div>
              );
            })}
          </div>
          <h1 className="head mt-8">My Products</h1>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {allProducts.map((item) => {
              return (
                <div key={item._id} className="card">
                  <p className="bold">{item.title}</p>
                  <p className="normal text-ellipsis line-clamp-1">
                    {item.description}
                  </p>
                  <p className="bold">${item.price}</p>
                  <p
                    className="bold"
                    style={{ color: item.approved ? "green" : "red" }}
                  >
                    {item.approved ? "Approved" : "Not Approved"}
                  </p>
                  <div className="flex justify-between w-full">
                    <button
                      onClick={() => {
                        setNewProduct({
                          title: item.title,
                          description: item.description,
                          price: item.price,
                          sellerId: item.seller._id,
                          _id: item._id,
                        });
                        setMode("EDIT");
                        setOpenModal(true);
                      }}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteProduct(item._id);
                      }}
                      className="btn-secondary bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        // onClose={() => setOpenModal(false)}
        className="flex justify-center items-center outline-none border-none"
      >
        <div className="flex flex-col gap-2 p-4 bg-white h-auto w-1/2 max-w-[500px] min-w-[200px] self-center rounded-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "EDIT") editProduct();
              else addProduct();
            }}
            action=""
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct?.title}
              className="input "
              onChange={(e) => {
                setNewProduct((prev) => {
                  return { ...prev, title: e.target.value };
                });
              }}
            />
            <textarea
              // type="text"
              placeholder="Product Description"
              value={newProduct?.description}
              className="input"
              onChange={(e) => {
                setNewProduct((prev) => {
                  return { ...prev, description: e.target.value };
                });
              }}
            />
            <input
              type="number"
              placeholder="Price"
              min="1"
              value={newProduct?.price}
              className="input "
              onChange={(e) => {
                setNewProduct((prev) => {
                  return { ...prev, price: parseInt(e.target.value) };
                });
              }}
            />
            <button type="submit" className="btn-primary">
              {mode === "ADD" ? "Add Product" : "Edit "}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setOpenModal(false)}
            >
              Close
            </button>
          </form>
        </div>
        {/* </ModalContent> */}
      </Modal>
    </>
  );
}

export default Seller;
