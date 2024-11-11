export async function addEventToGoogleCalendar(eventData, accessToken) {
    try {
        const [hour, minute] = eventData.time.split(':');  
        const endHour = parseInt(hour) + 1;  

        const calendarEvent = {
            summary: eventData.title,
            location: eventData.location,
            description: eventData.description,
            start: {
                dateTime: `${eventData.date}T${hour}:${minute}:00`,
                timeZone: 'Europe/London',  
            },
            end: {
                dateTime: `${eventData.date}T${endHour}:${minute}:00`, 
                timeZone: 'Europe/London',
            },
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarEvent),
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error('Failed to add event to Google Calendar.');
        }

        const result = await response.json();
        return result.id; 
    } catch (error) {
        console.error('Error adding event to Google Calendar:', error);
        throw error;
    }
}


export async function removeEventFromGoogleCalendar(googleCalendarEventId, accessToken) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleCalendarEventId}`, 
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to remove event from Google Calendar.');
        }

        return response.status === 204;  
    } catch (error) {
        console.error('Error removing event from Google Calendar:', error);
        throw error;
    }
}