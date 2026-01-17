type Props = {};

function TotalPendingApproval({}: Props) {
  return (
    <>
      <div className="relative bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 opacity-40">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0) 60%, rgba(255,255,255,0.25) 100%)]"></div>
          <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle, rgba(255,255,255,0.0) 0, rgba(255,255,255,0.0) 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)]"></div>
        </div>

        <h3 className="text-lg font-semibold z-10 text-red-600">
          Total Pending Approval
        </h3>
        <div className="w-full z-10">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="py-2 text-left">Products</td>
                <td className="py-2 text-right">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                    12
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-left">Seller</td>
                <td className="py-2 text-right">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                    8
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

export default TotalPendingApproval;
