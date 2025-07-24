import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ contacts, deals }) => {
  const totalContacts = contacts.length;
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === "closed-won");
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      name: "Total Contacts",
      value: totalContacts,
      icon: "Users",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      change: "+12%",
      changeType: "positive"
    },
    {
      name: "Active Deals",
      value: totalDeals,
      icon: "Target",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      change: "+8%",
      changeType: "positive"
    },
    {
      name: "Pipeline Value",
      value: formatCurrency(totalValue),
      icon: "DollarSign",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      change: "+23%",
      changeType: "positive"
    },
    {
      name: "Won Deals",
      value: formatCurrency(wonValue),
      icon: "TrendingUp",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      change: "+15%",
      changeType: "positive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className={`ml-2 text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;