function loadAircraft(aircraftId) {

    // 1. Hide the main page and show the aircraft content section
    document.querySelector('.main-page').style.display = 'none';
    document.getElementById('aircraft-content').style.display = 'block';

    // 2. Dynamically generate tab buttons
    const tabButtons = document.getElementById("tab-buttons");
    tabButtons.innerHTML = ""; 

    Object.keys(aircraftData[aircraftId]).forEach(tabId => {
        const button = document.createElement('button');
        button.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        button.onclick = () => changeTab(tabId, aircraftId);
        tabButtons.appendChild(button);
    });

    // 3. Construct the image path based on the aircraftId
    const imagePath = `aircraft/${aircraftId}.jpg`;

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


function loadAllContent(aircraftId) {

    changeTab('checklist', aircraftId); 
    loadChecklistTypes(aircraftId);
    loadEmergencyProcedures(aircraftData[aircraftId].emergency); 
    loadReferenceContent();
}


// START LOAD CHECKLIST ///////////////////////////////////////////////////

function loadChecklistTypes(aircraftId) {
    const checklistOptionsDiv = document.getElementById('checklist-options');
    //checklistOptionsDiv.innerHTML = ''; // Clear any previous buttons

    fetch(`checklist/${aircraftId}.json`)
        .then(response => response.json())
        .then(data => {
            const checklistTypes = data.checklists;

            checklistTypes.forEach(type => {
                const button = document.createElement('button');
                button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                button.onclick = () => loadChecklistType(type, aircraftId);
                checklistOptionsDiv.appendChild(button);
            });
        })
        .catch(error => console.error(`Error loading checklist data for ${aircraftId}:`, error));
}

function loadChecklistType(type, aircraftId) {
    fetch(`checklist/${aircraftId}/${type}.json`)
        .then(response => response.json())
        .then(checklistData => {
            const checklistContentDiv = document.getElementById("checklist-content");
            checklistContentDiv.innerHTML = ""; // Clear previous checklist content

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
                        if (item.locationImage) {
                            const locationBtn = document.createElement('button');
                            locationBtn.className = "location-btn";
                            locationBtn.dataset.img = `checklist/${aircraftId}/${item.locationImage}`;
                            locationBtn.textContent = item.locationText || "";
                            locationCell.appendChild(locationBtn);
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



function loadEmergencyProcedures(emergencyProceduresData) {
  const emergencyDiv = document.getElementById("emergency");
  emergencyDiv.innerHTML = ""; // Clear previous content

  emergencyProceduresData.forEach(category => {



    if (category.type === 'category') {
      // Create a main category header (always visible) and center it
      const categoryHeader = document.createElement('h3');
      categoryHeader.textContent = category.title;
      categoryHeader.style.textAlign = 'center'; // Center the text using JavaScript
      emergencyDiv.appendChild(categoryHeader);
    } else {
      // Create a collapsible section for emergency procedures
      const collapsible = document.createElement('div');
      collapsible.className = "collapsible";
      collapsible.textContent = category.title;

      const content = document.createElement('div');
      content.className = "checklistcontent";
      content.style.display = "none";

      const table = document.createElement('table');
      const headerRow = table.insertRow();
      ["", "Condition", "Action", "Location"].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Declare itemData outside the loop
      let itemData; 

      category.items.forEach(item => {
        // Parse the item data within the loop
        itemData = JSON.parse(JSON.stringify(item)); // Create a deep copy

        const row = table.insertRow();

        if (itemData.type === 'item') {
          // Add a checkbox cell
          row.insertCell().innerHTML = '<input type="checkbox">';

          row.insertCell().textContent = itemData.condition;
          row.insertCell().textContent = itemData.action;

          const locationCell = row.insertCell();
          if (itemData.locationImage) {
            const locationBtn = document.createElement('button');
            locationBtn.className = "location-btn";
            locationBtn.dataset.img = itemData.locationImage;
            locationBtn.textContent = itemData.locationText || "";
            locationCell.appendChild(locationBtn);
          } else {
            locationCell.textContent = "";
          }
        } else if (itemData.type === 'note') {
          const noteCell = row.insertCell();
          noteCell.colSpan = 4; 
          noteCell.textContent = itemData.text;
          noteCell.classList.add('note-cell'); 
        }
      });

      content.appendChild(table);

      collapsible.addEventListener('click', () => {
        content.style.display = (content.style.display === "none") ? "block" : "none";
      });

      emergencyDiv.appendChild(collapsible);
      emergencyDiv.appendChild(content);
    }
  });
}



// START REFERENCE CATEGORY FETCH /////////////////////////////////


function loadReferenceContent() {
  const referenceTab = document.getElementById("reference");
  referenceTab.innerHTML = ""; 

  getReferenceCategories() 
    .then(categories => { 
      if (Array.isArray(categories)) {
        categories.forEach(category => {
          loadReferenceCategory(category);
        });
      } else {
        console.error('Error: getReferenceCategories did not return an array.');
        // Handle the error gracefully, perhaps display a message to the user
      }
    })
    .catch(error => console.error('Error fetching reference categories:', error));
}

function getReferenceCategories() {
  return fetch('reference/reference_categories.json') 
    .then(response => response.json())
    .then(data => {
      return data.categories; 
    })
    .catch(error => console.error('Error fetching reference categories:', error));
}


// Function to load data for a specific reference category
function loadReferenceCategory(category) {
  const referenceTab = document.getElementById("reference");

  fetch(`reference/${category}/${category}.json`)
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

// Function to create the reference table dynamically
function createReferenceTable(categoryData, categoryName) {
  const tableContainer = document.createElement('div'); 

  for (const category in categoryData) {
    const itemsData = categoryData[category];

    // Check if itemsData is valid
    if (!itemsData || itemsData.length === 0) {
      console.error(`Error: Invalid or empty data for category ${category}`);
      continue;
    }

    // Create a collapsible section for each category
    const collapsible = document.createElement('div');
    collapsible.className = "collapsible";

    // Check if it's a main category or a subcategory
    if (category === categoryName) {
      // Main category - no indentation
      collapsible.textContent = category;
    } else {
      // Subcategory - add indentation and lighter background
      const indentedTitle = document.createElement('span');
      indentedTitle.textContent = category;
      indentedTitle.style.marginLeft = '20px'; 
      collapsible.appendChild(indentedTitle);
      collapsible.style.backgroundColor = '#999'; 
      collapsible.classList.add('subcategory'); 
    }

    const content = document.createElement('div');
    content.className = "checklist-content";
    content.style.display = "none";

    const table = document.createElement('table');

    // Find the first item to determine headers (no need to check for 'note' type)
    const firstItem = itemsData[0];
    const headers = Object.keys(firstItem).filter(header => header !== 'type' && header !== 'locationText');

    // Create table header row
    const headerRow = table.insertRow();
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.replace(/_/g, ' ');
      headerRow.appendChild(th);
    });

    // Populate the table rows
    itemsData.forEach(item => {
      const row = table.insertRow();
      headers.forEach(header => {
        const cell = row.insertCell();

        // Create a content wrapper div within the cell
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


const aircraftData = {
    'a10': {
        checklist: [],
        airfields: [], // (Add airfield data if available)
    	reference: [], // or any other relevant reference data
    	notepad: "" // You might want to initialize this with some default text or keep it empty
    },
'f-16c': {
	checklist: [],
        emergency: [], // (Your existing emergency procedures)
        airfields: [], // (Add airfield data if available)
    	reference: [], // or any other relevant reference data
    	notepad: [], // You might want to initialize this with some default text or keep it empty
    },
};


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
  } else if (contentDiv.innerHTML === '' && tabId !== 'checklist' && tabId !== 'reference') { 
    // 5. Check if aircraft data exists for the specific tab (except for notepad and reference)
    if (!aircraftData[aircraftId] || !aircraftData[aircraftId][tabId]) {
      console.error(`Error: Data not found for aircraft ID: ${aircraftId} and tab: ${tabId}`);
      contentDiv.innerHTML = "Data not available for this aircraft and tab.";
      return;
    }

    // 6. Load content dynamically based on the tab and aircraft
    switch (tabId) {
      case 'emergency':
        contentDiv.innerHTML = aircraftData[aircraftId].emergency;
        break;
      case 'airfields':
        showAirfield('georgia'); 
        break;
      case 'notepad':
        // ... (You might want to add logic here to handle the notepad content)
        break;
    }
  }

  // 7. Handle image display on buttons within the newly loaded content
  const locationButtons = contentDiv.querySelectorAll('.location-btn');
  locationButtons.forEach(button => {
    button.addEventListener('click', () => showImage(button));
  });

  const airfieldButtons = contentDiv.querySelectorAll('.airfield-btn');
  airfieldButtons.forEach(button => {
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
        collapsibleHeader.style.backgroundColor = '#4C784C '; // dark green
    } else {
        collapsibleHeader.style.backgroundColor = '#777'; // Reset to default color
    }
}

function showAirfield(terrainId) {
  const airfieldDetails = document.getElementById("airfield-details");
  airfieldDetails.innerHTML = ""; 

  // Load terrain image
  const terrainImagePath = `terrain/${terrainId}/${terrainId}.png` 
  const terrainImage = document.createElement('img');
  terrainImage.src = terrainImagePath;
  terrainImage.alt = terrainId;
  terrainImage.style.maxWidth = '100%';
  terrainImage.style.height = 'auto';
  airfieldDetails.appendChild(terrainImage);

  // Create the table dynamically
  const table = document.createElement('table');
  const headerRow = table.insertRow();
  ["AIRFIELD", "ICAO", "REFERENCE", "TOWER", "ILS (runway, freq)", "TACAN"].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  // Load airfield data for the selected terrain (you'll need to define this)
  const airfieldsData = getAirfieldsDataForTerrain(terrainId);

  airfieldsData.forEach(airfield => {
    const row = table.insertRow();
    
    // Airfield Name (with image button if available)
    const airfieldNameCell = row.insertCell();
    if (airfield.image) {
      const airfieldBtn = document.createElement('button');
      airfieldBtn.className = "airfield-btn";
      airfieldBtn.dataset.img = `terrain/${terrainId}/airfields/${airfield.image}`;
      airfieldBtn.textContent = airfield.name;
      airfieldNameCell.appendChild(airfieldBtn);
    } else {
      airfieldNameCell.textContent = airfield.name;
    }

    // Other Airfield Data
    row.insertCell().textContent = airfield.icao || "";
    row.insertCell().textContent = airfield.reference || "";
    row.insertCell().textContent = airfield.tower || "";
    row.insertCell().textContent = airfield.ils || "";
    row.insertCell().textContent = airfield.tacan || "";
  });

  airfieldDetails.appendChild(table);
}

function getAirfieldsDataForTerrain(terrainId) {
  // Example data structure (replace with your actual data)
  const airfieldsData = {
    georgia: [
      { name: "Anapa", icao: "URKA", reference: "44°59′36″N, 37°20′19″E", tower: "121.0MHz", image: "anapa.png" },
      { name: "Batumi", icao: "UGSB", reference: "41°36′58″N, 41°35′31″E", tower: "131.0MHz", ils: "13, 110.3MHz", tacan: "16XBTM" },
      { name: "Beslan", icao: "URMO", reference: "43°12′26″N, 44°35′19″E", tower: "141.0MHz" },
      { name: "Gelendzhik", icao: "URKG", reference: "44°33′54″N, 38°00′25″E", tower: "126.0MHz" },
      { name: "Gudauta", icao: "UG23", reference: "43°06′09″N, 40°34′01″E", tower: "130.0MHz", image: "gudauta.png" },
      { name: "Kobuleti", icao: "UG5X", reference: "41°55′36″N, 41°51′05″E", tower: "133.0MHz", ils: "07, 111.5MHz", tacan: "67XKBL" },
      { name: "Kopitnari-Kutaisi", icao: "UGKO", reference: "42°10′30″N, 42°28′05″E", tower: "134.0MHz", ils: "08, 109.75MHz", tacan: "44XKTS" },
      { name: "Krasnodar Center", icao: "URKI", reference: "45°05′03″N, 38°57′34″E", tower: "122.0MHz" },
      { name: "Krasnodar-Pashkovskty", icao: "URKK", reference: "45°01′52″N, 39°08′38″E", tower: "128.0MHz" },
      { name: "Krymsk", icao: "URKW", reference: "44°58′27″N, 38°00′37″E", tower: "124.0MHz" },
      { name: "Maykop-Khanskaya", icao: "URKH", reference: "44°41′22″N, 40°03′08″E", tower: "125.0MHz" },
      { name: "Mineralnye Vody", icao: "URMM", reference: "44°12′58″N, 43°06′13″E", tower: "135.0MHz", ils: "12, 111.7MHz<br>30, 109.3MHz" },
      { name: "Mozdok", icao: "XRMF", reference: "43°47′26″N, 44°34′44″E", tower: "137.0MHz" },
      { name: "Nalchik", icao: "URMN", reference: "43°30′29″N, 43°37′30″E", tower: "136.0MHz", ils: "24, 110.5MHz" },
      { name: "Novorossiysk", icao: "URKN", reference: "44°39′36″N, 37°46′25″E", tower: "123.0MHz" },
      { name: "Senaki-Tskhakaya", icao: "UGKS", reference: "42°14′31″N, 42°02′08″E", tower: "132.0MHz", ils: "09, 108.90MHz", tacan: "31XTSK" },
      { name: "Sochi-Adler", icao: "URSS", reference: "43°06′17″N, 40°35′26″E", tower: "127.0MHz", ils: "06, 111.1MHz" },
      { name: "Soganlug", icao: "UG24", reference: "41°39′26″N, 44°55′48″E", tower: "139.0MHz" },
      { name: "Sukhumi", icao: "UGSS", reference: "42°51′21″N, 41°09′17″E", tower: "129.0MHz" },
      { name: "Tbilisi", icao: "UGTB", reference: "41°40′37″N, 44°56′37″E", tower: "138.0MHz", ils: "13, 110.3MHz<br>31, 108.9MHz" },
      { name: "Vaziani", icao: "UG27", reference: "41°37′09″N, 45°02′10″E", tower: "140.0MHz", ils: "14, 108.75MHz", tacan: "22XVAS" },
      { name: "Banodzha", reference: "42°15′54″N, 42°39′24″E" },
      { name: "Kvitiri", reference: "42°14′53″N, 42°37′50″E" },
      { name: "Ochkhamuri", reference: "41°50′17″N, 41°48′02″E" }
    ],
    marianas: [
       { name: "Saipan INTL", icao: "PGSN" },
    ]
  };

  return airfieldsData[terrainId] || []; // Return data for the terrain, or an empty array if not found
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
//drawingArea.addEventListener("mousedown", startDrawing);
//drawingArea.addEventListener("mousemove", draw);
//drawingArea.addEventListener("mouseup", stopDrawing);
//drawingArea.addEventListener("mouseleave", stopDrawing);
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

