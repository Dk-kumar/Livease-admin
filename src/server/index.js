import { apiRequest } from "../util/helper/apiHelper";
export const BASE_URL = "https://livease-backend.onrender.com/api/v1/admin";

export const signIn = (data) =>
  apiRequest({
    endpoint: `${BASE_URL}/signInPassword`,
    method: "POST",
    data,
  });

export const getTenantUsers = (page, recordsPerPage) =>
  apiRequest({
    endpoint: `${BASE_URL}/getUsers/Tenant?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const getProperties = (page, recordsPerPage) =>
  apiRequest({
    endpoint: `${BASE_URL}/getProperties?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const getPropertyByID = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/getProperty/${_ID}`,
    method: "GET",
    requiresAuth: true,
  });

export const addProperty = (payload) =>
  apiRequest({
    endpoint: `${BASE_URL}/addProperty`,
    data: payload,
    method: "POST",
    requiresAuth: true,
  });

export const getTickets = (page, recordsPerPage) =>
  apiRequest({
    endpoint: `${BASE_URL}/getTickets?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const updateTicket = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/updateTicket/${_ID}`,
    method: "PUT",
    requiresAuth: true,
  });
