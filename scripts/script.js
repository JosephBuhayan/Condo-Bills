const seeBreakdownWaterButton = document.getElementById('see-breakdown-water');
const overlay = document.getElementById('overlay');
const closeOverlayButton = document.getElementById('close-overlay');
const breakdownTable = document.getElementById('breakdown-table');
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3IYD7qNujv5woxssmD_-qo9MXceH_O7JeDzJEMcMkVqRby28cY_63R6MKbdkdlH3Nulf1c_7SB21G/pubhtml'; // Replace with your URL
const unitNum = document.getElementById('UnitNum').textContent; // Get the Unit Number from the page

seeBreakdownWaterButton.addEventListener('click', () => {
  // Fetch data for the specific unit number
  fetchGoogleSheetData(unitNum);

  // Show the overlay
  overlay.style.display = 'block';
});

closeOverlayButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

function fetchGoogleSheetData(unitNum) {
  fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
      const rows = parseSheetData(data);
      const rowData = findRowByUnitNum(rows, unitNum);

      if (rowData) {
        updateTableContent(rowData);
      } else {
        console.error('Data not found for Unit Number:', unitNum);
        // Handle the case where data is not found (e.g., display an error message in the overlay)
        displayTableError(`Data not found for Unit Number: ${unitNum}`);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Handle errors (e.g., display an error message in the overlay)
      displayTableError('Error fetching data. Please try again later.');
    });
}

function parseSheetData(data) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const table = doc.querySelector('table');
  const rows = [];

  if (table) {
    const trs = table.querySelectorAll('tr');
    for (let i = 3; i < trs.length; i++) { // Start from the 4th row (index 3) to skip headers
      const row = [];
      const tds = trs[i].querySelectorAll('td');
      for (let j = 0; j < tds.length; j++) {
        row.push(tds[j].textContent);
      }
      rows.push(row);
    }
  }

  return rows;
}

function findRowByUnitNum(rows, unitNum) {
  // Find the row where the value in the "Break Down" column (2nd column, index 1) matches the unitNum
  return rows.find(row => row[1] === unitNum);
}

function updateTableContent(rowData) {
  // Extract data from the rowData array (adjust column indices as needed based on your sheet)
  const billingPeriod = rowData[0]; // Billing Period
  const previousReading = rowData[2]; // Previous Reading
  const presentReading = rowData[3]; // Present Reading
  const amtCM3 = rowData[4]; // Amt CM^3
  const amountPerCubic = rowData[5]; // Amt. Per Cubic
  const septOct = rowData[6]; // September - October
  const augSept = rowData[7]; // August - September
  const julyAug = rowData[8]; // July - August
  const juneJuly = rowData[9]; // June - July
  const mayJune = rowData[10]; // May - June
  const aprilMay = rowData[11]; // April - May
  const precedingMonths = rowData[12]; // All Preceding Months
  const penalty = rowData[13]; // Penalty
  const total = rowData[14]; // Total

  // Update the table content of the overlay
  breakdownTable.innerHTML = `
    <thead>
        <tr>
            <th>Item</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Billing Period</td>
            <td>${billingPeriod}</td>
        </tr>
        <tr>
            <td>Previous Reading</td>
            <td>${previousReading}</td>
        </tr>
        <tr>
            <td>Present Reading</td>
            <td>${presentReading}</td>
        </tr>
        <tr>
            <td>Amt CM^3</td>
            <td>${amtCM3}</td>
        </tr>
        <tr>
            <td>Amount Per Cubic</td>
            <td>${amountPerCubic}</td>
        </tr>
        <tr>
            <td>Sept - Oct</td>
            <td>${septOct}</td>
        </tr>
        <tr>
            <td>Aug - Sept</td>
            <td>${augSept}</td>
        </tr>
        <tr>
            <td>July - Aug</td>
            <td>${julyAug}</td>
        </tr>
        <tr>
            <td>June - July</td>
            <td>${juneJuly}</td>
        </tr>
        <tr>
            <td>May - June</td>
            <td>${mayJune}</td>
        </tr>
        <tr>
            <td>April - May</td>
            <td>${aprilMay}</td>
        </tr>
        <tr>
            <td>All Preceding Months</td>
            <td>${precedingMonths}</td>
        </tr>
        <tr>
            <td>Penalty</td>
            <td>${penalty}</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>${total}</td>
        </tr>
    </tbody>
  `;
}

// Function to display an error message in the table
function displayTableError(errorMessage) {
  breakdownTable.innerHTML = `
    <thead>
        <tr>
            <th>Error</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${errorMessage}</td>
        </tr>
    </tbody>
  `;
}