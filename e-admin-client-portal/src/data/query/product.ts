"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "../queryClient";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });
}