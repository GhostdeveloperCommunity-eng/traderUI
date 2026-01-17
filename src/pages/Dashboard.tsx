import { useEffect, useState } from "react";
import { ProductType, TopAffiliateType } from "../types";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import TopProducts from "../components/Dashboard/TopProducts";
import TopUsers from "../components/Dashboard/TopUsers";
import TopSeller from "../components/Dashboard/TopSeller";
import TotalOrderAmount from "../components/Dashboard/TotalOrderAmount";
import TotalPendingApproval from "../components/Dashboard/TotalPendingApproval";
import TotalOrderMetrics from "../components/Dashboard/TotalOrderMetrics";
import { formatDate } from "../utils/utils";
import MetricCardSkeleton from "../components/Dashboard/Loader/MetricCardSkeleton";
import TableSkeleton from "../components/Dashboard/Loader/TableSkeleton";

const getDefaultDates = () => {
  const today = new Date();

  const endDate = formatDate(today);

  const start = new Date(today);
  start.setMonth(start.getMonth() - 2);

  const startDate = formatDate(start);

  return { startDate, endDate };
};

const Dashboard = () => {
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDates();

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  const [topProducts, setTopProducts] = useState<ProductType[]>([]);
  const [topUsers, setTopUsers] = useState<TopAffiliateType[]>([]);
  const [topSeller, setTopSeller] = useState<TopAffiliateType[]>([]);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, sellersRes, usersRes, ordersRes] =
          await Promise.all([
            httpClient.get(
              getCompleteUrlV1("product/top-products", {
                limit: "10",
                startDate,
                endDate,
              }),
            ),
            httpClient.get(
              getCompleteUrlV1("product/top-sellers", {
                limit: "10",
                startDate,
                endDate,
                userOrSellerFlag: 1,
              }),
            ),
            httpClient.get(
              getCompleteUrlV1("product/top-sellers", {
                limit: "10",
                startDate,
                endDate,
                userOrSellerFlag: 2,
              }),
            ),
            httpClient.get(
              getCompleteUrlV1("order", {
                limit: "1000",
                startDate,
                endDate,
              }),
            ),
          ]);

        const [productsJson, sellersJson, usersJson, ordersJson] =
          await Promise.all([
            productsRes.json(),
            sellersRes.json(),
            usersRes.json(),
            ordersRes.json(),
          ]);

        if (!isMounted) return;

        setTopProducts(productsJson.data || []);
        setTopSeller(sellersJson.data || []);
        setTopUsers(usersJson.data || []);
        setOrderData(ordersJson.data || []);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        isMounted && setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  return (
    <div className="p-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <p className="text-[#6a6a6a]">Key metric for your business</p>
        </div>

        <div className="flex gap-4">
          <label className="self-center font-medium">Filter by Date:</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md"
            value={endDate}
            min={startDate}
            max={defaultEnd}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            {/* Metric cards */}
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />

            {/* Tables */}
            <TableSkeleton />
            <TableSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            <TotalOrderAmount orders={orderData} />
            <TotalPendingApproval />
            <TotalOrderMetrics />
            <TopProducts products={topProducts} />
            <TopUsers users={topUsers} />
            <TopSeller sellers={topSeller} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
