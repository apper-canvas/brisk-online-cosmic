import { motion } from "framer-motion";

const Loading = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {/* Table header skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-3">
            {/* Header row */}
            <div className="flex space-x-4 pb-3 border-b border-gray-200">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded flex-1 animate-pulse"></div>
              ))}
            </div>
            
            {/* Table rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex space-x-4 py-3 border-b border-gray-100"
              >
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse"></div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
            </motion.div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-6 animate-pulse"></div>
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full"
      ></motion.div>
    </div>
  );
};

export default Loading;