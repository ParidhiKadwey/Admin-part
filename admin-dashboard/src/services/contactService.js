// src/services/ContactService.js
const API_BASE = "http://api.mptradeportal.org/contact";

export async function fetchContacts(token) {
  const response = await fetch(API_BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
}

export async function deleteContact(uid, token) {
  const response = await fetch(`${API_BASE}/${uid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.status;
}