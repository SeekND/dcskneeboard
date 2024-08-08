const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');   

});

function loadAircraftData() {
  fetch(`aircraft/aircraft_data.json`)
    .then(response => response.json())
    .then(aircraftData => {
      const mainPage = document.querySelector('.main-page');

      // Group aircraft by type
      const aircraftByType = {};
      aircraftData.forEach(aircraft => {
        if (!aircraftByType[aircraft.type]) {
          aircraftByType[aircraft.type] = [];
        }
        aircraftByType[aircraft.type].push(aircraft);
      });

      // Create button categories for each type
      for (const type in aircraftByType) {
        const buttonCategory = document.createElement('div');
        buttonCategory.classList.add('button-category');

        const categoryHeader = document.createElement('h2');
        categoryHeader.textContent = type.toUpperCase();
        buttonCategory.appendChild(categoryHeader);

        // Create buttons for each aircraft within the category
        aircraftByType[type].forEach(aircraft => {
          const buttonWrapper = document.createElement('div');
          buttonWrapper.classList.add('button-wrapper');

          const button = document.createElement('button');
          button.classList.add('image-button');   

          button.style.backgroundImage = `url('aircraft/${aircraft.name}/${aircraft.name}.jpg')`;
          button.onclick = () => loadAircraft(aircraft.name);
          buttonWrapper.appendChild(button);
 	  buttonWrapper.appendChild(document.createElement('br'));
          const buttonLabel = document.createElement('span');
          buttonLabel.classList.add('button-label');
          buttonLabel.textContent = aircraft.name.toUpperCase();
          buttonWrapper.appendChild(buttonLabel);

          buttonCategory.appendChild(buttonWrapper);
        });

        mainPage.appendChild(buttonCategory);
      }
    })
    .catch(error => console.error('Error loading aircraft data:', error));
}

document.addEventListener('DOMContentLoaded', loadAircraftData);

function loadAircraft(aircraftId) {

    // 1. Hide the main page and show the aircraft content section
    document.querySelector('.main-page').style.display = 'none';
    document.getElementById('aircraft-content').style.display = 'block';

    // 2. Dynamically generate tab buttons
    const tabButtons = document.getElementById("tab-buttons");
    tabButtons.innerHTML = ""; 



    createTabButton('checklist', aircraftId);
    createTabButton('emergency', aircraftId);
    createTabButton('airfields');
    createTabButton('reference');
    createTabButton('notepad');

    // Trigger the loading of the initial tab content (e.g., 'checklist')
    changeTab('checklist', aircraftId);


    // 3. Construct the image path based on the aircraftId
    const imagePath = `aircraft/${aircraftId}/${aircraftId}.jpg`;

    // 4. Create and display the aircraft image within the tab-buttons div
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = aircraftId;
    img.style.width = '50px';
    img.style.height = '50px';


    // Create a button to hold the aircraft name
    const aircraftNameButton = document.createElement('button');
    aircraftNameButton.textContent = aircraftId.toUpperCase();
    aircraftNameButton.classList.add('aircraft-name-button');

    // Append the image and the name button to tabButtons

    tabButtons.appendChild(aircraftNameButton);    
    tabButtons.appendChild(img);

    // Add a spacer element
    const spacer = document.createElement('div');
    spacer.style.width = '20px';
    spacer.style.display = 'inline-block';
    tabButtons.appendChild(spacer);

    // 5. Load all content for the selected aircraft upfront
    loadAllContent(aircraftId);
}

function createTabButton(tabId, aircraftId = null) { // aircraftId is optional for non-aircraft-specific tabs
    const tabButtons = document.getElementById("tab-buttons");
    const button = document.createElement('button');
    button.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    button.onclick = () => changeTab(tabId, aircraftId); 
    tabButtons.appendChild(button);
}


