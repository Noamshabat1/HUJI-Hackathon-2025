import React, { useState } from 'react';
import './App.css';

// List of taboo subjects (sensitive keywords)
const TABOO_SUBJECTS = [
  'diagnosis', // Specific diagnosis
  'treatment', // Treatment details
  'medication', // Specific medication names
  'prognosis', // Prognosis or future state
  'medical history', // Medical history
  'test results', // Test results
  'billing', // Billing information
  'insurance', // Insurance information
  'social security', // Social Security Number
  'date of birth', // Exact date of birth
  'address', // Personal address
  'family history', // Family history
  'allergies', // Specific allergies
  'procedures' // Past or future medical procedures
];

// Simulation of a database of connection codes and patients
const MOCK_DATABASE = {
  "CODE123": { // Valid code
    patientId: "P001",
    name: "John Doe",
    hospital: "City General Hospital", // Added hospital name
    department: "Cardiology", // Replaced with department
    attendingPhysician: "Dr. Smith",
    attendingPhysicianPermission: true, // Permission granted
    condition: "Stable",
    lastUpdate: "2024-07-26 10:00 AM",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24h
    chatHistory: [{ sender: 'System', text: 'Chat room opened for John Doe.' }]
  },
  "CODE456": { // Another valid code
    patientId: "P002",
    name: "Jane Roe",
    hospital: "County Medical Center", // Added hospital name
    department: "Neurology", // Replaced with department
    attendingPhysician: "Dr. Emily Carter",
    attendingPhysicianPermission: false, // Permission not granted
    condition: "Critical but improving",
    lastUpdate: "2024-07-26 11:30 AM",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    chatHistory: [{ sender: 'System', text: 'Chat room opened for Jane Roe.' }]
  },
  "EXPIRED789": { // Code that would be expired
    patientId: "P003",
    name: "Peter Pan",
    hospital: "Children's Health Center", // Added hospital name
    department: "Pediatrics", // Replaced with department
    attendingPhysician: "Dr. Hook",
    attendingPhysicianPermission: true, // Permission granted (even if code is expired)
    condition: "Recovering",
    lastUpdate: "2024-07-24 09:00 AM",
    validUntil: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Expired 2 days ago
  }
};

const validateConnectionCodeAndFetchData = async (code) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network latency
      const record = MOCK_DATABASE[code.toUpperCase()];
      if (!record) {
        reject(new Error("Invalid connection code. Please try again."));
        return;
      }
      if (new Date() > record.validUntil) {
        reject(new Error("This connection code has expired. Please request a new one."));
        return;
      }
      resolve(record); // Return the entire patient record
    }, 1000);
  });
};

