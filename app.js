// Firebase configuration - replace with your actual configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwUq2-TsmjKJhQ4V67PR-V20RzQuffNzo",
  authDomain: "ivsensemonitoring.firebaseapp.com",
  projectId: "ivsensemonitoring",
  storageBucket: "ivsensemonitoring.appspot.com",
  messagingSenderId: "445779689813",
  appId: "1:445779689813:web:f12e26ff5c50ab80e2afdc",
  measurementId: "G-LR4CPWJDMM"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Get the reference to the table body where the data will be displayed
const sensorDataBody = document.getElementById('sensorDataBody');

// Function to fetch and display data from Firestore
function displaySensorData() {
  console.log("Fetching data from Firestore...");

  db.collection('sensor_data').get().then((querySnapshot) => {
    sensorDataBody.innerHTML = ''; // Clear previous content

    if (querySnapshot.empty) {
      const row = document.createElement('tr');
      const noDataCell = document.createElement('td');
      noDataCell.textContent = 'No sensor data available';
      noDataCell.colSpan = 3; // Update colspan to match the new table structure
      row.appendChild(noDataCell);
      sensorDataBody.appendChild(row);
      return;
    }

    // Loop through each document in the collection
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const monitorID = data.monitorID; // Fetch the monitor ID
      const fluidRemaining = data.fluidRemaining; // Fetch the fluid remaining

      // Determine alert status based on fluid remaining
      let alertStatus = "Normal"; // Default status
      let rowColor = ""; // To determine row color

      if (fluidRemaining <= 10) {
        alertStatus = "Critical"; // Set alert status to Critical
        alert(`Critical Alert: Fluid remaining is critically low for Monitor ID ${monitorID} (${fluidRemaining}%)`); // Alert for Critical fluid remaining
        rowColor = "red"; // Change entire row to red for fluid remaining below 10%
      } else if (fluidRemaining <= 15) {
        alertStatus = "Low"; // Set alert status to Low
        alert(`Warning: Fluid remaining is low for Monitor ID ${monitorID} (${fluidRemaining}%)`); // Alert for Low fluid remaining
      }

      // Create a new row for each sensor data entry
      const row = document.createElement('tr');
      if (rowColor) {
        row.style.backgroundColor = rowColor; // Set row color if applicable
      }

      // Create the monitor ID cell
      const monitorIDCell = document.createElement('td');
      monitorIDCell.textContent = monitorID;
      row.appendChild(monitorIDCell);

      // Create the fluid remaining cell
      const fluidRemainingCell = document.createElement('td');
      fluidRemainingCell.textContent = `${fluidRemaining}%`;
      row.appendChild(fluidRemainingCell);

      // Create the alert status cell
      const alertStatusCell = document.createElement('td');
      alertStatusCell.textContent = alertStatus; // Display alert status
      row.appendChild(alertStatusCell);

      // Append the new row to the table body
      sensorDataBody.appendChild(row);
    });
  }).catch((error) => {
    console.error('Error fetching sensor data:', error);
    sensorDataBody.innerHTML = '<tr><td colspan="3">Error loading sensor data</td></tr>'; // Update colspan to match the new structure
  });
}

// Fetch data when the page loads
window.onload = function() {
  displaySensorData();
};