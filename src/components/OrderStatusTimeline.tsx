import moment from "moment";
import clsx from "clsx";
// import { STATUS_LABEL } from "../utils/Constant";
import OrderStatusTag from "../utils/OrderStatusTag";

interface OrderStatusHistory {
  changedBy: string;
  oldStatus: number | string;
  newStatus: number;
  reason: string;
  timestamp: string;
}

interface Props {
  history: OrderStatusHistory[];
}

const OrderStatusTimelineHorizontal = ({ history }: Props) => {
  if (!history?.length) {
    return <p className="text-sm text-gray-400">No status history</p>;
  }

  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto">
      <h3 className="font-semibold mb-4">Order Status</h3>

      <div className="flex items-start gap-6 min-w-max">
        {history.map((item, index) => {
          const isCompleted = index < history.length - 1;
          const isCancelled = item.newStatus === 5;

          return (
            <div key={index} className="flex items-center gap-4">
              {/* Status */}
              <div className="flex flex-col items-center text-center min-w-[120px]">
                <div
                  className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold",
                    isCancelled
                      ? "bg-red-500"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-blue-500"
                  )}
                >
                  {index + 1}
                </div>

                <p className="mt-2 font-medium text-sm">
                  {/* {STATUS_LABEL[item.newStatus] || item.newStatus} */}
                  <OrderStatusTag
                    status={item.newStatus}
                    size="md"
                    type="order"
                  />
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {moment(item.timestamp).format("DD MMM")}
                </p>

                {item.reason && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {item.reason}
                  </p>
                )}
              </div>

              {/* Connector */}
              {index < history.length - 1 && (
                <div
                  className={clsx(
                    "h-1 w-16 rounded",
                    isCancelled ? "bg-red-300" : "bg-green-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimelineHorizontal;
