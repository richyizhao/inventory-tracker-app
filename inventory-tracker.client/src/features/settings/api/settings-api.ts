import { request } from "@/lib/http";

export type DemoDataResult = {
  usersCreated: number;
  productsCreated: number;
  transactionsCreated: number;
  usersRemoved: number;
  productsRemoved: number;
  transactionsRemoved: number;
  message: string;
};

export function generateDemoData(token: string) {
  return request<DemoDataResult>("/Settings/demo-data/generate", {
    method: "POST",
    token,
  });
}

export function resetDemoData(token: string) {
  return request<DemoDataResult>("/Settings/demo-data/reset", {
    method: "POST",
    token,
  });
}
