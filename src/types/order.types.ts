import OrderProduct from "./orderProduct";

type Order = {
  id?: string;
  status: "active" | "complete";
  user_Id: string;
  orderProducts?: OrderProduct[];
};

export default Order;