function loadAllContent(aircraftId) {

    loadChecklistTypes(aircraftId);
    loadEmergencyProceduresType(aircraftId); 
    loadReferenceContent();
    loadAirfieldButtons();
}


// START LOAD CHECKLIST ///////////////////////////////////////////////////

function loadChecklistTypes(aircraftId) {
    const checklistOptionsDiv = document.getElementById('checklist-options');
    checklistOptionsDiv.innerHTML = ''; 

    fetch(`aircraft/${aircraftId}/checklist/checklist.json`)
        .then(response => response.json())
        .then(data => {
            const checklistTypes = data.checklists;

            checklistTypes.forEach(type => {
                if (type.endsWith(".pdf") || type.startsWith("http")) { // Check if it's a PDF
                    // Create a button to load the external checklist in an iframe
                    const button = document.createElement('button');
                    button.textContent = "External Information (toggle)"; // Or any other suitable label
                    button.classList.add('external-checklist-button'); 
                    button.onclick = () => loadExternalChecklist(type); 
                    checklistOptionsDiv.appendChild(button);
                } else {
                    // Create a button for internal checklist types
                    const button = document.createElement('button');
                    button.textContent = type.toUpperCase();
                    button.onclick = () => loadChecklistType(type, aircraftId);
                    checklistOptionsDiv.appendChild(button);
                }
		
            });
            //checklistOptionsDiv.appendChild(document.createElement('br'));

        })
        .catch(error => console.error(`Error loading checklist data for ${aircraftId}:`, error));
}

function loadExternalChecklist(url) {
  const checklistContentDiv = document.getElementById("checklist-content");
  const pdfContainer = document.getElementById("pdf-container");

  // Toggle the visibility of the PDF container
  if (pdfContainer.style.display === 'none') {
    pdfContainer.style.display = 'block';
    checklistContentDiv.style.display = 'none'; // Hide the checklist content

    // Create the iframe only if it doesn't already exist
    if (!pdfContainer.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = '100%';

      const checklistoptionsHeight = document.getElementById('checklist-options').offsetHeight;
      const tabButtonsHeight = document.getElementById('tab-buttons').offsetHeight; // Get the height of the tab buttons
      iframe.height = window.innerHeight - tabButtonsHeight - checklistoptionsHeight -15 + 'px'; // Subtract tab buttons height and some padding
 
      pdfContainer.appendChild(iframe);
    }
    // Adjust iframe height on window resize
    window.addEventListener('resize', () => {
        const iframe = pdfContainer.querySelector('iframe');
        if (iframe) {
            const tabButtonsHeight = document.getElementById('tab-buttons').offsetHeight;
            iframe.height = window.innerHeight - tabButtonsHeight - 10 + 'px';
        }
    });
  } else {
    pdfContainer.style.display = 'none';
    checklistContentDiv.style.display = 'block'; // Show the checklist content
  }
}

