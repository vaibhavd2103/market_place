"use client";

import API from "@/constants/APIs";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";
import instance from "@/utils/axios";
import { GetToken, GetUser } from "@/utils/helper";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Approver() {
  const router = useRouter();
  const currentUser = GetUser();
  const { logout } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const token = GetToken();

  const getProductsToApprove = async () => {
    try {
      const res = await instance.get(API.GET_NON_APPROVED_PRODUCTS, {
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

  const approveProduct = async (productId: string) => {
    try {
      const res = await instance.post(
        `${API.APPROVE_PRODUCT}`,
        {
          productId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      getProductsToApprove();
    } catch (error) {
      const axiosError = error as AxiosError; // type assertion here
      // console.log(axiosError);
      // if (axiosError.response?.status === 401) {
      //   localStorage.removeItem("token");
      //   router.push("/login");
      // }
      alert(axiosError);
    }
  };

  useEffect(() => {
    getProductsToApprove();
  }, []);

  return (
    <div className="container">
      <h1 className="title my-2">Approver Dashboard</h1>
      <div className="flex justify-between items-center w-full px-4">
        <p>
          Welcome <span className="subtitle">{currentUser.username}!</span>
        </p>
        <button className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="px-4 mt-8">
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {allProducts.map((item) => {
            return (
              <div key={item._id} className="card">
                <h2 className="bold">{item.title}</h2>
                <p className="normal">{item.description}</p>
                <p className="bold ">${item.price}</p>
                <p>
                  Seller: <span className="bold">{item.seller.username}</span>
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    approveProduct(item._id);
                  }}
                >
                  Approve
                </button>
                {/* <button onClick={() => {}}>Reject</button> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Approver;
