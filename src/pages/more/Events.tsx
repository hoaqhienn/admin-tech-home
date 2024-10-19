import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { Event } from 'interface/Event';
import { api } from 'apis';

const Events = () => {
  const [event, setEvent] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventLocation: '',
    eventDate: '',
    createdAt: '',
    updatedAt: '',
    buildingId: '',
  });

  const handleClickOpen = (event?: Event) => {
    if (event) {
      setNewEvent({
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventDate: event.eventDate,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        buildingId: event.buildingId.toString(),
      });
      setCurrentEvent(event);
      setIsEditing(true);
    } else {
      setNewEvent({
        eventName: '',
        eventDescription: '',
        eventLocation: '',
        eventDate: '',
        createdAt: '',
        updatedAt: '',
        buildingId: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEvent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const updatedAt = new Date().toISOString();

    if (isEditing && currentEvent) {
      // Update the event
      const updatedEvent: Event = {
        ...currentEvent,
        eventName: newEvent.eventName,
        eventDescription: newEvent.eventDescription,
        eventLocation: newEvent.eventLocation,
        eventDate: newEvent.eventDate,
        updatedAt,
        buildingId: parseInt(newEvent.buildingId),
      };

      await api.put(`/admin/event/${currentEvent.eventId}`, updatedEvent);
      setEvent(
        event.map((a) =>
          a.eventId === currentEvent.eventId ? updatedEvent : a,
        ),
      );
    } else {
      // Add new event
      const createdAt = new Date().toISOString();
      const newEventData: Omit<Event, 'eventId'> = {
        eventName: newEvent.eventName,
        eventDescription: newEvent.eventDescription,
        eventLocation: newEvent.eventLocation,
        eventDate: newEvent.eventDate,
        createdAt,
        updatedAt,
        buildingId: parseInt(newEvent.buildingId),
      };

      await api.post('/admin/event', newEventData);
      setEvent([...event, { ...newEventData, eventId: event.length + 1 }]);
    }

    handleClose();
  };

  const handleDelete = async (eventId: number) => {
    await api.delete(`/admin/event/${eventId}`);
    setEvent(event.filter((a) => a.eventId !== eventId));
  };

  const fetchAllEvents = async () => {
    try {
      const response = await api.get('/admin/event/getAll');
      if (response.status) {
        setEvent(response.data);
        console.log('Events:',event);
        
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching events...');
    
    fetchAllEvents();
  }, []);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <h1>Events</h1>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        size="medium"
        onClick={() => handleClickOpen()}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        Add Event
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Update Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Name"
            name="eventName"
            fullWidth
            variant="outlined"
            value={newEvent.eventName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Event Description"
            name="eventDescription"
            fullWidth
            variant="outlined"
            value={newEvent.eventDescription}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Event Location"
            name="eventLocation"
            fullWidth
            variant="outlined"
            value={newEvent.eventLocation}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Event Date"
            name="eventDate"
            type="date"
            fullWidth
            variant="outlined"
            value={newEvent.eventDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Building ID"
            name="buildingId"
            fullWidth
            variant="outlined"
            value={newEvent.buildingId}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {event.length > 0 ? (
        event.map((eventItem) => (
          <Grid item xs={12} md={2} key={eventItem.eventId}>
            <div>
              <h2>{eventItem.eventName}</h2>
              <p>
                <strong>Description:</strong> {eventItem.eventDescription}
              </p>
              <p>
                <strong>Location:</strong> {eventItem.eventLocation}
              </p>
              <p>
                <strong>Date:</strong> {new Date(eventItem.eventDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(eventItem.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(eventItem.updatedAt).toLocaleDateString()}
              </p>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleClickOpen(eventItem)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(eventItem.eventId)}
              >
                Delete
              </Button>
            </div>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No events available.</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Events;