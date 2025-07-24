import { toast } from 'react-toastify';

const tableName = 'app_contact_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          { fieldName: "createdAt_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform data to match existing component structure
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name || '',
        company: contact.company_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        createdAt: contact.createdAt_c || new Date().toISOString(),
        tags: contact.Tags || '',
        owner: contact.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.Name || '',
        company: contact.company_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        createdAt: contact.createdAt_c || new Date().toISOString(),
        tags: contact.Tags || '',
        owner: contact.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: contactData.name,
          company_c: contactData.company,
          email_c: contactData.email,
          phone_c: contactData.phone,
          createdAt_c: new Date().toISOString(),
          Tags: contactData.tags || '',
          Owner: contactData.owner || null
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdContact = successfulRecords[0].data;
          return {
            Id: createdContact.Id,
            name: createdContact.Name || '',
            company: createdContact.company_c || '',
            email: createdContact.email_c || '',
            phone: createdContact.phone_c || '',
            createdAt: createdContact.createdAt_c || new Date().toISOString(),
            tags: createdContact.Tags || '',
            owner: createdContact.Owner || null
          };
        }
      }
      
      throw new Error('Failed to create contact');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          Name: contactData.name,
          company_c: contactData.company,
          email_c: contactData.email,
          phone_c: contactData.phone,
          Tags: contactData.tags || '',
          Owner: contactData.owner || null
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedContact = successfulUpdates[0].data;
          return {
            Id: updatedContact.Id,
            name: updatedContact.Name || '',
            company: updatedContact.company_c || '',
            email: updatedContact.email_c || '',
            phone: updatedContact.phone_c || '',
            createdAt: updatedContact.createdAt_c || new Date().toISOString(),
            tags: updatedContact.Tags || '',
            owner: updatedContact.Owner || null
          };
        }
      }
      
      throw new Error('Failed to update contact');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};