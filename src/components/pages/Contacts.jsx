import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ContactsTable from "@/components/organisms/ContactsTable";
import ContactForm from "@/components/organisms/ContactForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useContacts } from "@/hooks/useContacts";

const Contacts = () => {
  const { contacts, loading, error, addContact, updateContact, deleteContact, refetch } = useContacts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(id);
        toast.success("Contact deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete contact. Please try again.");
      }
    }
  };

  const handleSubmitContact = async (contactData) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.Id, contactData);
      } else {
        await addContact(contactData);
      }
      setIsModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} title="Failed to Load Contacts" />;
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts yet"
        message="Start building your customer relationships by adding your first contact"
        actionText="Add Contact"
        onAction={handleAddContact}
        icon="Users"
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
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        <Button onClick={handleAddContact} size="lg" className="px-6">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Contact
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
            placeholder="Search contacts..."
          />
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Users" className="w-4 h-4 mr-1" />
          {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <ContactsTable
            contacts={filteredContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          onSubmit={handleSubmitContact}
          onCancel={handleCloseModal}
          initialData={editingContact}
        />
      </Modal>
    </div>
  );
};

export default Contacts;