function App() {
  const [connectionCode, setConnectionCode] = useState('');
  const [patientData, setPatientData] = useState(null); // Stores complete patient data
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const [showNurseMessageInput, setShowNurseMessageInput] = useState(false); // State to control nurse message input visibility
  const [nurseMessage, setNurseMessage] = useState(''); // State for the nurse message content
  const [nurseMessageSent, setNurseMessageSent] = useState(false); // State to track if nurse message was sent
  const [isNurseButtonDisabled, setIsNurseButtonDisabled] = useState(false); // State to disable nurse message button

  const handleInputChange = (event) => {
    setConnectionCode(event.target.value);
  };

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const handleSubmitConnectionCode = async (event) => {
    event.preventDefault();
    if (!connectionCode.trim()) {
      setError('Please enter a connection code.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const data = await validateConnectionCodeAndFetchData(connectionCode);
      setPatientData(data);
      // Prepare patient information for initial display in chat
      const initialPatientInfo = `
Patient Name: ${data.name} (ID: ${data.patientId})
Hospital: ${data.hospital}
Department: ${data.department}
${data.attendingPhysicianPermission ? `Attending Physician: ${data.attendingPhysician}` : ''}
Condition: ${data.condition}
Last Update: ${data.lastUpdate}
Code valid until: ${data.validUntil.toLocaleString()}
      `.trim();
      setChatMessages([
        { sender: 'System', text: `Connection established for patient ${data.name}.` },
        { sender: 'System', text: 'Patient Details:', details: initialPatientInfo }
      ]);
      setIsInChatMode(true);
    } catch (err) {
      setError(err.message);
      setIsInChatMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]); // Changed sender to User
    setCurrentMessage('');

    // Check if the message contains a taboo subject
    const isTaboo = TABOO_SUBJECTS.some(subject =>
      userMessage.toLowerCase().includes(subject.toLowerCase())
    );

    let messageContentToSend;

    if (isTaboo) {
      // If it's a taboo subject, send a specific instruction to the backend.
      // The backend will interpret this instruction to ask Gemini to respond with the privacy message.
      messageContentToSend = "SEND_PRIVACY_MESSAGE"; // Indicator for the backend
    } else {
      // Otherwise, send the original user message
      messageContentToSend = userMessage;
    }

    setIsLoading(true); // Indicate loading while waiting for backend response

    try {
      // TODO: Replace with actual backend API call
      // Replace '/api/chat' with your actual backend endpoint.
      const response = await fetch('/api/chat', { // Placeholder endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContentToSend,
          patientId: patientData?.patientId // Send patient ID to backend if needed
          // TODO: Include chat history if the backend needs it for context
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      // TODO: Extract the actual Gemini response text from the backend's response data
      // Assuming the backend returns the response in a field like 'replyText'
      const geminiResponseText = data.replyText || "Could not get response from assistant."; // Placeholder for actual response field

      setChatMessages(prevMessages => [...prevMessages, { sender: 'Gemini', text: geminiResponseText }]);

    } catch (err) {
      console.error("Error communicating with backend:", err);
       setChatMessages(prevMessages => [...prevMessages, { sender: 'System', text: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNurseMessage = async () => {
    if (!nurseMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual backend API call for nurse/staff messages
      // Replace '/api/nurse-message' with your actual backend endpoint for these messages.
      const response = await fetch('/api/nurse-message', { // Placeholder endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: nurseMessage.trim(),
          patientId: patientData?.patientId // Include patient ID
          // TODO: Include any other necessary context (e.g., nurse/staff recipient if applicable)
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      // Assuming success, clear the message and hide the input
      setNurseMessage('');
      setShowNurseMessageInput(false);
      setNurseMessageSent(true); // Set sent state to true
      setIsNurseButtonDisabled(true); // Disable the button
      // TODO: Optionally, add a confirmation message to the chat or a notification

    } catch (err) {
      console.error("Error sending message to nurse/staff backend:", err);
      // TODO: Display error to the user
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInChatMode) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Nurse Online - Patient Access</h1>
        </header>
        <main>
          <form onSubmit={handleSubmitConnectionCode} className="patient-form">
            <label htmlFor="connectionCodeInput">Enter Connection Code:</label>
            <input
              type="text"
              id="connectionCodeInput"
              value={connectionCode}
              onChange={handleInputChange}
              placeholder="e.g., CODE123"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Open chat room'}
            </button>
          </form>

          <p className="terms-note">*By entering the code, you accept the <a href="#">terms of use</a> and <a href="#">privacy policy</a>.</p>

          {error && <p className="error-message">{error}</p>}
        </main>
        <footer className="App-footer">
          <p>&copy; 2025 Nurse Online. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Chat Room View
  return (
    <div className="App chat-mode">
      <header className="App-header">
        <h1>Chat with Gemini - Patient: {patientData?.name || 'N/A'}</h1>
        <button onClick={() => { setIsInChatMode(false); setConnectionCode(''); setPatientData(null); setError(null); }} className="exit-chat-button">
          Exit Chat
        </button>
      </header>
      <main className="chat-container">
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message message-${msg.sender.toLowerCase()}`}>
              <strong>{msg.sender}:</strong> 
              {msg.text}
              {msg.details && <pre className="message-details">{msg.details}</pre>}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={currentMessage}
            onChange={handleMessageChange}
            placeholder="Type your message to Gemini..."
            disabled={!patientData} // Disable if no patient data (should not happen here)
          />
          <button type="submit" disabled={!patientData || !currentMessage.trim()}>
            Send
          </button>
        </form>

        {/* Button to show nurse message input */}
        {!showNurseMessageInput && !nurseMessageSent && (
          <button onClick={() => setShowNurseMessageInput(true)} className="nurse-message-button" disabled={isNurseButtonDisabled}>
            Send message to Nurse/Staff
          </button>
        )}

        {/* Nurse message input area (conditionally rendered) */}
        {showNurseMessageInput && (
          <div className="nurse-message-input-area">
            <textarea
              value={nurseMessage}
              onChange={(e) => setNurseMessage(e.target.value)}
              placeholder="Type your message for the Nurse/Staff..."
              rows="4"
            />
            <button onClick={handleSendNurseMessage} disabled={!nurseMessage.trim() || isLoading}>
              Send to Staff
            </button>
            <button onClick={() => setShowNurseMessageInput(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        )}

        {/* Confirmation message */}
        {nurseMessageSent && (
          <p className="confirmation-message">Your message has been received and is being sent to a staff member.</p>
        )}

      </main>
      <footer className="App-footer">
        <p>&copy; 2025 Nurse Online. Connected as: User | Patient ID: {patientData?.patientId || 'N/A'}</p>
      </footer>
    </div>
  );
}

export default App;
