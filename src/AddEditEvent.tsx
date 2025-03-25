import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, updateEvent, createEvent } from "./API/EventsService";
import { Event } from "./types";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface AddEditEventProps {
  onSave?: () => void;
}

const AddEditEvent: React.FC<AddEditEventProps> = ({ onSave }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event>({
    // Initialize with empty strings for consistency
    id: 0,
    color: "",
    isActive: false,
    name: "",
    date: "",
    time: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    image: "",
    createdOn: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false); // Start with false, set true in useEffect if needed
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [companyError, setCompanyError] = useState<boolean>(false);
  const [colorError, setColorError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false); // Add state for phone error
  const [localDate, setLocalDate] = useState<string>("");
  const [localTime, setLocalTime] = useState<string>("");
  const [touched, setTouched] = useState<{
    name: boolean;
    description: boolean;
    company: boolean;
    phone: boolean;
  }>({
    name: false,
    description: false,
    company: false,
    phone: false,
  });

  const browserSafeColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "navy",
    "olive",
    "maroon",
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        if (id) {
          const eventData = await getEvent(parseInt(id));
          setEvent(eventData);
          setLocalDate(eventData.date || "");
          setLocalTime(eventData.time || "");
        } else {
          const defaultDateTime = getDefaultDateAndTime();
          setLocalDate(defaultDateTime.date);
          setLocalTime(defaultDateTime.time);
        }
      } catch (err) {
        setError("Error fetching event.");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      setLocalDate(value);
    } else if (name === "time") {
      setLocalTime(value);
    }

    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    if (name === "name") setNameError(false);
    if (name === "description") setDescriptionError(false);
    if (name === "company") setCompanyError(false);
    if (name === "phone") {
      const phoneRegex = /^\+?\d{1,3}?\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$/;
      setPhoneError(touched.phone && !!value && !phoneRegex.test(value));
    }
  };

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    const colorValue = event.target.value;
    setEvent((prevEvent) => ({
      ...prevEvent,
      color: colorValue,
    }));
    setColorError(false);
  };

  const handleSave = async () => {
    let hasErrors = false;

    if (!event.name) {
      setNameError(true);
      hasErrors = true;
    }
    if (!event.description) {
      setDescriptionError(true);
      hasErrors = true;
    }
    if (!event.company) {
      setCompanyError(true);
      hasErrors = true;
    }
    if (!event.color) {
      setColorError(true);
      hasErrors = true;
    }

    // Phone number validation
    const phoneRegex = /^\+?\d{1,3}?\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$/;
    if (event.phone && !phoneRegex.test(event.phone)) {
      setPhoneError(true);
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    try {
      if (id) {
        await updateEvent(parseInt(id), event);
      } else {
        await createEvent(event);
      }
      if (onSave) {
        onSave();
      }
      navigate("/");
    } catch (err) {
      setError("Error saving event.");
      console.error("Error saving event:", err);
    }
  };

  // Validation checks.
  useEffect(() => {
    setNameError(touched.name && !event.name);
    setDescriptionError(touched.description && !event.description);
    setCompanyError(touched.company && !event.company);
    const phoneRegex = /^\+?\d{1,3}?\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$/;
    setPhoneError(
      touched.phone && !!event.phone && !phoneRegex.test(event.phone)
    );
  }, [
    event.name,
    event.description,
    event.company,
    event.phone,
    touched.name,
    touched.description,
    touched.company,
    touched.phone,
  ]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!event) {
    return <Typography>Event not found.</Typography>;
  }

  const getDefaultDateAndTime = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {id ? "Edit Event" : "Add Event"}
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Name"
            name="name"
            value={event.name}
            onChange={handleChange}
            onBlur={() =>
              setTouched((prevTouched) => ({ ...prevTouched, name: true }))
            }
            fullWidth
            margin="normal"
            required
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
            autoFocus={!id}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={localDate || getDefaultDateAndTime().date}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Time"
            type="time"
            name="time"
            value={localTime || getDefaultDateAndTime().time}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Company"
            name="company"
            value={event.company}
            onChange={handleChange}
            onBlur={() =>
              setTouched((prevTouched) => ({
                ...prevTouched,
                company: true,
              }))
            }
            fullWidth
            margin="normal"
            required
            error={companyError}
            helperText={companyError ? "Company is required" : ""}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email"
            name="email"
            value={event.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Phone"
            name="phone"
            value={event.phone}
            onChange={handleChange}
            onBlur={() =>
              setTouched((prevTouched) => ({ ...prevTouched, phone: true }))
            }
            fullWidth
            margin="normal"
            error={phoneError}
            helperText={
              phoneError ? "Invalid phone format (ex. '+X (XXX) XXX-XXXX')" : ""
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Address"
            name="address"
            value={event.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Description"
            name="description"
            value={event.description}
            onChange={handleChange}
            onBlur={() =>
              setTouched((prevTouched) => ({
                ...prevTouched,
                description: true,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
            error={descriptionError}
            helperText={descriptionError ? "Description is required" : ""}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Image URL"
            name="image"
            value={event.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormControl fullWidth margin="normal" required error={colorError}>
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              id="color"
              name="color"
              value={event.color}
              onChange={handleColorChange}
            >
              {browserSafeColors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          {id ? "Save" : "Create"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          style={{ marginLeft: "8px" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditEvent;
