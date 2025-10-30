import { apiRequest } from "../util/helper/apiHelper";
export const BASE_URL = "https://livease-backend.onrender.com/api/v1";
export const signIn = (data) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/signInPassword`,
    method: "POST",
    data,
  });

export const getUsersList = (page, recordsPerPage, compType) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/getUsers/${compType}?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const getProperties = (page, recordsPerPage) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/getProperties?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const getPropertyByID = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/getProperty/${_ID}`,
    method: "GET",
    requiresAuth: true,
  });

export const getPropertyByUserID = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/property/userProperties?userId=${_ID}`,
    method: "GET",
    requiresAuth: true,
  });

export const addProperties = (data) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/addProperty`,
    method: "POST",
    data,
    requiresAuth: true,
  });

export const updateUserStatus = (data, _id) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/updateUser/${_id}`,
    method: "PUT",
    data,
    requiresAuth: true,
  });

export const getProfileDetails = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/user/${_ID}`,
    method: "GET",
    requiresAuth: true,
  });

export const addProperty = (payload) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/addProperty`,
    data: payload,
    method: "POST",
    requiresAuth: true,
  });

export const getTickets = (page, recordsPerPage) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/getTickets?page=${page}&limit=${recordsPerPage}`,
    method: "GET",
    requiresAuth: true,
  });

export const updateTicket = (_ID) =>
  apiRequest({
    endpoint: `${BASE_URL}/admin/updateTicket/${_ID}`,
    method: "PUT",
    requiresAuth: true,
  });

export const uploadDocs = (formDataToSend) =>
  apiRequest({
    endpoint: `${BASE_URL}/profile/uploadAsset`,
    method: "POST",
    data: formDataToSend,
    requiresAuth: true,
    isFormData: true,
  });
