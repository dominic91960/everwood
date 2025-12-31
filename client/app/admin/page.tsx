"use client";

import React, { useEffect, useState } from "react";

import api from "@/lib/axios-instance";
import { StatisticsData } from "@/lib/types";

import Error from "@/components/admin/dashboard-page/Error";
import Loading from "@/components/admin/dashboard-page/Loading";
import Header from "@/components/admin/dashboard-page/header/Header";
import TopProducts from "@/components/admin/dashboard-page/top-products/TopProducts";
import MonthlyEarnings from "@/components/admin/dashboard-page/monthly-earnings/MonthlyEarnings";
import Orders from "@/components/admin/dashboard-page/orders/Orders";

function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<StatisticsData>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/statistics`);
        const data = res.data;

        setFetchedData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <Error />}
      {!error && loading && <Loading />}
      {!error && !loading && fetchedData && (
        <>
          <Header
            totalProducts={fetchedData.totalProducts}
            totalCustomers={fetchedData.totalCustomers}
            totalOrders={fetchedData.totalOrders}
            totalEarnings={fetchedData.totalEarnings}
          />
          <div className="mt-[1em] grid grid-cols-1 gap-[0.5em] leading-[1.1] 2xl:grid-cols-2">
            <TopProducts topProducts={fetchedData.topProducts} />
            <MonthlyEarnings monthlyEarnings={fetchedData.monthlyEarnings} />
          </div>
          <Orders />
        </>
      )}
    </>
  );
}

export default AdminDashboardPage;
