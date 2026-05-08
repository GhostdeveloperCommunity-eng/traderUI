import { useNavigate } from "react-router-dom";
import { TopAffiliateType } from "../../types";

type Props = {
  users: TopAffiliateType[];
};

const TopUsers = ({ users }: Props) => {
  const navigation = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-slate-100 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-50">
        <h3 className="text-base text-slate-800 font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Top Users
        </h3>
        <button
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors cursor-pointer"
          onClick={() => navigation("/users?role=user")}
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse whitespace-nowrap">
          <thead className="bg-blue-600 text-white font-semibold">
            <tr className="uppercase text-[11px] tracking-wider">
              <th className="py-4 px-5 text-left">Name</th>
              <th className="py-4 px-5 text-left">Business Name</th>
              <th className="py-4 px-5 text-left">Total Sale</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className=" hover:bg-gray-50">
                <td className="py-2 px-4">{user.fName}</td>
                <td className="py-2 px-4">{user.businessName}</td>
                <td className="py-2 px-4">{user.totalSale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsers;
