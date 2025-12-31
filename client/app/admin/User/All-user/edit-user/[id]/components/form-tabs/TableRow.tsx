import React from "react";

import { FetchedOrder } from "@/lib/types";
import { getPaymentStatus } from "@/lib/utils";

import OrderDialog from "./OrderDialog";

type TableRowProps = { order: FetchedOrder };

const TableRow: React.FC<TableRowProps> = ({ order }) => {
  const getDate = (d: string) => new Date(d).toLocaleDateString("en-GB");

  return (
    <div className="relative grid grid-cols-6 py-[1em] font-light">
      <div className="via-foreground absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent to-transparent"></div>
      <div>{order.shortId}</div>
      <div>{getDate(order.createdAt)}</div>
      <div>{order.grandTotal.toFixed(2)}</div>
      <div className="col-span-2">{getPaymentStatus(order.status)}</div>
      <OrderDialog order={order} />
    </div>
  );
};

export default TableRow;