function loadChecklistType(type, aircraftId) {

    fetch(`aircraft/${aircraftId}/checklist/${type}.json`)
        .then(response => response.json())
        .then(checklistData => {
    const checklistContentDiv = document.getElementById("checklist-content");
    const pdfContainer = document.getElementById("pdf-container");

    checklistContentDiv.innerHTML = ""; // Clear previous checklist content
    pdfContainer.innerHTML = ""; // Clear the PDF container
    pdfContainer.style.display = 'none'; // Hide the PDF container
    checklistContentDiv.style.display = 'block'; // Show the checklist content div

            // Iterate over all categories in the checklistData object
            for (const categoryName in checklistData) {
                const itemsData = checklistData[categoryName];

                // Check if itemsData is valid
                if (!itemsData || itemsData.length === 0) {
                    console.error(`Error: Invalid or empty data for category ${categoryName}`);
                    continue;
                }

                // Create a collapsible section for each category
                const collapsible = document.createElement('div');
                collapsible.className = "collapsible";
                collapsible.textContent = categoryName;

                const content = document.createElement('div');
                content.className = "checklist-content";
                content.style.display = "none";

                const table = document.createElement('table');

                // Find the first "item" type item to determine headers
                const firstItem = itemsData.find(item => item.type === 'item');
                const headers = firstItem
                    ? Object.keys(firstItem).filter(header => header !== 'type' && header !== 'locationText')
                    : [];

                // Create table header row
                const headerRow = table.insertRow();
                // Add an empty header for the checkbox if it's not already present
                if (!headers.includes("")) {
                    headers.unshift("");
                }
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header === "" ? "" : header.replace(/_/g, ' ');
                    headerRow.appendChild(th);
                });

                // Populate the table rows
                itemsData.forEach(item => {
                    if (item.type === 'item') {
                        // Handle regular checklist item 
                        const row = table.insertRow();
                        const checkboxCell = row.insertCell();
                        checkboxCell.innerHTML = '<input type="checkbox">';

                        // Add event listener to the checkbox
                        const checkbox = checkboxCell.querySelector('input[type="checkbox"]');
                        checkbox.addEventListener('change', () => {
                            checkCategoryCompletion(collapsible);
                        });

                        row.insertCell().textContent = item.requirement;
                        row.insertCell().textContent = item.action;

                        const locationCell = row.insertCell();
                        if (item.locationText) {
                            const locationBtn = document.createElement('button');
                            locationBtn.className = "location-btn";
                            locationBtn.dataset.img = `aircraft/${aircraftId}/checklist/images/${item.location}`;
                            locationBtn.textContent = item.locationText || "";
                            locationCell.appendChild(locationBtn);
			    console.log(locationBtn.dataset.img);
                        } else {
                            locationCell.textContent = "";
                        }
                    } else if (item.type === 'note') {
                        // Handle note item - create a new row
                        const noteRow = table.insertRow();
                        const noteCell = noteRow.insertCell();
                        noteCell.colSpan = 4; // Span across all 4 columns
                        noteCell.textContent = item.text;
                        noteCell.classList.add('note-cell');
                    }
                });

                content.appendChild(table);
                collapsible.addEventListener('click', () => {
                    content.style.display = (content.style.display === "none") ? "block" : "none";
                });

                checklistContentDiv.appendChild(collapsible);
                checklistContentDiv.appendChild(content);

                // Check category completion initially (after the table is populated)
                checkCategoryCompletion(collapsible);
            }
        })
        .catch(error => console.error(`Error loading checklist type ${type} for ${aircraftId}:`, error));
}



// END LOAD CHECKLIST ///////////////////////////////////////////////////


// START EMERGENCY CATEGORY FETCH /////////////////////////////////

