import { useState, useEffect } from "react";
import { contactService } from "@/services/api/contactService";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    const newContact = await contactService.create(contactData);
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = async (id, contactData) => {
    const updatedContact = await contactService.update(id, contactData);
    setContacts(prev => prev.map(c => c.Id === id ? updatedContact : c));
    return updatedContact;
  };

  const deleteContact = async (id) => {
    await contactService.delete(id);
    setContacts(prev => prev.filter(c => c.Id !== id));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: loadContacts
  };
};