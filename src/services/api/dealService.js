import { toast } from 'react-toastify';

const tableName = 'deal_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "contactId_c" } },
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
      return response.data.map(deal => ({
        Id: deal.Id,
        name: deal.Name || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || 'lead',
        contactId: deal.contactId_c?.Id || deal.contactId_c || null,
        createdAt: deal.createdAt_c || new Date().toISOString(),
        tags: deal.Tags || '',
        owner: deal.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
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
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const deal = response.data;
      return {
        Id: deal.Id,
        name: deal.Name || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || 'lead',
        contactId: deal.contactId_c?.Id || deal.contactId_c || null,
        createdAt: deal.createdAt_c || new Date().toISOString(),
        tags: deal.Tags || '',
        owner: deal.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: dealData.name,
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage,
          contactId_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          createdAt_c: new Date().toISOString(),
          Tags: dealData.tags || '',
          Owner: dealData.owner || null
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
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdDeal = successfulRecords[0].data;
          return {
            Id: createdDeal.Id,
            name: createdDeal.Name || '',
            value: createdDeal.value_c || 0,
            stage: createdDeal.stage_c || 'lead',
            contactId: createdDeal.contactId_c?.Id || createdDeal.contactId_c || null,
            createdAt: createdDeal.createdAt_c || new Date().toISOString(),
            tags: createdDeal.Tags || '',
            owner: createdDeal.Owner || null
          };
        }
      }
      
      throw new Error('Failed to create deal');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dealData.name,
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage,
          contactId_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          Tags: dealData.tags || '',
          Owner: dealData.owner || null
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
          console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedDeal = successfulUpdates[0].data;
          return {
            Id: updatedDeal.Id,
            name: updatedDeal.Name || '',
            value: updatedDeal.value_c || 0,
            stage: updatedDeal.stage_c || 'lead',
            contactId: updatedDeal.contactId_c?.Id || updatedDeal.contactId_c || null,
            createdAt: updatedDeal.createdAt_c || new Date().toISOString(),
            tags: updatedDeal.Tags || '',
            owner: updatedDeal.Owner || null
          };
        }
      }
      
      throw new Error('Failed to update deal');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
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
          console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};