function loadEmergencyProceduresType(aircraftId) {
  fetch(`aircraft/${aircraftId}/emergency/emergency.json`)
    .then(response => response.json())
    .then(emergencyProceduresData => {
      const emergencyContentDiv = document.getElementById("emergency");
      emergencyContentDiv.innerHTML = ""; // Clear previous emergency procedures content

      // Iterate over all categories in the emergencyProceduresData object
      for (const categoryName in emergencyProceduresData) {
        const itemsData = emergencyProceduresData[categoryName];

        // Check if itemsData is valid
        if (!itemsData || itemsData.length === 0) {
          console.error(`Error: Invalid or empty data for category ${categoryName}`);
          continue;
        }
        

        // Create a collapsible section for each category
        const collapsible = document.createElement('div');
        collapsible.className = "collapsible";
        collapsible.textContent = categoryName;

        const content = document.createElement('div');
        content.className = "checklist-content";
        content.style.display = "none";

        const table = document.createElement('table');

        // Find the first "item" type item to determine headers
        const firstItem = itemsData.find(item => item.type === 'item');
        const headers = firstItem
          ? Object.keys(firstItem).filter(header => header !== 'type' && header !== 'locationText')
          : [];

        // Create table header row
        const headerRow = table.insertRow();
        // Add an empty header for the checkbox if it's not already present
        if (!headers.includes("")) {
          headers.unshift("");
        }
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header === "" ? "" : header.replace(/_/g, ' ');
          headerRow.appendChild(th);
        });

        // Populate the table rows
        itemsData.forEach(item => {
          if (item.type === 'item') {
            // Handle regular emergency procedure item 
            const row = table.insertRow();
            const checkboxCell = row.insertCell();
            checkboxCell.innerHTML = '<input type="checkbox">';

            // Add event listener to the checkbox
            const checkbox = checkboxCell.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
              checkEmergency(collapsible);
            });

            row.insertCell().textContent = item.requirement || "";
            row.insertCell().textContent = item.action || "";

            const locationCell = row.insertCell();
            if (item.locationText) {
              const locationBtn = document.createElement('button');
              locationBtn.className = "location-btn";
              locationBtn.dataset.img = `aircraft/${aircraftId}/emergency/images/${item.locationImage}`;
              locationBtn.textContent = item.locationText || "";
              locationCell.appendChild(locationBtn);
            } else {
              locationCell.textContent = "";
            }
          } else if (item.type === 'note') {
            // Handle note item - create a new row
            const noteRow = table.insertRow();
            const noteCell = noteRow.insertCell();
            noteCell.colSpan = 4; 
            noteCell.textContent = item.text;
            noteCell.classList.add('note-cell');
          }
        });

        content.appendChild(table);
        collapsible.addEventListener('click', () => {
          content.style.display = (content.style.display === "none") ? "block" : "none";
        });

        emergencyContentDiv.appendChild(collapsible);
        emergencyContentDiv.appendChild(content);

        // Check category completion initially (after the table is populated)
        checkCategoryCompletion(collapsible);
      }
    })
    .catch(error => console.error(`Error loading emergency procedures for ${aircraftId}:`, error));
}

// END EMERGENCY CATEGORY FETCH /////////////////////////////////


// START REFERENCE CATEGORY FETCH /////////////////////////////////


function loadReferenceContent() {
  const referenceTab = document.getElementById("reference");
  referenceTab.innerHTML = "";

  getReferenceCategories() // This returns a Promise
    .then(categories => {
      if (Array.isArray(categories)) {
        categories.forEach(category => { // Iterate only after the Promise resolves
          loadReferenceCategory(category);
        });
      } else {
        console.error("Error: getReferenceCategories did not return an array.");
        // Handle the error gracefully, perhaps display a message to the user
      }
    })
    .catch(error => console.error("Error fetching reference categories:", error));
}


function getReferenceCategories() {
  return fetch('reference/reference_categories.json?t=${Date.now()}') 
    .then(response => response.json())
    .then(data => {
      return data.categories; 
    })
    .catch(error => console.error('Error fetching reference categories:', error));
}


// Function to load data for a specific reference category
function loadReferenceCategory(category) {
  const referenceTab = document.getElementById("reference");

  fetch(`reference/${category}/${category}.json?t=${Date.now()}`)
    .then(response => response.json())
    .then(categoryData => {
      // Create the collapsible header
      const collapsible = document.createElement('div');
      collapsible.className = "collapsible";
      collapsible.textContent = category;

      const content = document.createElement('div');
      content.className = "checklistcontent";
      content.style.display = "none";

      // Create the table dynamically based on the categoryData structure
      const table = createReferenceTable(categoryData , category);

      content.appendChild(table);
      collapsible.addEventListener('click', () => {
        content.style.display = (content.style.display === "none") ? "block" : "none";
      });

      referenceTab.appendChild(collapsible);
      referenceTab.appendChild(content);
    })
    .catch(error => console.error(`Error loading data for category ${category}:`, error));
}

