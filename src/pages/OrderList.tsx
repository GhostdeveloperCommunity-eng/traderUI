import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import DebounceSearch from "../components/DebounceSearch";
import CardSkeleton from "../components/CardSkeleton";
import PaginationControl from "../components/PaginationControl";
import { capitalize } from "../utils/utils";
import { Link } from "react-router-dom";
import { Order, Pagination } from "../types";
import OrderStatusTag from "../utils/OrderStatusTag";

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [startDate, setStartDate] = useState(
    moment().subtract(2, "months").startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("day").toISOString());

  const [pagination, setPagination] = useState<Pagination>({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);

    const res = await httpClient.get(
      getCompleteUrlV1("order", {
        page,
        limit: pagination.limit,
        startDate,
        endDate,
      })
    );

    const json = await res.json();

    setOrders(json.data);
    setFilteredOrders(json.data);
    setPagination(json.pagination || pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders(1);
  }, [startDate, endDate]);

  const onPageChange = (page: number) => {
    fetchOrders(page);
  };

  /* ================= UI ================= */

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* FILTERS */}
        <div className="flex flex-wrap justify-between gap-4 mb-4">
          <DebounceSearch
            products={orders}
            setSearchProduct={setFilteredOrders}
            placeholder="Search order..."
          />

          <div className="flex gap-3">
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                value={moment(startDate).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setStartDate(
                    moment(e.target.value).startOf("day").toISOString()
                  )
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                type="date"
                value={moment(endDate).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setEndDate(moment(e.target.value).endOf("day").toISOString())
                }
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-violet-800 text-white">
            <tr>
              <th className="py-3 px-3 text-left">Order ID</th>
              <th className="py-3 px-3 text-left">Date</th>
              <th className="py-3 px-3 text-left">Total</th>
              <th className="py-3 px-3 text-left">Status</th>
              <th className="py-3 px-3 text-left">Address</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <CardSkeleton />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredOrders.map((order) => (
                <Fragment key={order._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">
                      #{order.numericOrderId}
                    </td>
                    <td className="py-2 px-3">
                      {moment(order.createdAt)
                        .local()
                        .format("DD-MM-YYYY HH:mm")}
                    </td>
                    <td className="py-2 px-3">₹{order.totalAmount}</td>
                    <td className="py-2 px-3">
                      <OrderStatusTag
                        status={order.status}
                        size="md"
                        type="order"
                      />
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {order.address ? (
                        <>
                          <div>{capitalize(order.address.city)},</div>
                          <div>
                            {capitalize(order.address.state)}{" "}
                            {order.address.postalCode}
                          </div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-md hover:bg-purple-200 transition"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          )}
        </table>

        <div className="mt-6 bg-white rounded-lg border">
          <PaginationControl
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
