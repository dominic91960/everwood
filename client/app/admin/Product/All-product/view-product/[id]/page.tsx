import React from 'react'
import ProductView from './components/ProductView'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function page({ params }: PageProps) {
  const { id } = await params
  return (
    <ProductView productId={id} />
  )
}

export default page
