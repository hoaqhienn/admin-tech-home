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
import { Paper, Typography } from '@mui/material';

interface Props {
  buildingId: number;
  buildingName: string;
  events: Event[];
}

const Events = () => {
  const [events, setEvents] = useState<Props[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [countEvents, setCountEvents] = useState(0);

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
      fetchAllEvents();
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
      fetchAllEvents();
    }

    handleClose();
  };

  const handleDelete = async (eventId: number) => {
    await api.delete(`/admin/event/${eventId}`);
    fetchAllEvents();
  };

  const fetchAllEvents = async () => {
    try {
      const response: any = await api.get('/admin/event/getAll');
      if (response.status) {
        setEvents(response.data);
        setCountEvents(response.count);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" color={countEvents > 0 ? 'primary' : 'error'}>
          Events ({countEvents > 0 ? countEvents : 'No events found.'})
        </Typography>
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
      {Object.entries(events).map(([buildingId, e]) => (
        <Paper
          sx={{
            marginBottom: '10px',
          }}
        >
          <Grid item xs={12} key={buildingId}>
            <Typography variant="h4" color="primary">
              {e.buildingName}
            </Typography>
            <Grid container spacing={2}>
              {e.events.map((eventItem) => (
                <Grid item md={4} key={eventItem.eventId}>
                  <Paper
                    sx={{
                      border: '1px solid #ccc',
                      height: '100%',
                      maxHeight: '300px',
                    }}
                  >
                    <Typography variant="h5">{eventItem.eventName}</Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {eventItem.eventLocation}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      <strong>Date:</strong> {formatDate(eventItem.eventDate)}
                    </Typography>
                    <Button
                      sx={{
                        color: 'orange',
                      }}
                      onClick={() => handleClickOpen(eventItem)}
                    >
                      Update
                    </Button>
                    <Button
                      sx={{
                        color: 'red',
                      }}
                      onClick={() => handleDelete(eventItem.eventId)}
                    >
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Grid>
  );
};

export default Events;
