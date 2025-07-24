import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  children, 
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    if (type === "select") return <Select error={error} {...props} />;
    return <Input type={type} error={error} {...props} />;
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;