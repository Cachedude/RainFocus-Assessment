import axios, { AxiosResponse } from "axios";
import { Event } from "../types";

const BASE_URL = "https://rf-json-server.herokuapp.com/events/";

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  const response: AxiosResponse<Event[]> = await axios.get(`${BASE_URL}`);
  return response.data;
};

// Get event by ID
export const getEvent = async (id: number): Promise<Event> => {
  const response: AxiosResponse<Event> = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Create Event
export const createEvent = async (event: Omit<Event, "id">): Promise<Event> => {
  const response: AxiosResponse<Event> = await axios.post(`${BASE_URL}`, event);
  return response.data;
};

export const updateEvent = async (
  id: number,
  event: Partial<Event>
): Promise<Event> => {
  const response: AxiosResponse<Event> = await axios.put(
    `${BASE_URL}/${id}`,
    event
  );
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
