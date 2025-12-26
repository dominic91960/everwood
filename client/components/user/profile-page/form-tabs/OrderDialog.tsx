import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/user/ui/Dialog";

import { FetchedOrder } from "@/lib/types";

type OrderDialogProps = { order: FetchedOrder };

const OrderDialog: React.FC<OrderDialogProps> = ({ order }) => {
  return (
    <Dialog>
      <DialogTrigger className="hover:bg-foreground focus:text-background hover:text-background focus:bg-foreground border-foreground rounded-[0.5em] border px-[1em] py-[0.7em] text-[0.8em] transition-colors duration-300">
        View Details
      </DialogTrigger>
      <DialogContent className="flex max-h-3/5 w-8/10 min-w-3/10 flex-col overflow-hidden rounded-[1em] p-[2em] pb-[3em] text-[12px] sm:w-fit sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
        <div className="border-foreground/30 absolute inset-0 rounded-[1em] border"></div>

        <DialogTitle className="relative mb-[0.5em] shrink-0 text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
          Order {order.shortId}
        </DialogTitle>

        <div className="overflow-auto pr-2">
          {order.products.map(
            ({ product, attributes, orderQuantity, totalPrice }, i) => (
              <div key={i} className="relative py-[1em]">
                <div className="bg-foreground/30 absolute right-0 bottom-0 left-0 h-px"></div>

                <div className="mb-[0.3em] flex items-center justify-between text-[1.2em] font-medium">
                  <p>{product.title}</p>
                  <p className="text-foreground/60">
                    {attributes.map(({ selectedVariation }, i) => (
                      <span key={selectedVariation}>
                        {selectedVariation}
                        {i + 1 !== attributes.length && "/"}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex gap-[1.5em]">
                  <div className="bg-foreground/10 relative w-[5em] rounded-[0.2em]">
                    <Image
                      src={product.productImages[0]}
                      alt="title"
                      className="object-contain object-center"
                      fill
                    />
                  </div>

                  <div className="grow">
                    <div className="flex items-center justify-between">
                      <p>Price:</p>
                      <p>Rs {product.discountPrice.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Qty:</p>
                      <p>{orderQuantity}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>Total:</p>
                      <p>Rs {totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="relative mt-[1em] shrink-0 space-y-[0.5em] pr-2">
          <div className="flex items-center justify-between text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
            <p>Items Subtotal:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p>Rs {order.subTotal.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
            <p>Shipping:</p>
            <p>Rs {order.shippingCost.toFixed(2)}</p>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
              <p className="text-[#0BDB45]">Coupon:</p>
              <p>Rs {order.discountAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="bg-foreground/30 h-px"></div>
          <div className="flex items-center justify-between text-[12px] font-medium sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
            <p>Order Total:</p>
            <p>Rs {order.grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