function createReferenceTable(categoryData, categoryName) {
  const tableContainer = document.createElement('div');

  for (const category in categoryData) {
    const itemsData = categoryData[category];

    // Error handling for invalid/empty data
    if (!itemsData || itemsData.length === 0) {
      console.error(`Error: Invalid or empty data for category ${category}`);
      continue;
    }

    // Create a collapsible section for each category
    const collapsible = document.createElement('div');
    collapsible.className = "collapsible";

    const content = document.createElement('div');
    content.className = "checklist-content";
    content.style.display = "none";

    // Check if it's a main category or a subcategory
    if (category === categoryName) {
      collapsible.textContent = category;
    } else {
      // Subcategory - add indentation and lighter background
      
      const table2 = document.createElement('table');
      const headerRow2 = table2.insertRow();
      
      const indentedTitle = headerRow2.insertCell();
      indentedTitle.textContent = category;
      indentedTitle.style.marginLeft = '10px'; 
      collapsible.appendChild(indentedTitle);
      collapsible.style.backgroundColor = 'transparent';
      collapsible.classList.add('subcategory'); 
      content.style.display = "block";
    }


    const table = document.createElement('table');

    // Find the first item to determine headers
    const firstItem = itemsData[0];
    const headers = Object.keys(firstItem).filter(header => header !== 'type' && header !== 'locationText');

    const thead = document.createElement('thead');
    table.appendChild(thead);

    // Create table header row with sort buttons
    const headerRow = thead.insertRow();
    headers.forEach((header, index) => {
      const th = document.createElement('th');
      th.textContent = header.replace(/_/g, ' ');


      // Add a sort button/icon
      const sortButton = document.createElement('button');
      sortButton.textContent = '▲'; // Or use an icon
      sortButton.classList.add('sort-symbol');
      sortButton.dataset.columnIndex = index; // Store the column index for sorting
      sortButton.addEventListener('click', () => {
        sortTable(table, index); 
      });
      th.appendChild(sortButton);
      headerRow.appendChild(th);
    });

    // Create the table body (tbody) element
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);

    // Populate the table rows
    itemsData.forEach(item => {
      const row = tbody.insertRow();
      headers.forEach(header => {
        const cell = row.insertCell();

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('cell-content');

        if (header === 'image') {
          const img = document.createElement('img');
          img.src = `reference/${categoryName}/${item[header]}`;
          img.alt = header;
          contentWrapper.appendChild(img);
        } else {
          contentWrapper.textContent = item[header] || "";
        }

        cell.appendChild(contentWrapper);
      });
    });

    content.appendChild(table);
    collapsible.addEventListener('click', () => {
      content.style.display = (content.style.display === "none") ? "block" : "none";
    });

    tableContainer.appendChild(collapsible);
    tableContainer.appendChild(content);
  }

  return tableContainer;
}


// END REFERENCE CATEGORY FETCH /////////////////////////////////

// START AIRFIELD CATEGORY FETCH /////////////////////////////////

function loadAirfieldButtons() {
  const airfieldsDiv = document.getElementById("airfields");
  airfieldsDiv.innerHTML = ''; 

  fetch('terrain/airfields.json')
    .then(response => response.json())
    .then(data => {
      const airfieldNames = data.airfields;

      airfieldNames.forEach(airfieldName => {
        const button = document.createElement('button');
        button.textContent = airfieldName.toUpperCase();
        button.onclick = () => {
          showAirfield(airfieldName);

          // Remove 'active' class from all buttons
          const allButtons = airfieldsDiv.querySelectorAll('button');
          allButtons.forEach(btn => btn.classList.remove('active'));

          // Add 'active' class to the clicked button
          button.classList.add('active');
        };

        airfieldsDiv.appendChild(button);
      });
      const airfieldDetailsDiv = document.createElement('div');
      airfieldDetailsDiv.id = 'airfield-details';
      airfieldsDiv.appendChild(airfieldDetailsDiv);
      // ... (create airfield-details div)
    })
    .catch(error => console.error('Error loading airfield data:', error));
}

