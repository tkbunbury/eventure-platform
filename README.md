# Eventure

## Overview

**Eventure** is an events platform that allows an international business to create and share events with community members across the globe. The app enables users to sign up for events and, upon registration, add them to their Google Calendar. 

## Hosted Version

The live version of the app is hosted on Firebase and accessible at: [https://events-platform-57a09.web.app](https://events-platform-57a09.web.app)
## Main Features


1. **Event Creation by Staff**: Staff members can create events that will be displayed on the platform.
2. **User Sign-Up for Events**: Community members can browse and sign up for events.
   - **Account Creation and Google Sign-In**: Users have the option to create an account directly or sign in through their Google account for quicker access.
3. **Google Calendar Integration**: Users with a valid Gmail account can add signed-up events directly to their Google Calendar.
4. **Event Search by Name or Location**: Users can search for specific events by entering a name or location.
5. **My Events Page for Users**: Users have a dedicated page to view and manage the events they’ve signed up for.
6. **Created Events Page for Staff**: Staff members have a separate page to view and manage the events they have created.

### Roles

- **Staff Account**: Able to create, delete, and manage events.
- **User Account**: Can browse, sign up, and add events to their calendar.
- **Guest**: Can browse events.

> **Note**: Test accounts for staff and user roles are provided below for evaluation.

## Tech Stack

- **Frontend**: React (JavaScript)
- **Backend**: Firebase for authentication, Firestore for database storage, and Firebase Hosting for deployment
- **APIs**:
  - Google Calendar API to allow users to add events to their personal calendars.
- **Payment Integration**: Currently not included but may be integrated in the future (e.g., Stripe or Google Pay).
- **Hosting**: Firebase Hosting

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Google Developer account to enable and configure the Google Calendar API



## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tkbunbury/eventure-platform.git
2. **Install Dependencies**
   ```bash
   npm install
3. **Set Up Firebase**
   ```bash
   firebase init
   Select Firebase Hosting, Firestore, and Authentication when prompted.
   Update the Firebase configuration by creating a .env file or directly in src/firebase/firebase.js.
4. **Configure Google Calendar API**
   ```bash
   In the Google Developer Console, enable the Google Calendar API and create credentials.
   Add the API key and ClientId to an existing or new .env Firebase config file as shown below:
   
   - REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
   - REACT_APP_GOOGLE_CLIENT_ID=your_google_client_ID_here
5. **Build and Run Locally**
   ```bash
   npm start
   Open http://localhost:3000 to view in the browser.
6. **Deploy to Firebase Hosting**
   ```bash
   npm run build
   firebase deploy
## Test Accounts

### Staff Account
- **Email**: `tc1@staffdomain.com`
- **Password**: `123456`

### User Account
- **Email**: `testuser@hotmail.com`
- **Password**: `123456`

### Google Account (User)
- **Email**: `eventuretest927@gmail.com`
- **Password**: `Eventure_Test@927`

> **Note**: To test google calendar feature, use "sign in with google" feature on login page with demo google account.

## Additional Information

### Security and Privacy
- Firebase Authentication secures user login.
- Firestore rules restrict access to only authenticated users for specific actions.
- Sensitive information, such as payment data, should be handled securely if payment integrations are added in future versions.

### Accessibility
- The app includes color contrast adjustments for accessibility.

### Error Handling
- Error messages are displayed for failed sign-ups, failed event creations, network issues, or missing content.
- Loading indicators are shown during data retrieval.

## Known Issues and Limitations

- **Payment Integration**: Currently users can attend free events, but paid events will be implemented in future updates.
- **Calendar Integration**: Only users with a real valid Gmail account can add events to their calendar.
- **Single-Page App (SPA)**: The app is structured as an SPA, with client-side routing managed by React Router.

## Future Enhancements

- **Payments**: Integration with Stripe or Google Pay to support paid events.
- **Email Confirmations**: Send emails when users sign up for an event.
- **Social Media Sharing**: Allow users to share events on social media platforms.
- **Mobile App**: Expand to React Native for mobile compatibility.

## Performance Criteria

- Clear and user-friendly interface for event creation and sign-up.
- Proper error messages and loading indicators to enhance user experience.
- Responsive and accessible design to support users across devices and assistive technologies.

## Created By

**Takai Bunbury**  

[https://github.com/tkbunbury](https://github.com/tkbunbury)  
[https://www.linkedin.com/in/tkbunbury/](https://www.linkedin.com/in/tkbunbury/)  

Feel free to reach out if you have any questions or feedback!

