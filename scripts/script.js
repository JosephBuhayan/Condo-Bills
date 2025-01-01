const seeBreakdownWaterButton = document.getElementById('see-breakdown-water');
const overlay = document.getElementById('overlay');
const closeOverlayButton = document.getElementById('close-overlay');
const breakdownTable = document.getElementById('breakdown-table');
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3IYD7qNujv5woxssmD_-qo9MXceH_O7JeDzJEMcMkVqRby28cY_63R6MKbdkdlH3Nulf1c_7SB21G/pubhtml'; // Replace with your URL
const waterBillId = 'A1 101'; // The ID for the water bill in your sheet

seeBreakdownWaterButton.addEventListener('click', () => {
  // Fetch data for the water bill only
  fetchGoogleSheetData(waterBillId);

  // Show the overlay
  overlay.style.display = 'block';
});

closeOverlayButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

function fetchGoogleSheetData(billId) {
  fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
      const rows = parseSheetData(data);
      const rowData = findRowById(rows, billId);

      if (rowData) {
        updateTableContent(rowData);
      } else {
        console.error('Data not found for ID:', billId);
        // Handle error (e.g., display an error message)
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Handle error (e.g., display an error message)
    });
}

// (Same parseSheetData function as before)
function parseSheetData(data) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const table = doc.querySelector('table');
  const rows = [];

  if (table) {
    const trs = table.querySelectorAll('tr');
    for (let i = 3; i < trs.length; i++) { // Start from the 4th row (index 3)
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

// (Same findRowById function as before)
function findRowById(rows, billId) {
  return rows.find(row => row[0] === billId);
}

// (Same updateTableContent function as before)
function updateTableContent(rowData) {
    // Extract data from the rowData array (adjust column indices as needed)
    const billingPeriod = rowData[1];
    const waterConsumption = rowData[2];
    const previousReading = rowData[3];
    const presentReading = rowData[4];
    const amtCM3 = rowData[5];
    const amountPerCubic = rowData[6];
    const septOct = rowData[7];
    const augSept = rowData[8];
    const julyAug = rowData[9];
    const juneJuly = rowData[10];
    const mayJune = rowData[11];
    const aprilMay = rowData[12];
    const precedingMonths = rowData[13];
    const penalty = rowData[14];
    const total = rowData[15];

    // Update the table content
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
                <td>Water Consumption</td>
                <td>${waterConsumption}</td>
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