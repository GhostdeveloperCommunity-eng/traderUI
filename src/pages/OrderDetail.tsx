import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import moment from "moment";
import { capitalize } from "../utils/utils";
import StatusTag from "../utils/StatusTag";
import { Order } from "../types";
import Breadcrumb from "../components/Breadcrumb";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import CardSkeleton from "../components/CardSkeleton";
import OrderStatusTag from "../utils/OrderStatusTag";

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    setIsLoading(true);
    const res = await httpClient.get(getCompleteUrlV1(`order/${id}`));
    const json = await res.json();
    setOrder(json.data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (isLoading)
    return (
      <div>
        <CardSkeleton />
      </div>
    );
  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/users" },
          { label: "Order", to: "/orders" },
          { label: "Order Detail", to: "detail" },
        ]}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col flex-1">
          <h2 className="text-lg font-bold mb-2">
            Order #{order.numericOrderId}
          </h2>

          <p>
            <strong>Date:</strong>{" "}
            {moment(order.createdAt).format("DD-MM-YYYY HH:mm")}
          </p>

          <div className="flex flex-row justify-between items-center mt-2 mb-2">
            <p>
              <strong className="mr-2">Order Status:</strong>{" "}
              <OrderStatusTag status={order.status} size="md" type="order" />
            </p>

            <p>
              <strong className="mr-2">Payment Method:</strong>
              <OrderStatusTag
                status={order.paymentMethod}
                size="md"
                type="payment"
              />
            </p>
          </div>

          <div className="mt-3 p-3 border rounded-lg bg-gray-50 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{order.totalMrpWithQuantity}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount ({order.totalDiscountPercentage}%)</span>
              <span>-₹{order.totalDiscountWithQuantity}</span>
            </div>

            <div className="flex justify-between font-semibold text-indigo-600 border-t pt-2">
              <span>Total Payable</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center">
          {order.address && (
            <div>
              <div className="flex flex-row justify-between">
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                <StatusTag status={order.address.isActive} />
              </div>

              <p>{order.address.name}</p>
              <p>{order.address.addressLine1}</p>

              {order.address.addressLine2 && (
                <p>{order.address.addressLine2}</p>
              )}

              <p>
                {capitalize(order.address.city)},{" "}
                {capitalize(order.address.state)}
                {order.address.postalCode && ` - ${order.address.postalCode}`}
              </p>

              {order.address.phone && <p>Phone: {order.address.phone}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Product List</h3>
        <table className="w-full border text-sm mt-2 mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-2 text-center">S.No</th>

              <th className="py-2 px-2 text-center">Brand</th>
              <th className="py-2 px-2 text-center">Image</th>
              <th className="py-2 px-2 text-center">Qty</th>
              <th className="py-2 px-2 text-center">Promoter Commission</th>

              <th className="py-2 px-2 text-center">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, idx) => (
              <tr key={item._id} className="border-t">
                <td className="py-2 px-2 text-center">{idx + 1}.</td>

                <td className="py-2 px-2 text-center">{item.brand}</td>
                <td className="py-2 px-2 text-center">
                  {item?.media?.length ? (
                    <img
                      src={item.media[0]}
                      alt="Product"
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </td>
                <td className="py-2 px-2 text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-center">
                  ₹{item.promoterCommission}
                </td>
                <td className="py-2 px-2 text-center">₹{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Order Status Timeline</h3>

          <OrderStatusTimeline history={order.statusChangeLogs} />
        </div>
      </div>
    </div>
  );
};
