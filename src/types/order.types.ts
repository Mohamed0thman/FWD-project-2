export type Order = {
  id?: string;
  status: "active" | "complete";
  user_Id: string;
  Order_product: Order_product[];
};

export type Order_product = {
  id?: string;
  quantity: number;
  order_Id?: string;
  product_Id: string;
};
