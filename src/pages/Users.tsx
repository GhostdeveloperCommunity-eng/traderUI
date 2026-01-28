import { useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import { IUser } from "../types";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import moment from "moment";
import UserDataByRole from "./UserDataByRole";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const [userRole, setUserRole] = useState<string>(role);

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
    setUserRole(value);
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
            { label: "Dashboard", to: "/dashboard" },
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
        <div className="relative w-full max-w-full overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block w-full overflow-x-auto">
            <UserDataByRole users={users} userRole={userRole} />
          </div>

          {/* MOBILE GRID (NO HORIZONTAL SCROLL) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {users.map((u, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Name</span>
                  <span>
                    {u.firstName} {u.lastName}
                  </span>

                  <span className="font-semibold">Email</span>
                  <span className="truncate">{u.email}</span>

                  <span className="font-semibold">Phone</span>
                  <span>{u.phoneNumber}</span>

                  <span className="font-semibold">Registered</span>
                  <span>{moment(u.createdAt).format("DD MMM YYYY")}</span>

                  <span className="font-semibold">Role</span>
                  <span>{u.role?.join(", ")}</span>

                  <span className="font-semibold">Affiliate</span>
                  <span>{u.affiliateId || "-"}</span>

                  <span className="font-semibold">Business</span>
                  <span>{u.seller?.businessName || "-"}</span>

                  <span className="font-semibold">GST</span>
                  <span>{u.seller?.gstNumber || "-"}</span>

                  <span className="font-semibold">Address</span>
                  <span className="col-span-2">{u.seller?.address || "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {users.length === 0 && (
          <p className="mt-4 text-[15px] text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
