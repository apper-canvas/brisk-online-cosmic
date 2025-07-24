import { useState, useEffect } from "react";
import { dealService } from "@/services/api/dealService";

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
      console.error("Error loading deals:", err);
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (dealData) => {
    const newDeal = await dealService.create(dealData);
    setDeals(prev => [...prev, newDeal]);
    return newDeal;
  };

  const updateDeal = async (id, dealData) => {
    const updatedDeal = await dealService.update(id, dealData);
    setDeals(prev => prev.map(d => d.Id === id ? updatedDeal : d));
    return updatedDeal;
  };

  const deleteDeal = async (id) => {
    await dealService.delete(id);
    setDeals(prev => prev.filter(d => d.Id !== id));
  };

  useEffect(() => {
    loadDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    addDeal,
    updateDeal,
    deleteDeal,
    refetch: loadDeals
  };
};