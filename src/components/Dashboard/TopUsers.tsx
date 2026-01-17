import { useNavigate } from "react-router-dom";
import { TopAffiliateType } from "../../types";

type Props = {
  users: TopAffiliateType[];
};

const TopUsers = ({ users }: Props) => {
  const navigation = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg max-w-full">
      <div className="flex justify-between items-center mb-2 pt-2 px-4">
        <h3 className="text-lg text-blue-800 font-bold mb-4 text-center align-center pt-2">
          Top Users
        </h3>
        <button
          className="ml-4 text-violet-800 underline cursor-pointer px-2 py-2  rounded-md hover:bg-violet-300"
          onClick={() => navigation("/users?role=user")}
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse whitespace-nowrap">
          <thead className="bg-violet-800 text-white">
            <tr className="uppercase text-xs">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Business Name</th>
              <th className="py-3 px-4 text-left">Total Sale</th>
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
