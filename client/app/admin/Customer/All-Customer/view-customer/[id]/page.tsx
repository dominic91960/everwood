"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { User } from "@/lib/types";
import api from "@/lib/axios-instance";
import Header from "./components/header/Header";
import FormTabs from "./components/form-tabs/FormTabs";

const AdminViewCustomerPage = () => {
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/${userId}`);
        const data = res.data;

        setUser(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <section className="relative leading-[1.1]">
      <div className="max-w-7xl text-[13px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[19px] 2xl:text-[20px]">
        {error && (
          <div className="flex h-[3em] items-center justify-center text-center">
            <p>Error</p>
          </div>
        )}

        {!error && loading && (
          <div className="flex h-[3em] items-center justify-center text-center">
            <p>Loading...</p>
          </div>
        )}

        {!error && !loading && !user && (
          <div className="flex h-[3em] items-center justify-center text-center">
            <p>User not found</p>
          </div>
        )}

        {!error && !loading && user && (
          <>
            <Header user={user} />
            <FormTabs user={user} />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminViewCustomerPage;
