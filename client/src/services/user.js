import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL_AUTH;

export const createRecord = async (newRecord) => {
  try {
    const response = await axios.post(
      `${API_URL}/dns/create-record`,
      { ...newRecord },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 201) {
      toast.success("Record created successfully!");
      return true;
    } else {
      console.error("Failed to create record:", response.data);
      toast.error("Failed to create record!");
      return false;
    }
  } catch (error) {
    console.error("Error creating record:", error.response);
    toast.warning("Something went wrong while creating the record!");
    return false;
  }
};

export const fetchRecords = async (domainId) => {
  try {
    const response = await axios.get(
      `${API_URL}/dns/list-records?zoneId=${domainId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch records:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching records:", error.response);
    toast.error("Failed to fetch records!");
    return null;
  }
};

export const updateRecord = async (updatedRecord) => {
  try {
    const response = await axios.put(
      `${API_URL}/dns/update-record`,
      updatedRecord,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success("Record updated successfully!");
      return true;
    } else {
      console.error("Failed to update record:", response.data);
      toast.error("Failed to update record!");
      return false;
    }
  } catch (error) {
    console.error("Error updating record:", error.response);
    toast.warning("Failed to update record!");
    return false;
  }
};

export const deleteRecord = async (recordId, zoneId) => {
  try {
    const response = await axios.delete(`${API_URL}/dns/delete-record`, {
      data: { recordId, zoneId },
      withCredentials: true,
    });
    if (response.status === 200) {
      toast.success("Record deleted successfully!");
      return true;
    } else {
      console.error("Failed to delete record:", response.data);
      toast.error("Failed to delete record!");
      return false;
    }
  } catch (error) {
    console.error("Error deleting record:", error.response);
    toast.warning("Failed to delete record!");
    return false;
  }
};

export const fetchDomains = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/hosted-zones`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.hostedZones;
    } else {
      console.error("Failed to Domains records:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching records:", error.response);
    toast.error("Failed to Domains records");
    return null;
  }
};

export const createDomain = async (domainName) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/create-domain`,
      { domainName },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 201) {
      toast.success("Domain Added successfully!");
      return true;
    } else {
      console.error("Failed to create domain:", response.data);
      toast.error("Failed to create domain!");
      return false;
    }
  } catch (error) {
    console.error("Error creating domain:", error.response);
    toast.error("Something went wrong while creating the domain!");
    return false;
  }
};

export const deleteDomain = async (Id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/delete-hosted-zone/`,
      {
        data: { Id },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success("Domain deleted successfully!");
      return true;
    } else {
      console.error("Failed to delete domain:", response.data);
      toast.error("Failed to delete domain!");
      return false;
    }
  } catch (error) {
    console.error("Error deleting domain:", error.response);
    toast.error("Failed to delete the domain!");
    return false;
  }
};
