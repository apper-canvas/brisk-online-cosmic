import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-3 p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.emailAddress || 'User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Logout"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;