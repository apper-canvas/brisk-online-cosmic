import { useState } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ContactForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    email: initialData?.email || "",
    phone: initialData?.phone || ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
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
      await onSubmit(formData);
      toast.success(initialData ? "Contact updated successfully!" : "Contact added successfully!");
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          value={formData.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder="Enter full name"
        />
        
        <FormField
          label="Company"
          value={formData.company}
          onChange={handleChange("company")}
          error={errors.company}
          placeholder="Enter company name"
        />
      </div>
      
      <FormField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
        error={errors.email}
        placeholder="Enter email address"
      />
      
      <FormField
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={handleChange("phone")}
        error={errors.phone}
        placeholder="Enter phone number"
      />
      
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
              {initialData ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <ApperIcon name={initialData ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
              {initialData ? "Update Contact" : "Add Contact"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;