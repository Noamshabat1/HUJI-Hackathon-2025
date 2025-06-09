# MedAssist AI 

> AI-driven hospital assistant: anticipate clinical needs, optimize workflows, and deliver real-time patient insights across the care continuum.

> Harnessing continuous data streams and predictive modeling, MedAssist AI transforms hospital operations—from live patient monitoring to discharge planning—into seamless, patient-centered workflows, ensuring no detail is missed and every decision is powered by actionable intelligence.

---

## 🔍 Overview

MedAssist AI is a comprehensive hospital assistant platform built in 24 hours at HUJI Hackathon 2025, combining a Python FastAPI backend, a React dashboard, and Google’s Gemini AI:

- **Forecasts discharge readiness** hours in advance using adaptive, AI-driven risk scores.  
- **Identifies real-time discharge blockers**—from lab bottlenecks to consult backlogs and transport delays—using a blend of rule-based logic and NLP.  
- **Automates care-team workflows** by routing nursing alerts, PT orders, and social-work referrals directly to the right staff.  
- **Empowers clinicians with an interactive AI assistant** for instant patient summaries, vital-sign trend analysis, and data-driven next steps.  
- **Seamlessly integrates with existing EMRs**, requiring minimal configuration to enhance current workflows without disruption.  

---

## 🌟 Key Features

| Feature                          | Benefit                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| 🚑 **Real-time Bed Dashboard**   | Live EMR sync of occupancy, predicted discharges & length-of-stay metrics       |
| 🤖 **Discharge-Readiness Score** | Model trained based on hospital configurations and set metrics limitations      |
| 📝 **Blocker Detection**         | Combines rules (orders/labs) + NLP on notes to surface open tasks               |
| 📬 **Smart Task Routing**        | Automates assignment of blockers to nurses, PTs, social workers, etc.           |
| 💬 **Self-Service Chatbot**      | /chat endpoint powered by Gemini: ask for vitals, status, clinical summary and next steps      |
| 🔒 **Privacy by Design**         | All PHI de-identified on‑prem; zero identifiers leave hospital network          |
| 🔌 **Plugin-Friendly**           | Swap ML models or EMR connectors                                                |

---
## 📐 Architecture
| Layer                          | Technology & Role                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------- |
| Backend API   | Python 3.12, FastAPI, Pydantic v2, Uvicorn; /hospital, /patients, /chat and more endpoints       |
| Logic Layer | OO Entities       |
| Data Layer         | JSON seed files (in-memory), SQLite (demo), with save-on-shutdown for persistence               |
| Frontend        | React, Tailwind CSS; <PatientsTable>, <PatientMedicalSummary>, color-coded rows           |
| AI/NLP      | XGBoost for risk; Google Gemini for chat summarization & blocker NLP      |
| Infra & CI         | Docker Compose; GitHub Actions CI/CD; Swagger UI for API docs          |


Extensibility: Modular adapters allow swapping LLMs, ML models, or database backends independently.

--- 

## 📸 Screenshots

| Landing Page                                                                                                                                | Doctor Dashboard                                                                                                                                         | Login Screen                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="docs/images/landing.jpg" alt="Landing Page" width="600" /> | <img src="docs/images/doctor_dashboard.jpg" alt="Doctor Dashboard" width="600" /> | <img src="docs/images/login.jpg" alt="Login Screen" width="600" /> |


## 🎥 Demo Video

<details>
  <summary>▶️ Watch the full demo</summary>

  <p align="center">
    <a href="https://youtu.be/jakP6N2kDo8" target="_blank">
      <img src="https://img.youtube.com/vi/jakP6N2kDo8/maxresdefault.jpg" alt="MedAssist AI Demo Thumbnail" width="600" />
    </a>
  </p>
</details>


---

## ⚙️ Tech Stack & Architecture

```plaintext
📦 HUJI-Hackathon-2025
├── .git/                          # Git version history
├── .idea/                         # IDE config files
├── LICENSE                        # MIT license
├── README.md                      # Project documentation
├── HospitalAssistant/             # Core backend (FastAPI + domain logic)
│   ├── api/                       # FastAPI routes
│   │   ├── __init__.py            # Package marker
│   │   └── app.py                 # Main application and router
│   ├── core/                      # Data layer & schemas
│   │   ├── __init__.py            # Package marker
│   │   ├── database.py            # SQLite/in-memory storage setup
│   │   └── schemas.py             # Pydantic models for requests/responses
│   ├── entities/                  # Domain models (OO logic)
│   │   ├── __init__.py            # Package marker
│   │   ├── Hospital.py
│   │   ├── MedicalRecord.py
│   │   ├── Patient.py
│   │   ├── SocialProfile.py
│   │   ├── VitalSign.py
│   │   └── Ward.py
│   ├── data/                      # Sample hospital datasets (JSON)
│   │   ├── demo_hospital.json
│   │   ├── demo_hospital_data.json
│   │   ├── hospital_15_patients.json
│   │   └── hospital_demo_balanced.json
│   ├── services/                  # External integrations & service controllers
│       ├── EMRConnector.py        # EMR data extraction
│       ├── ConversationService.py # Chat/interaction logic
│       ├── LLMService.py          # Gemini/LLM orchestration
│       ├── NotificationService.py # Teams/Slack routing
│       └── PredictiveModelController.py # ML inference handler   
└── docs/                          # Documentation assets
    ├── images/                    # Screenshots for README
    │   ├── landing.jpg
    │   ├── doctor_dashboard.jpg
    │   └── login.jpg
    └── demo/                      # Demo video/GIF
        └── medassist_demo.mp4

````

---

| Layer           | Technology & Role                                                    |
|-----------------|----------------------------------------------------------------------|
| **Backend API** | Python 3.12, FastAPI, Pydantic v2, Uvicorn                           |
| **Logic Layer** | OO Entities for domain rules; `Patient.discharge_ready()` & blockers  |
| **Data Layer**  | SQLite (demo) or in‑memory store; JSON seed files                    |
| **NLP/ML**      | XGBoost model + Gemini NLP for text summarization                   |
| **Infra**       | Docker Compose; GitHub Actions CI/CD                                 |

**Extensibility:** Modular adapters let you swap LLM providers (OpenAI, Cohere), upgrade to PostgreSQL or FHIR feeds, and containerize services independently.

</details>

---


## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/Noamshabat1/HUJI-Hackathon-2025.git
cd HUJI-Hackathon-2025

# Start backend server
cd HospitalAssistant
uvicorn api.app:app --port 8003 --log-level debug

# Start frontend server
cd med_assist_website
npm install
npm start
````


---

## 👥 Team & Roles

| Name           | Role                |
| -------------- | ------------------- |
| Shay Morad | Team Lead & Backend     |
| Noam Shabat    | Backend & Full-Stack & DevOps & UX/UI | 
| Nitzan Ventura     |  Full-Stack & UX/UI    |
| Samuel Hayat  | Frontend    |

*Built in 24 h at ********HUJI Hackathon 2025******** (May 29–30, Jerusalem).*

---

## Acknowledgments

Special thanks to [Professor Michael Rosenberg, MD](https://med.umn.edu/bio/michael-rosenberg) for his expert guidance and support throughout this project.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

