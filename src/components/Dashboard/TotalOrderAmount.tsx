type Props = {
  orders: any[];
};

const TotalOrderAmount = ({ orders }: Props) => {
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 opacity-40">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0) 60%, rgba(255,255,255,0.25) 100%)]"></div>
        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle, rgba(255,255,255,0.0) 0, rgba(255,255,255,0.0) 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)]"></div>
      </div>

      <h2 className="text-lg font-semibold z-10 text-yellow-500">
        Total Sales Amount
      </h2>
      <p className="text-[36px] font-bold text-gray-700 z-10">
        ₹{" "}
        <span className="font-bold text-[#6a6a6a] text-2xl">{totalAmount}</span>
      </p>
    </div>
  );
};

export default TotalOrderAmount;
