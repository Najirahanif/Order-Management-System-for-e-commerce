"use client";

import { useMutation } from "@tanstack/react-query";
import { orderApi } from "../queryClient";

export function useCreateOrder() {
  return useMutation({
    mutationFn: orderApi.createOrder,
  });
}

