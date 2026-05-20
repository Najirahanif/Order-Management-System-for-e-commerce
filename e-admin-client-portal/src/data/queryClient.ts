import axios from "axios";

const BASE_URL = "http://localhost:3100";

export const orderApi = {
  createOrder: async (data: any) => {
    const res = await axios.post(`${BASE_URL}/createOrder`, data);
    return res.data;
  },

  getOrders: async () => {
    const res = await axios.get(`${BASE_URL}/orders`);
    return res.data;
  },
};

export const productApi = {
  getProducts: async () => {
    const res = await axios.get(`https://dummyjson.com/products`);
    return res.data.products;
  },
};