import { useNavigate } from "react-router-dom";
import { TopAffiliateType } from "../../types";

type Props = {
  sellers: TopAffiliateType[];
};

const TopSeller = ({ sellers }: Props) => {
  const navigation = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-slate-100 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-50">
        <h3 className="text-base text-slate-800 font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Top Sellers
        </h3>
        <button
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors cursor-pointer"
          onClick={() => navigation("/users?role=seller")}
        >
          View All
        </button>
      </div>

      <div className="overflow-x-hidden">
        <table className="w-full text-sm border-collapse whitespace-nowrap">
          <thead className="bg-blue-600 text-white font-semibold">
            <tr className="uppercase text-[11px] tracking-wider">
              <th className="py-4 px-5 text-left">Business Name</th>
              <th className="py-4 px-5 text-left">Total Sale</th>
              <th className="py-4 px-5 text-left">Volume</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className=" hover:bg-gray-50">
                <td className="py-2 px-4">{seller.businessName}</td>
                <td className="py-2 px-4">{seller.totalSale}</td>
                <td className="py-2 px-4">{seller.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSeller;