function showAirfield(terrainId) {
    const airfieldDetails = document.getElementById("airfield-details");
    airfieldDetails.innerHTML = ""; // Clear previous content

    // Load terrain image 
    const terrainImagePath = `terrain/${terrainId}/airfieldmapday.png`;

    const terrainImage = document.createElement('img');
    terrainImage.src = terrainImagePath;
    terrainImage.alt = terrainId;
    terrainImage.style.maxWidth = '100%';
    terrainImage.style.height = 'auto';
    airfieldDetails.appendChild(terrainImage);

    // Fetch airfield data for the selected terrain
    fetch(`terrain/${terrainId}/${terrainId}.json`)
        .then(response => response.json())
        .then(data => {
       // Create the table dynamically
      const table = document.createElement('table');

      // Create the table head (thead) element
      const thead = document.createElement('thead');
      table.appendChild(thead);

      // Determine table headers and create header row with sort buttons
      const headers = ["AIRFIELD", "ICAO", "Type", "Location", "ARP", "TWR", "ILS", "TACAN", "RWY"];
      const headerRow = thead.insertRow(); // Insert the header row into the thead
      headers.forEach((header, index) => {
                const th = document.createElement('th');
                th.textContent = header;

                // Add a sort button/icon
                const sortButton = document.createElement('button');
                sortButton.textContent = '▲'; // Or use an icon
	        sortButton.classList.add('sort-symbol');
                sortButton.dataset.columnIndex = index; 
		
                sortButton.addEventListener('click', () => {
                    sortTable(table, index);
                });
                th.appendChild(sortButton);
                headerRow.appendChild(th);
      });

      // Create the table body (tbody) element
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);

      // ... (Populate the table rows - use tbody.insertRow() now)
      data.forEach(airfield => {
        const row = tbody.insertRow();
	  
          // Airfield Name (with image button if available)
          const airfieldNameCell = row.insertCell();
          if (airfield.image) {
            const airfieldBtn = document.createElement('button');
            airfieldBtn.className = "airfield-btn";
            airfieldBtn.dataset.img = `terrain/${terrainId}/airfields/${airfield.image}`;
            airfieldBtn.textContent = airfield.AIRFIELD;
            airfieldNameCell.appendChild(airfieldBtn);
          } else {
            airfieldNameCell.textContent = airfield.AIRFIELD;
          }

          // Other Airfield Data
          row.insertCell().textContent = airfield.ICAO || "";
          row.insertCell().textContent = airfield.Type || "";
          row.insertCell().textContent = airfield.Location || "";
          //row.insertCell().textContent = airfield.ID || "";

                // ARP - create a hyperlink if ARP is not empty
                const arpCell = row.insertCell();
                if (airfield.ARP) {
                    const arpLink = document.createElement('a');
                    arpLink.href = `https://maps.google.com/?q=${encodeURIComponent(airfield.ARP)}`;
                    arpLink.target = "_blank"; // Open in a new tab
                    arpLink.textContent = airfield.ARP;
                    arpCell.appendChild(arpLink);
                } else {
                    arpCell.textContent = ""; 
                }
          row.insertCell().textContent = airfield.TWR || "";
          row.insertCell().textContent = airfield.ILS || "";
          row.insertCell().textContent = airfield.TACAN || "";
          row.insertCell().textContent = airfield.RWY || "";

        });

      airfieldDetails.appendChild(table);
      sortTable(table, 0);
      sortTable(table, 0);
    })
    .catch(error => console.error(`Error loading data for terrain ${terrainId}:`, error));
}

// END AIRFIELD CATEGORY FETCH //////////////////////////////////

