type Props = {
  orders?: any[];
};

function TotalOrderMetrics({ orders }: Props) {
  const pendingOrders = orders?.filter((item) => item.status === 0);
  const approvedOrders = orders?.filter((item) => item.status === 1);

  console.log("approvedOrders", approvedOrders);
  return (
    <>
      <div className="relative bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 opacity-40">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0) 60%, rgba(255,255,255,0.25) 100%)]"></div>
          <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle, rgba(255,255,255,0.0) 0, rgba(255,255,255,0.0) 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)]"></div>
        </div>

        <h3 className="text-lg font-semibold z-10 text-green-600">
          Order Metrics
        </h3>
        <div className="w-full z-10">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="py-2 text-left">Total</td>
                <td className="py-2 text-right">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                    {orders?.length || 0}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-left">Pending</td>
                <td className="py-2 text-right">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                    {pendingOrders?.length || 0}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-left">Approved</td>
                <td className="py-2 text-right">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                    {approvedOrders?.length || 0}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TotalOrderMetrics;
