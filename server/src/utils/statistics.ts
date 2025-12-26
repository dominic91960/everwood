import Statistics from "../models/statistics";
import { OrderProduct } from "../models/order";

const onCreateOrder = async (products: OrderProduct[], grandTotal: number) => {
  let statistics = await Statistics.findOne();
  if (!statistics) statistics = await Statistics.create({});
  if (!statistics) return;

  const productList = statistics.topProducts.map((tp) => ({
    product: tp.product.toString(),
    purchasedTimes: tp.purchasedTimes,
  }));
  products.forEach((p) => {
    const existingProductIndex = productList.findIndex(
      (ep) => ep.product === p.product.toString()
    );

    if (existingProductIndex !== -1) {
      productList[existingProductIndex].purchasedTimes += p.orderQuantity;
    } else {
      productList.push({
        product: p.product.toString(),
        purchasedTimes: p.orderQuantity,
      });
    }
  });

  const earningsList = statistics.monthlyEarnings.map((e) => ({
    date: e.date,
    earnings: e.earnings,
  }));
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const existingEarningsRecordIndex = earningsList.findIndex(
    (e) => e.date === currentDate
  );
  if (existingEarningsRecordIndex !== -1) {
    earningsList[existingEarningsRecordIndex].earnings += grandTotal;
  } else {
    earningsList.push({
      date: currentDate,
      earnings: grandTotal,
    });
  }

  await Statistics.findOneAndUpdate(
    {},
    {
      $inc: { totalOrders: 1, totalEarnings: grandTotal },
      $set: {
        topProducts: productList,
        monthlyEarnings: earningsList,
      },
    },
    { new: true, runValidators: true }
  );
};

const onDeleteOrder = async (
  products: OrderProduct[],
  createdAt: NativeDate,
  grandTotal: number
) => {
  const statistics = await Statistics.findOne();
  if (!statistics) return;

  let productList = statistics.topProducts.map((tp) => ({
    product: tp.product.toString(),
    purchasedTimes: tp.purchasedTimes,
  }));
  products.forEach((p) => {
    const existingProductIndex = productList.findIndex(
      (ep) => ep.product === p.product.toString()
    );

    if (
      existingProductIndex !== -1 &&
      productList[existingProductIndex].purchasedTimes === p.orderQuantity
    ) {
      productList = productList.filter(
        (ep) => ep.product !== p.product.toString()
      );
    } else if (existingProductIndex !== -1) {
      productList[existingProductIndex].purchasedTimes -= p.orderQuantity;
    }
  });

  let earningsList = statistics.monthlyEarnings.map((e) => ({
    date: e.date,
    earnings: e.earnings,
  }));
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const existingEarningsRecordIndex = earningsList.findIndex(
    (e) => e.date === date
  );
  if (
    existingEarningsRecordIndex !== -1 &&
    earningsList[existingEarningsRecordIndex].earnings === grandTotal
  ) {
    earningsList = earningsList.filter((e) => e.date !== date);
  } else if (existingEarningsRecordIndex !== -1) {
    earningsList[existingEarningsRecordIndex].earnings -= grandTotal;
  }

  await Statistics.findOneAndUpdate(
    {},
    {
      $inc: { totalOrders: -1, totalEarnings: -grandTotal },
      $set: {
        topProducts: productList,
        monthlyEarnings: earningsList,
      },
    },
    { new: true, runValidators: true }
  );
};

export { onCreateOrder, onDeleteOrder };