function sortTable(table, columnIndex) {
  // Get all the rows in the table body (excluding the header row)
  const dataRows = Array.from(table.querySelectorAll('tbody tr'));

  // Determine the sorting direction (toggle between ascending and descending)
  let sortDirection = 'asc'; // Default to ascending
  const currentSortButton = table.querySelector(`th:nth-child(${columnIndex + 1}) button`);
  if (currentSortButton.textContent === '▲') {
    sortDirection = 'desc';
    currentSortButton.textContent = '▼';
  } else {
    currentSortButton.textContent = '▲';
  }

  // Sort the rows based on the data in the specified column
  dataRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();   


    // Handle different data types (you might need to customize this based on your data)
    if (!isNaN(cellA) && !isNaN(cellB)) { // If both are numbers, compare numerically
      return sortDirection === 'asc' ? cellA - cellB : cellB - cellA;
    } else { // Otherwise, compare as strings (case-insensitive)
      return sortDirection === 'asc' 
        ? cellA.localeCompare(cellB, undefined, { sensitivity: 'base' }) 
        : cellB.localeCompare(cellA, undefined, { sensitivity: 'base' });
    }
  });

  // Clear the table body 
  const tbody = table.querySelector('tbody');

  // Re-append the sorted DATA rows
  dataRows.forEach(row => tbody.appendChild(row));
}



function changeTab(tabId, aircraftId) {

  // 1. Hide all tab content 
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

  // 2. Show the selected tab
  const contentDiv = document.getElementById(tabId);
  contentDiv.style.display = 'block';

  // 3. Deactivate all tab buttons and activate the selected one
  document.querySelectorAll('#tab-buttons button').forEach(button => button.classList.remove('active'));
  let buttons = document.querySelectorAll(`#tab-buttons button`);
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase() == tabId) {
      buttons[i].classList.add("active");
      break;
    }
  }
/*

  // 4. Check if checklist type buttons have been loaded, only for checklist tab
  if (!contentDiv.querySelector('#checklist-options') && tabId === 'checklist') {
    // Create the checklist-content div and day/night buttons 
    const checklistContentDiv = document.createElement('div');
    checklistContentDiv.id = 'checklist-content';

    const checklistOptions = document.createElement('div');
    checklistOptions.id = 'checklist-options';

    // Call loadChecklistTypes here, after the checklistOptionsDiv is created
    loadChecklistTypes(aircraftId);

    // Append buttons, line break, then the checklist content
    contentDiv.appendChild(checklistOptions);
    contentDiv.appendChild(document.createElement('br'));
    contentDiv.appendChild(checklistContentDiv);
  } 
*/
  // 7. Handle image display on buttons within the newly loaded content
  const locationButtons = contentDiv.querySelectorAll('.location-btn');
  locationButtons.forEach(button => {
    button.addEventListener('click', () => showImage(button));
  });

}



function toggleChecklist(header) {
    const content = header.nextElementSibling;
    if (content) {
        content.style.display = (content.style.display === "none") ? "block" : "none";
    }
}



