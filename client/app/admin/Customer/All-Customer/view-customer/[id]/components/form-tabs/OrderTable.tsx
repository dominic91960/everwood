"use client";

import React, { useEffect, useState } from "react";

import api from "@/lib/axios-instance";
import { FetchedOrder, User } from "@/lib/types";
import TableRow from "@/components/user/profile-page/form-tabs/TableRow";

type BillingFormProps = { user: User };

const OrderTable: React.FC<BillingFormProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<FetchedOrder[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/order/user/${user._id}`);
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
        <div className="grid grid-cols-1 gap-[1.5em] sm:grid-cols-2">
          {fetchedData.map((order) => (
            <TableRow key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTable;
