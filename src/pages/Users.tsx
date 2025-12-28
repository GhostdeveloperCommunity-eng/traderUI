import { useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import { IUser } from "../types";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import moment from "moment";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";

  const fetchUsers = async () => {
    const query = new URLSearchParams();
    if (search) query.append("search", search.toLowerCase());
    if (role) query.append("role", role.toLowerCase());

    const url = getCompleteUrlV1(`profile/getAllProfiles?${query.toString()}`);

    const res = await httpClient.get(url);
    const json = await res.json();
    const data = json.data ?? [];

    const filtered: IUser[] = data.map((u: any) => ({
      role: u.role,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      affiliateId: u.affiliateId,
      phoneNumber: u.phoneNumber,
      createdAt: u.createdAt,
      seller: u.seller
        ? {
            businessName: u.seller.businessName,
            address: u.seller.address,
            aadhaarNumber: u.seller.aadhaarNumber,
            gstNumber: u.seller.gstNumber,
          }
        : undefined,
    }));

    setUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("search", value);
      return p;
    });
  };

  const handleRole = (value: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("role", value);
      return p;
    });
  };

  return (
    <div className="p-2">
      <div className="bg-white shadow-md rounded-lg  p-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/users" },
            { label: "Users", to: "/users" },
          ]}
        />
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={role}
            onChange={(e) => handleRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="user">User/Buyer</option>
            <option value="seller">Seller</option>
            <option value="promoter">Promoter</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Table inside scroll container */}
        <div className=" md:block w-full overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm border-collapse">
            <thead className="bg-violet-800 text-white sticky top-0 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Register Date",
                  "Role",
                  "Affiliate ID",
                  "Seller Business",
                  "GST No",
                  "Address",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                >
                  <td className="px-3 py-2">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.phoneNumber}</td>
                  <td className="px-3 py-2">
                    {moment(u.createdAt).format("DD MMM YYYY")}
                  </td>
                  <td className="px-3 py-2">{u.role?.join(", ")}</td>
                  <td className="px-3 py-2">{u.affiliateId || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.businessName || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.gstNumber || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="mt-4 text-[15px] text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
