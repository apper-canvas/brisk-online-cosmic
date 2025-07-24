import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DealsTable from "@/components/organisms/DealsTable";
import DealForm from "@/components/organisms/DealForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useDeals } from "@/hooks/useDeals";

const Deals = () => {
  const { deals, loading, error, addDeal, updateDeal, deleteDeal, refetch } = useDeals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (id) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await deleteDeal(id);
        toast.success("Deal deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete deal. Please try again.");
      }
    }
  };

  const handleSubmitDeal = async (dealData) => {
    try {
      if (editingDeal) {
        await updateDeal(editingDeal.Id, dealData);
      } else {
        await addDeal(dealData);
      }
      setIsModalOpen(false);
      setEditingDeal(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  const getTotalValue = () => {
    return filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} title="Failed to Load Deals" />;
  }

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals yet"
        message="Start tracking your sales opportunities by creating your first deal"
        actionText="Create Deal"
        onAction={handleAddDeal}
        icon="Target"
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Deals
          </h1>
          <p className="text-gray-600 mt-1">
            Track your sales pipeline and opportunities
          </p>
        </div>
        
        <Button onClick={handleAddDeal} size="lg" className="px-6">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Create Deal
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="w-full sm:w-80">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search deals..."
          />
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Target" className="w-4 h-4 mr-1" />
            {filteredDeals.length} deal{filteredDeals.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center text-green-600 font-medium">
            <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
            {formatCurrency(getTotalValue())} total value
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {filteredDeals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <DealsTable
            deals={filteredDeals}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
          />
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDeal ? "Edit Deal" : "Create New Deal"}
        size="lg"
      >
        <DealForm
          onSubmit={handleSubmitDeal}
          onCancel={handleCloseModal}
          initialData={editingDeal}
        />
      </Modal>
    </div>
  );
};

export default Deals;