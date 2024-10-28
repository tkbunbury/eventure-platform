import { gapi } from 'gapi-script';

export async function addEventToGoogleCalendar(eventData) {
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

        const request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: calendarEvent,
        });
        
        const response = await request.then((res) => {
            return res;
        });

        if (!response) {
            throw new Error('Failed to add event to Google Calendar.');
        }

        const googleCalendarEventId = response.result.id;

        return googleCalendarEventId;
    } catch (error) {
        console.error('Error adding event to Google Calendar: ', error);
        throw error;
    }
}

export async function removeEventFromGoogleCalendar(googleCalendarEventId) {
    try {
        
        const request = gapi.client.calendar.events.delete({
            calendarId: 'primary',  
            eventId: googleCalendarEventId,  
        });

        const response = await request.execute();
        return response;  
    } catch (error) {
        console.error('Error removing event from Google Calendar: ', error);
        throw error;
    }
}
