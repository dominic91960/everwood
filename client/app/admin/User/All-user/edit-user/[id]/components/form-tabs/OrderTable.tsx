"use client";

import React, { useEffect, useState } from "react";

import api from "@/lib/axios-instance";
import { FetchedOrder } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

import TableRow from "./TableRow";

const OrderTable = () => {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<FetchedOrder[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/order/user/${user?._id}`);
        const data = res.data;

        setFetchedData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
      {error && <p>Error</p>}
      {!error && loading && <p>Loading</p>}
      {!error && !loading && fetchedData.length === 0 && <div>No data</div>}
      {!error && !loading && fetchedData.length > 0 && (
        <>
          <div className="relative grid grid-cols-6 pb-[1em]">
            <div className="via-foreground absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent to-transparent"></div>
            <div>Order Code</div>
            <div>Order Date</div>
            <div>Amount</div>
            <div className="col-span-2">Status</div>
            <div>Action</div>
          </div>

          {fetchedData.map((order) => (
            <TableRow key={order._id} order={order} />
          ))}
        </>
      )}
    </div>
  );
};

export default OrderTable;
