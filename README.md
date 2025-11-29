Airtable Form Builder 

This project is something I built to understand how OAuth works in real-world applications and how form-building tools dynamically generate interfaces based on database schema. Instead of manually creating forms field by field, this tool lets the user connect their Airtable account, pick a base and table, and the app automatically builds a form out of the Airtable fields.
Once the form is submitted, the data goes back to Airtable and can also be viewed in a simple dashboard inside the app.

Why I Built This 

I’ve seen many tools like Tally, Google Forms, and Typeform — and I wanted to learn how they auto-generate forms and connect with other platforms. Airtable had a clean API and OAuth support, so it became a perfect option.

This project helped me understand:

How OAuth works behind the scenes

How to dynamically fetch schema and render UI

How to sync data between a custom UI and an external database

Storing submissions locally and exporting them

What the App Can Do 🚀

✔ Login using Airtable account
✔ Fetch all available bases and tables
✔ Display fields from Airtable and let the user choose what they want in their form
✔ Automatically generate UI based on the chosen fields
✔ Save responses both in MongoDB and Airtable
✔ View all submissions in a table format
✔ Export results to CSV

(Conditional logic support is added, but very basic — just enough for testing.)

Tech Stack I Used
Part	Technology
Frontend	React + Vite + Axios
Backend	Node.js, Express, MongoDB
Auth	Airtable OAuth + JWT
External API	Airtable schema + records API
How It Works (Flow Summary)
User logs in → Airtable permission page → Select base → Select table → Choose fields → Form gets generated → Submit → View responses

Setup Guide (Simple)
Backend
cd backend
npm install
npm start


You also need a .env file like this:

AIRTABLE_CLIENT_ID=xxxx
AIRTABLE_CLIENT_SECRET=xxxx
AIRTABLE_REDIRECT_URI=http://localhost:4000/auth/callback
JWT_SECRET=something_secret
MONGO_URI=mongodb://localhost:27017/formbuilder
FRONTEND_URL=http://localhost:5173

Frontend
cd frontend
npm install
npm run dev


Then open:

 http://localhost:5173

Airtable OAuth Setup (Important Step)

I had to create an OAuth app in Airtable:

https://airtable.com/create/oauth

Then I added this redirect URL:

http://localhost:4000/auth/callback


I also enabled the required scopes:

data.records:read

data.records:write

schema.bases:read

user.email:read

Otherwise, Airtable kept showing “permission denied” .

Data Models (Short Summary)

Forms are saved like this:

Which Airtable base/table it belongs to

Which fields were selected

Optional conditions for showing/hiding fields

Responses store:

The submitted answers

The Airtable record ID

Timestamp

Screenshots 📸

(I added screenshots for every key step — login → select table → build → submit → responses.)

(Images stored in screenshots and referenced in README using relative paths)

What I Learned 

OAuth looks complicated, but once PKCE + redirect flow clicked, everything started making sense.

Mapping Airtable schema to dynamic UI was the most interesting part.

Debugging token expiry and unauthorized issues felt painful at first but was very good learning.

Next Improvements (If I continue)

Public sharable form links (like Google Forms)

Better conditional logic

File uploads mapped to Airtable attachments

Webhooks to sync updates both ways

Final Note

This started as something small, but I ended up learning a lot about authentication and dynamic UI rendering. The project now feels like a mini version of Typeform/Tally built on Airtable — and I’m happy with how it turned out.