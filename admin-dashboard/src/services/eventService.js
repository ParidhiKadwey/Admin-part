// src/services/EventService.js
const API_BASE = "http://api.mptradeportal.org/event";

export async function fetchEvents(token) {
  const response = await fetch(API_BASE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
}

export async function deleteEvent(uid, token) {
  const response = await fetch(`${API_BASE}/${uid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.status; // or check for success
}