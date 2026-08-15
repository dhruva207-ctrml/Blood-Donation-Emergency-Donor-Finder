# Blood Donation & Emergency Donor Finder

A simple blood donation and emergency donor finder application built with:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Data Storage:** In-memory arrays (temporary storage)
- **API Testing:** Postman
- **Database:** None (no SQL or authentication)

The frontend and backend are intentionally separated. The frontend is a static page demonstrating the user interface, while the backend provides API endpoints for testing in Postman. They are not connected at this stage.

## Features

- **Donor Management:** Register donors with blood group, location, and availability
- **Emergency Requests:** Create and track blood requests with patient and hospital details
- **Data Lists:** View all registered donors and emergency requests
- **Form Validation:** Comprehensive field validation for all user inputs
- **Contact Validation:** 10-digit numeric phone numbers required
- **Smart Defaults:** First-time donor support with automatic default values
- **Real-time Feedback:** Inline validation messages in the UI
- **Temporary Storage:** In-memory arrays preserve data during the session
- **API Testing:** RESTful endpoints fully tested with Postman

## Folder Structure

```
capst/
├── backend/
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── package.json
├── README.md
└── node_modules/
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A modern web browser
- Postman (for API testing)

## How to Run

1. Navigate to the project folder:
   ```bash
   cd capst
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`

4. Open the frontend in your browser:
   - Open `frontend/index.html` directly in your browser

## Backend API Endpoints

### Donors

- `POST /donors` - Add a new donor
- `GET /donors` - View all donors
- `GET /donors/:id` - View a single donor
- `PUT /donors/:id` - Update donor details
- `DELETE /donors/:id` - Delete a donor

### Emergency Requests

- `POST /requests` - Create a new emergency request
- `GET /requests` - View all requests
- `GET /requests/:id` - View a single request
- `PUT /requests/:id` - Update request details
- `DELETE /requests/:id` - Delete a request

## Validations Implemented

### Donor validation

- Name is required
- Blood group must be one of: `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`
- Contact must be exactly 10 digits
- Location is required
- Availability must be one of: `Available`, `Busy`, `Unavailable`
- If no donation date is entered, it stores as `Never donated`
- If no notes are entered, it stores as `First-time donor.`

### Request validation

- Required blood group is required and must be valid
- Quantity must be a positive whole number
- Patient name, hospital name, location, date-time, description, and contact are required
- Contact must be exactly 10 digits
- Status is optional while creating a request
- If status is missing, it defaults to `Pending`
- If status is provided, it must be one of: `Pending`, `Matched`, `Completed`, `Cancelled`

## Example JSON Data

### Donor Example

```json
{
  "name": "Asha Verma",
  "bloodGroup": "O+",
  "contact": "9876543210",
  "location": "Bangalore",
  "availability": "Available",
  "lastDonationDate": "2024-06-15",
  "notes": "Available for urgent emergency blood donations."
}
```

### Emergency Request Example

```json
{
  "requiredBloodGroup": "O+",
  "quantity": 2,
  "patientName": "Raju",
  "hospitalName": "City Care Hospital",
  "location": "Bangalore",
  "requiredDateTime": "2026-08-16T14:00",
  "description": "Need blood for surgery in the evening.",
  "contact": "8899001122",
  "status": "Pending"
}
```

## Sample Success Response

```json
{
  "message": "Emergency request created successfully.",
  "request": {
    "id": 1,
    "requiredBloodGroup": "O+",
    "quantity": 2,
    "patientName": "Raju",
    "hospitalName": "City Care Hospital",
    "location": "Bangalore",
    "requiredDateTime": "2026-08-16T14:00",
    "description": "Need blood for surgery in the evening.",
    "contact": "8899001122",
    "status": "Pending"
  }
}
```

## Important Notes

- **Educational Project:** Designed for college evaluation and learning purposes
- **Separated Architecture:** Frontend and backend are intentionally decoupled for clear separation of concerns
- **Postman Testing:** Use Postman to test the backend API endpoints
- **No Persistence:** Data exists only in memory during the session and is lost when the server restarts
- **No Authentication:** This version does not include user authentication or security features
