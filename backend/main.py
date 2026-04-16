from fastapi import FastAPI, Request, Depends, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Appointment
from datetime import datetime

app = FastAPI(title="Dental Clinic API")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----- 1. WEBSITE API ENDPOINT -----
@app.post("/api/book")
async def book_appointment_website(
    patient_name: str = Form(...),
    phone_number: str = Form(...),
    preferred_date: str = Form(...),
    symptom: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        new_apt = Appointment(
            patient_name=patient_name,
            phone_number=phone_number,
            preferred_date=preferred_date,
            symptom=symptom,
            source="website"
        )
        db.add(new_apt)
        db.commit()
        return JSONResponse(content={"status": "success", "message": "Appointment booked successfully!"})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

# ----- 2. WHATSAPP WEBHOOK (META OFFICIAL API) -----
# Verification GET request (Meta requires this when setting up the webhook)
VERIFY_TOKEN = "shara_dental_secret_token_123"

@app.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    if mode == "subscribe" and token == VERIFY_TOKEN:
        return int(challenge)
    return JSONResponse(content={"error": "Invalid verification token"}, status_code=403)

# Webhook POST request to receive messages
@app.post("/webhook")
async def receive_whatsapp_message(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    
    # Very basic parsing for WhatsApp API structure
    if "object" in data and data["object"] == "whatsapp_business_account":
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages", [])
                
                for message in messages:
                    # Extract info
                    sender_phone = message.get("from")
                    msg_text = message.get("text", {}).get("body", "").lower()
                    
                    # TODO: Implement full state machine here (Name -> Date -> Confirm)
                    # For now, if they type "book", we log a placeholder appointment
                    if "book" in msg_text:
                        new_apt = Appointment(
                            patient_name="WhatsApp User",
                            phone_number=sender_phone,
                            preferred_date="Pending",
                            symptom="Pending",
                            source="whatsapp"
                        )
                        db.add(new_apt)
                        db.commit()
                        
                        # In a complete bot, you'd send an HTTP POST back to Meta's graph API here
                        # httpx.post(f"https://graph.facebook.com/v17.0/{PHONE_ID}/messages", ...)
                        
        return {"status": "ok"}
    return {"status": "ignored"}

# ----- 3. ADMIN DASHBOARD -----
@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).order_by(Appointment.created_at.desc()).all()
    
    rows = ""
    for apt in appointments:
        date_str = apt.created_at.strftime("%Y-%m-%d %H:%M")
        source_badge = f'<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">WhatsApp</span>' if apt.source == "whatsapp" else f'<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Website</span>'
        
        rows += f'''
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apt.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.patient_name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.phone_number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.preferred_date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.symptom}</td>
            <td class="px-6 py-4 whitespace-nowrap">{source_badge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{date_str}</td>
        </tr>
        '''
        
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sharada Dental - Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8 font-sans">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Appointments Dashboard</h1>
                <div class="bg-white px-4 py-2 rounded shadow text-sm font-semibold text-gray-600">
                    Total Bookings: {len(appointments)}
                </div>
            </div>
            
            <div class="bg-white shadow overflow-hidden rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pref. Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptom/Notes</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Booked</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {rows if rows else '<tr><td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No appointments yet.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# Mount the frontend files (index.html, style.css, script.js are in the parent directory)
app.mount("/", StaticFiles(directory="../", html=True), name="frontend")
