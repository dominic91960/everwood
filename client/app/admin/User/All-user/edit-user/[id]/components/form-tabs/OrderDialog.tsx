import React from "react";
import Image from "next/image";

import { MdRemoveRedEye } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/user/ui/Dialog";

import { FetchedOrder } from "@/lib/types";
import eclipse from "@/public/images/eclipse.svg";

type OrderDialogProps = { order: FetchedOrder };

const OrderDialog: React.FC<OrderDialogProps> = ({ order }) => {
  return (
    <Dialog>
      <DialogTrigger className="opacity-70 hover:opacity-100">
        <MdRemoveRedEye />
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-[1em] p-[2em] pb-[3em] text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
        <Image src={eclipse} alt="" className="absolute inset-0 object-cover" />
        <div className="border-foreground/30 absolute inset-0 rounded-[1em] border"></div>

        <DialogTitle className="relative mb-[0.5em] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
          Order {order.shortId}
        </DialogTitle>
        <div className="relative grid grid-cols-8 gap-[1.5em] pb-[1em]">
          <div className="via-foreground absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent to-transparent"></div>
          <div>Image</div>
          <div className="col-span-2">Product</div>
          <div className="col-span-2">Price</div>
          <div>Qty</div>
          <div className="col-span-2"> Total</div>
        </div>

        {order.products.map(({ product, orderQuantity, totalPrice }, i) => (
          <div
            key={i}
            className="relative grid grid-cols-8 items-center gap-[1.5em] py-[1em]"
          >
            <div className="via-foreground absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent to-transparent"></div>
            <div className="bg-foreground/10 relative size-[3em] rounded-full">
              <Image
                src={product.productImages[0]}
                alt="title"
                className="object-contain object-center"
                fill
              />
            </div>
            <div className="col-span-2">{product.title}</div>
            <div className="col-span-2">
              Rs {product.discountPrice.toFixed(2)}
            </div>
            <div>{orderQuantity}</div>
            <div className="col-span-2">Rs {totalPrice.toFixed(2)}</div>
          </div>
        ))}

        <div className="relative ms-auto mt-[1em] min-w-1/2 space-y-[0.5em]">
          <div className="flex items-center justify-between text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]">
            <p>Items Subtotal:</p>
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

          <div className="via-foreground h-[1px] bg-gradient-to-r from-transparent to-transparent"></div>
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
