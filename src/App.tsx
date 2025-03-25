import React, { useState, useEffect } from "react";
import "./styles.css";
import { getEvents, deleteEvent } from "./API/EventsService";
import { Event } from "./types";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EventCard } from "./EventCard";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate("/add");
  };

  const handleEditEvent = (event: Event) => {
    navigate(`/edit/${event.id}`);
  };

  const handleEventSelect = (id: number) => {
    setSelectedEventId(id === selectedEventId ? null : id);
  };

  const handleEventDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      setSelectedEventId(null);
    } catch (error: any) {
      setError(`Error deleting event: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        setError("Error fetching Event Data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedEvents = [...events].sort((a, b) =>
    a.company.localeCompare(b.company)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4">Upcoming Events:</Typography>
        <Button variant="contained" color="primary" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Box>
      <Grid2 container spacing={2} padding={2}>
        {sortedEvents.map((event, index) => (
          <Grid2 size={12} key={event.id}>
            <EventCard
              key={event.id}
              event={event}
              isSelected={selectedEventId === event.id}
              onSelect={() => handleEventSelect(event.id)}
              onDoubleClick={() => handleEditEvent(event)}
              onDelete={handleEventDelete}
            />
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}
