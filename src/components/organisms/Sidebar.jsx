import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
  ];

  // Desktop sidebar - static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-gradient-to-br from-primary-800 to-primary-900 shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-primary-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-primary-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-xl font-bold text-white">CRM Pro</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary-900 shadow-lg"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile sidebar - overlay with transform
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-br from-primary-800 to-primary-900 shadow-xl z-50"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-primary-100 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
              </div>
              <h1 className="text-xl font-bold text-white">CRM Pro</h1>
            </div>
            <button
              onClick={onClose}
              className="text-primary-200 hover:text-white p-1"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-primary-900 shadow-lg"
                      : "text-primary-100 hover:bg-primary-700 hover:text-white"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;