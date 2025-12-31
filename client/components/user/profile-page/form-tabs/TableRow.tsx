import React from "react";

import { FetchedOrder } from "@/lib/types";
import { getPaymentStatus } from "@/lib/utils";

import OrderDialog from "./OrderDialog";

type TableRowProps = { order: FetchedOrder };

const TableRow: React.FC<TableRowProps> = ({ order }) => {
  const getDate = (d: string) => new Date(d).toLocaleDateString("en-GB");

  return (
    <div className="to-primary/20 border-foreground/5 relative flex flex-col gap-[0.5em] rounded-[1em] border bg-gradient-to-b from-transparent p-[1em] font-light">
      <div className="flex justify-between text-[1.2em] font-normal">
        <p>Order {order.shortId}</p>
        <p>{getPaymentStatus(order.status)}</p>
      </div>

      <div className="mt-[1em] flex justify-between">
        <p>Order Date</p>
        <p>{getDate(order.createdAt)}</p>
      </div>

      <div className="mb-[1em] flex justify-between">
        <p>Order Amount</p>
        <p>Rs. {order.grandTotal.toFixed(2)}</p>
      </div>

      <OrderDialog order={order} />
    </div>
  );
};

export default TableRow;
