import moment from "moment";
import { IUser } from "../types";

type Props = {
  users: IUser[];
  userRole: string;
};

export default function UserDataByRole({ users, userRole }: Props) {
  console.log("userRole", userRole);
  const renderTable = () => {
    if (userRole == "seller") {
      return (
        <>
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
        </>
      );
    } else if (userRole === "user") {
      return (
        <>
          <table className="min-w-[1100px] w-full text-sm border-collapse">
            <thead className="bg-violet-800 text-white sticky top-0 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Register Date",
                  "Role",
                  "Status",
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
                  <td
                    className="px-3 py-2"
                    style={{
                      color: u.status === "active" ? "green" : "red",
                    }}
                  >
                    {u.status}
                  </td>

                  {/* <td className="px-3 py-2">{u.affiliateId || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.businessName || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.gstNumber || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.address || "-"}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else if (userRole == "promoter") {
    } else if (userRole == "admin") {
      return (
        <>
          <table className="min-w-[1100px] w-full text-sm border-collapse">
            <thead className="bg-violet-800 text-white sticky top-0 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Register Date",
                  "Role",
                  "Status",
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
                  <td>{u.status}</td>
                  {/* <td className="px-3 py-2">{u.affiliateId || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.businessName || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.gstNumber || "-"}</td>
                  <td className="px-3 py-2">{u.seller?.address || "-"}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else {
      return (
        <>
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
        </>
      );
    }
  };
  return <>{renderTable()}</>;
}
