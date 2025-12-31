import React from "react";
// import ProductForm from "./components/ProductForm";
import ProductForm from "./componentss/ProductForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function page({ params }: PageProps) {
  const { id } = await params;
  return <ProductForm productId={id} />;
}

export default page;
