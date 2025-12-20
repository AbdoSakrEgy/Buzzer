import { Footer, Navbar } from "@/src/components/layout";
import React from "react";
import OrderDetailsView from "./sections/order.details.view";

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetails({ params }: OrderDetailsProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <OrderDetailsView orderId={id} />
      <Footer />
    </div>
  );
}