function checkCategoryCompletion(collapsibleHeader) {
  const checkboxes = collapsibleHeader.nextElementSibling.querySelectorAll('input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  if (allChecked)   
 {
    collapsibleHeader.style.backgroundColor = '#4C784C';
    collapsibleHeader.nextElementSibling.style.display = 'none'; // Collapse the current category

    // Find and open the next collapsible category
    let nextCollapsible = collapsibleHeader.nextElementSibling.nextElementSibling; // Skip the content div
    while (nextCollapsible && !nextCollapsible.classList.contains('collapsible')) {
      nextCollapsible = nextCollapsible.nextElementSibling;
    }
    if (nextCollapsible) {
      nextCollapsible.nextElementSibling.style.display = 'block'; // Open the next category's content
    }
  } else {
    collapsibleHeader.style.backgroundColor = '#777';
  }
}

function checkEmergency(collapsibleHeader) {
    const checkboxes = collapsibleHeader.nextElementSibling.querySelectorAll('input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked); // Check if any are checked

    if (anyChecked) {
        collapsibleHeader.style.backgroundColor = 'darkred'; // Dark red
    } else {
        collapsibleHeader.style.backgroundColor = '#777'; // Reset to default color
    }
}


function showImage(button) {
  const imgId = button.dataset.img;

  // Get locationText and requirementText, handling potential nulls
  const locationText = button.textContent?.trim() || ""; 
  const previousTd = button.closest('td')?.previousSibling;
  const requirementText = previousTd?.textContent?.trim() || "";

  const uniqueImgId = imgId + "_" + button.id + "_" + locationText + "_" + requirementText;


    const img = document.getElementById(uniqueImgId);

    if (img) {
        // Toggle the image between full size and hidden.
        if (img.style.maxWidth === "100%") {
            img.style.maxWidth = "0"; // Hide by setting maxWidth to 0
            img.style.maxHeight = "0"; 
        } else {
            img.style.maxWidth = "100%"; // Show by setting maxWidth to 100%
            img.style.maxHeight = "100%";
        }
    } else {
        const newImg = document.createElement('img');
        newImg.src = imgId;
        newImg.alt = "Image";
        newImg.id = uniqueImgId;

        // Initial styles for maximum size and aspect ratio preservation
        newImg.style.maxWidth = "100%";  
        newImg.style.maxHeight = "100%"; 
        
        button.insertAdjacentElement('afterend', newImg);
    }
}


// drawing mode //////////////

const textArea = document.getElementById("text-area");
const drawingArea = document.getElementById("drawing-area");

let isDrawing = false; // Track if the mouse is currently drawing
let currentPath;

function clearnotepadText() {
  textArea.innerHTML = ""; 
}

function clearnotepadDrawing() {
  drawingArea.innerHTML = ""; // Clear the drawing area (remove the SVG)
}

// Attach event listeners to the drawingArea
drawingArea.addEventListener("mousedown", startDrawing);
drawingArea.addEventListener("mousemove", draw);
drawingArea.addEventListener("mouseup", stopDrawing);
drawingArea.addEventListener("mouseleave", stopDrawing);
drawingArea.addEventListener("touchstart", handleTouchStart, false);
drawingArea.addEventListener("touchmove", handleTouchMove, false);
drawingArea.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(e) {
    e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    const touch = e.touches[0]; // Get the first touch point
    const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    drawingArea.dispatchEvent(mouseEvent); // Trigger a mousedown event
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    drawingArea.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    drawingArea.dispatchEvent(mouseEvent);
}


function startDrawing(e) {
  isDrawing = true;

  // Create the SVG element if it doesn't exist
  let svg = drawingArea.querySelector('svg');
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    drawingArea.appendChild(svg);
  }

  currentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  currentPath.setAttribute("fill", "none");
  currentPath.setAttribute("stroke",   
 "black");
  currentPath.setAttribute("stroke-width", "5");

  const strokeColor = document.body.classList.contains('dark-mode') ? 'white' : 'black'; 
  currentPath.setAttribute("stroke", strokeColor);

  let point = getPoint(e);
  currentPath.setAttribute("d", `M ${point.x} ${point.y}`);

  svg.appendChild(currentPath);
}

function draw(e) {
  if (!isDrawing || !currentPath) return;

  e.preventDefault();
  let point = getPoint(e);
  currentPath.setAttribute("d", currentPath.getAttribute("d") + ` L ${point.x} ${point.y}`);
}

function stopDrawing() {
  isDrawing = false;
  currentPath = null;
}

function getPoint(e) {
  let rect = drawingArea.getBoundingClientRect();
  let x = e.clientX;
  let y = e.clientY;
  return { x: x - rect.left, y: y - rect.top };
}



// event listeners

document.getElementById('airfields').addEventListener('click', function(event) {
    if (event.target.classList.contains('airfield-btn')) {
        showImage(event.target);
    }
});

// Add an event listener to the document to handle clicks on the buttons
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('location-btn')) {
        showImage(event.target);
    }
});

