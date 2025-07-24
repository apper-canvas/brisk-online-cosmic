import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const { contacts, loading: contactsLoading, error: contactsError, refetch: refetchContacts } = useContacts();
  const { deals, loading: dealsLoading, error: dealsError, refetch: refetchDeals } = useDeals();

  const loading = contactsLoading || dealsLoading;
  const error = contactsError || dealsError;

  const handleRetry = () => {
    refetchContacts();
    refetchDeals();
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} title="Failed to Load Dashboard" />;
  }

  const recentContacts = contacts.slice(-5).reverse();
  const recentDeals = deals.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardStats contacts={contacts} deals={deals} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
            <ApperIcon name="Users" className="w-5 h-5 text-primary-600" />
          </div>
          
          <div className="space-y-4">
            {recentContacts.map((contact, index) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Deals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Deals</h3>
            <ApperIcon name="Target" className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="space-y-4">
            {recentDeals.map((deal, index) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Target" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {deal.name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {deal.stage.replace("-", " ")}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold text-green-600">
                  ${deal.value.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;