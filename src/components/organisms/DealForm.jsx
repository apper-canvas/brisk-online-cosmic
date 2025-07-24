import { useState } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const DealForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    value: initialData?.value || "",
    stage: initialData?.stage || "lead"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }
    
    if (!formData.value) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid amount";
    }
    
    if (!formData.stage) {
      newErrors.stage = "Stage is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value)
      };
      await onSubmit(dealData);
      toast.success(initialData ? "Deal updated successfully!" : "Deal created successfully!");
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Deal Name"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        placeholder="Enter deal name"
      />
      
      <FormField
        label="Deal Value"
        type="number"
        value={formData.value}
        onChange={handleChange("value")}
        error={errors.value}
        placeholder="Enter deal value"
        min="0"
        step="0.01"
      />
      
      <FormField
        label="Stage"
        error={errors.stage}
      >
        <Select
          value={formData.stage}
          onChange={handleChange("stage")}
          error={errors.stage}
        >
          <option value="">Select a stage</option>
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </Select>
      </FormField>
      
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name={initialData ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
              {initialData ? "Update Deal" : "Create Deal"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;