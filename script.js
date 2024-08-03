function loadAircraft(aircraftId) {
  // 1. Hide the main page and show the aircraft content section
  document.querySelector('.main-page').style.display = 'none';
  const aircraftContent = document.getElementById('aircraft-content');
  aircraftContent.style.display = 'block';

  // 2. Check if aircraft data exists
  if (!aircraftData[aircraftId]) {
    // Display "no data" message
  aircraftContent.innerHTML = `
    <div class="no-data-message"> 
      <p>No data available for this aircraft.</p> 
      <button onclick="location.reload()">Refresh to return to main menu</button>
    </div>
  `;
    return; // Stop further execution
  }

  // 3. Dynamically generate tab buttons (only if data exists)
  const tabButtons = document.getElementById("tab-buttons");
  tabButtons.innerHTML = ""; 


  const imagePath = `aircraft/${aircraftId}.jpg`;

  // 4. Create and display the aircraft image next to the checklist
 const img = document.createElement('img');
    img.src = imagePath;
    img.alt = aircraftId; 
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.float = 'left'; 
    img.style.marginRight = '10px'; 
    img.title = aircraftId; 

  const aircraftNameButton = document.createElement('button');
  aircraftNameButton.textContent = aircraftId.toUpperCase(); // Convert to uppercase
  aircraftNameButton.classList.add('aircraft-name-button'); 

  // Append the image and the name button to tabButtons
  tabButtons.appendChild(img); 
  tabButtons.appendChild(aircraftNameButton);

  const spacer = document.createElement('div');
  spacer.style.width = '5px'; // Adjust the width as needed
  spacer.style.display = 'inline-block'; // Make it an inline-block element
  tabButtons.appendChild(spacer);

  Object.keys(aircraftData[aircraftId]).forEach(tabId => {
    const button = document.createElement('button');
    button.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    button.onclick = () => changeTab(tabId, aircraftId); 
    tabButtons.appendChild(button);
  });

  // 3. Construct the image path based on the aircraftId


  // 5. Trigger the loading of the initial tab content (e.g., 'checklist')
  //changeTab('checklist', aircraftId); 
}



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
      content.className = "checklist-content";
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









const rwrThreatsContent = `
<div class="collapsible" onclick="toggleChecklist(this)">RWR Threats</div>
            <div class="checklist-content" style="display: none;">

    <table>
        <tr><th>GENERAL</th></tr>
        <tr><th>RWR</th><th></th> <th>NAME</th><th>CODE</th><th>MAX<br>RANGE</th> <th>MAX ALT</th> <th>ECM</th> <th>TYPE</th></tr>
        <tr><td>3</td><td><img src="reference/rwr/neva.jpg" alt="Neva"></td><td>Neva</td><td>SA-3</td><td>19 nm</td><td>59'000 ft</td><td>SAM 1</td><td></td></tr>
        <tr><td>6</td><td><img src="reference/rwr/kub.jpg" alt="Kub"></td><td>Kub</td><td>SA-6</td><td>13 nm</td><td>46'000 ft</td><td>SAM 1</td><td></td></tr>
        <tr><td>8</td><td><img src="reference/rwr/osa.jpg" alt="Osa"></td><td>Osa</td><td>SA-8</td><td>5.4 nm</td><td>16'400 ft</td><td>SAM 1</td><td></td></tr>
        <tr><td>10</td><td><img src="reference/rwr/s-300.jpg" alt="S-300"></td><td>S-300</td><td>SA-10</td><td>25 nm</td><td>98'425 ft</td><td>SAM 2</td><td></td></tr>
        <tr><td>11</td><td><img src="reference/rwr/buk.jpg" alt="Buk"></td><td>Buk</td><td>SA-11/17</td><td>17.3 nm</td><td>72'178 ft</td><td>SAM 2</td><td></td></tr>
        <tr><td>15</td><td><img src="reference/rwr/tor.jpg" alt="Tor"></td><td>Tor</td><td>SA-15</td><td>6.5 nm</td><td>19'685 ft</td><td>SAM 2</td><td></td></tr>
        <tr><td>S6</td><td><img src="reference/rwr/tunguska.jpg" alt="Tunguska"></td><td>Tunguska</td><td>SA-19</td><td>4.32 nm</td><td>19'685 ft</td><td>SAM 2</td><td></td></tr>
        <tr><td>A</td><td><img src="reference/rwr/shilka.jpg" alt="Shilka"></td><td>Shilka</td><td></td><td>1.35 nm</td><td>8'200 ft</td><td>AAA</td><td></td></tr>
        <tr><td>SD</td><td><img src="reference/rwr/buk_tar.jpg" alt="Buk TAR"></td><td>Buk TAR</td><td>SA-11/17</td><td>46 nm</td><td></td><td></td><td>SAM 2<br>Target Acquisition Radar</td></tr>
        <tr><td>DE</td><td><img src="reference/rwr/sborka.jpg" alt="Sborka"></td><td>Sborka</td><td></td><td>19 nm</td><td></td><td></td><td>Radar Command Centre</td></tr>
        <tr><td>10</td><td><img src="reference/rwr/s-300tel.jpg" alt="S-300"></td><td>S-300</td><td>SA-10</td><td>162 nm</td><td></td><td></td><td>SAM 2<br>Tracking Radar</td></tr>
        <tr><td>BB</td><td><img src="reference/rwr/s-300er.jpg" alt="S-300"></td><td>S-300</td><td>SA-10</td><td>162 nm</td><td></td><td></td><td>SAM 2<br>Surveillance Radar</td></tr>
        <tr><td>CS</td><td><img src="reference/rwr/s-300laar.jpg" alt="S-300"></td><td>S-300</td><td>SA-10</td><td>65 nm</td><td></td><td></td><td>SAM 2<br>Search Radar</td></tr>
        <tr><td>EW</td><td><img src="reference/rwr/nebo.jpg" alt="Nebo"></td><td>Nebo</td><td>SA-10</td><td>178 nm</td><td></td><td></td><td>SAM 2<br>Target Acquisition Radar</td></tr>
    </table>

    <table>
        <tr><th>INFRARED</th></tr>
        <tr><th>RWR</th><th></th> <th>TYPE</th><th>CODE</th><th>MAX RANGE</th><th>MAX ALT</th><th>ECM</th><th>TYPE</th></tr>
        <tr><td>9</td><td><img src="reference/rwr/strela-1.jpg" alt="Strela-1"></td><td>Strela-1</td><td>SA-9</td><td>2.3 nm</td><td>11'500 ft</td><td></td><td></td></tr>
        <tr><td>13</td><td><img src="reference/rwr/strela-10.jpg" alt="Strela-10"></td><td>Strela-10</td><td>SA-13</td><td>2.7 nm</td><td>11'500 ft</td><td></td><td></td></tr>
        <tr><td></td><td><img src="reference/rwr/igla.jpg" alt="Igla"></td><td>Igla</td><td>SA-18</td><td>2.8 nm</td><td>11'000 ft</td><td></td><td></td></tr>
    </table>

    <table>
        <tr><th>ANTI AIRCRAFT ARTILLERY</th></tr>
        <tr><th>RWR</th><th></th> <th>TYPE</th><th>CODE</th><th>MAX RANGE</th><th>MAX ALT</th><th>ECM</th><th>TYPE</th></tr>
        <tr><td></td><td><img src="reference/rwr/zu-23.jpg" alt="zu-23"></td><td>Zu-23</td><td></td><td>1.35 nm</td><td>6'561 ft</td><td></td><td></td></tr>
    </table>
</div> 
`; 

// Ordnance Content (new table)
const ordnanceContent = `
<div class="collapsible" onclick="toggleChecklist(this)">Ordnance</div>
            <div class="checklist-content" style="display: none;">
    <table>
        <tr>
            <th>Air to Air</th>
            <th>Weight</th>
            <th>Speed</th>
            <th>Guidance</th>
            <th>Aspect</th>
            <th>Range</th>
            <th>Warhead</th>
        </tr>
        <tr> <td>AIM-9B</td> <td>75 kg</td> <td>Ma 2</td> <td>Infrared</td> <td>Rear-Aspect</td> <td>11 km</td> <td>11 kg</td> </tr>
        <tr> <td>AIM-9L</td> <td>85 kg</td> <td>Ma 2</td> <td>Infrared</td> <td>All-Aspect</td> <td>11 km</td> <td>9.4 kg</td> </tr>
        <tr> <td>AIM-9M</td> <td>85.5 kg</td> <td>Ma 2.5</td> <td>Infrared</td> <td>All-Aspect</td> <td>18 km</td> <td>11 kg</td> </tr>
        <tr> <td>AIM-9P</td> <td>85.5 kg</td> <td>Ma 2</td> <td>Infrared</td> <td>Rear-Aspect</td> <td>11 km</td> <td>11 kg</td> </tr>
        <tr> <td>AIM-9P5</td> <td>85.5 kg</td> <td>Ma 2</td> <td>Infrared</td> <td>All-Aspect</td> <td>11 km</td> <td>11 kg</td> </tr>
        <tr> <td>AIM-9X</td> <td>85 kg</td> <td>Ma 2.5</td> <td>Infrared with Imaging</td> <td>HOBS</td> <td>18 km</td> <td>9.4 kg</td> </tr>
    </table>

    <table>
        <tr>
            <th>Air to Ground</th>
            <th>Weight</th>
            <th>Speed</th>
            <th>Guidance</th>
            <th>Aspect</th>
            <th>Range</th>
            <th>Warhead</th>
        </tr>
        <tr> <td>AGM-65B</td> <td>220 kg</td> <td>Max Mach 0.85</td> <td>Electro-Optical TV</td> <td>N/A</td> <td>km: 27, effective 8-16</td> <td>57 kg Shaped Charge</td> </tr>
        <tr> <td>AGM-65D</td> <td>220 kg</td> <td>Max Mach 0.85</td> <td>Infrared Imaging</td> <td>N/A</td> <td>km: 27, effective 8-16</td> <td>57 kg Shaped Charge</td> </tr>
        <tr> <td>AGM-65E</td> <td>293 kg</td> <td>Max Mach 0.85</td> <td>Semi-Active Laser</td> <td>N/A</td> <td>km: 27, effective 8-16</td> <td>136 kg Penetrating Blast Fragmentation</td> </tr>
        <tr> <td>AGM-65F</td> <td>306 kg</td> <td>Max Mach 0.85</td> <td>Infrared Imaging</td> <td>N/A</td> <td>km: 25, effective 9</td> <td>136 kg Penetrating Blast Fragmentation</td> </tr>
        <tr> <td>AGM-65G</td> <td>304 kg</td> <td>Max Mach 0.85</td> <td>Infrared Imaging</td> <td>N/A</td> <td>km: 27, effective 5-12</td> <td>136 kg Penetrating Blast Fragmentation</td> </tr>
        <tr> <td>AGM-65H</td> <td>304 kg</td> <td>Max Mach 0.85</td> <td>Electro-Optical TV</td> <td>N/A</td> <td>km: 27, effective 5-12</td> <td>56 kg Shaped Charge</td> </tr>
        <tr> <td>AGM-65K</td> <td>210 kg</td> <td>Max Mach 0.85</td> <td>Electro-Optical TV</td> <td>N/A</td> <td>km: 27, effective 5-10</td> <td>57 kg Shaped Charge</td> </tr>
    </table>

</div>
`;


const aircraftData = {
    a10: {
        checklist: {
            day: [
                {
                    title: "Launch Cockpit Setup",
                    items: [
                        { type: "item", requirement: "Armament safety override switch", action: "SAFE (Guard down)", locationImage: "la.png", locationText: "LA1" },
                        { type: "item", requirement: "Utility light", action: "Stowed", locationImage: "la.png", locationText: "LA2" },
                        { type: "item", requirement: "Intercom controls", action: "Set", locationImage: "la.png", locationText: "LA3" },
                        { type: "item", requirement: "Oxygen regulator", action: "NORMAL", locationImage: "la.png", locationText: "LA4" },
                        { type: "item", requirement: "Anti-G suit", action: "Connected and adjusted", locationImage: "la.png", locationText: "LA5" },
                        { type: "item", requirement: "Seat and harness", action: "Adjusted, locked", locationImage: "la.png", locationText: "LA6" },
			{ type: "note", text: "NOTE: Normal brakes will be available if the engine is started first." },
                        { type: "item", requirement: "Canopy", action: "Closed and locked", locationImage: "la.png", locationText: "LA7" },
                        { type: "item", requirement: "Ejection seat safety pin", action: "Installed", locationImage: "la.png", locationText: "LA8" }
                    ]
                },
                {
                    title: "Prior to Engine Start",
                    items: [
                        { type: "item", requirement: "Battery Switch", action: "PWR", locationImage: "lb.png", locationText: "LB5" },
                        { type: "item", requirement: "UHF controls", action: "ON/set", locationImage: "lb.png", locationText: "LB6" },
                        { type: "item", requirement: "Inverter Switch", action: "STBY", locationImage: "lb.png", locationText: "LB6" },
                        { type: "item", requirement: "Air source knob", action: "NORM", locationImage: "lb.png", locationText: "LB7" },
                        { type: "item", requirement: "Emergency jettison", action: "As required", locationImage: "lb.png", locationText: "LB8" },
                        { type: "item", requirement: "Speed brake", action: "DOWN", locationImage: "lb.png", locationText: "LB9" },
                        { type: "item", requirement: "Landing gear control handle", action: "DN", locationImage: "lb.png", locationText: "LB10" },
                        { type: "item", requirement: "Parking brake", action: "SET", locationImage: "lb.png", locationText: "LB11" }
                    ]
                },
                {
                    title: "Engine Start",
                    items: [
                        { type: "item", requirement: "Throttle", action: "OFF/IDLE", locationImage: "lc.png", locationText: "LC1" },
                        { type: "item", requirement: "Fuel shutoff lever", action: "OPEN", locationImage: "lc.png", locationText: "LC2" },
                        { type: "item", requirement: "Engine ignition switch", action: "BOTH", locationImage: "lc.png", locationText: "LC3" },
                        { type: "item", requirement: "Wait for N2 to indicate 10%", action: "Monitor", locationImage: "lc.png", locationText: "LC4" },
                        { type: "item", requirement: "Fuel boost pump", action: "ON", locationImage: "lc.png", locationText: "LC5" }
                    ]
                },
                {
                    title: "After Engine Start",
                    items: [
                       
                        { type: "item", requirement: "Generator switch", action: "ON", locationImage: "ld.png", locationText: "LD2" },
                        { type: "item", requirement: "Inverter switch", action: "ON", locationImage: "ld.png", locationText: "LD3" },
                        { type: "item", requirement: "Hydro pressure", action: "Check", locationImage: "ld.png", locationText: "LD4" },
                        { type: "item", requirement: "Bleed air switch", action: "ON", locationImage: "ld.png", locationText: "LD5" },
                        { type: "item", requirement: "Engine anti-ice", action: "As required", locationImage: "ld.png", locationText: "LD6" },
                        { type: "item", requirement: "Pitot heat", action: "ON", locationImage: "ld.png", locationText: "LD7" },
                        { type: "item", requirement: "Landing/Taxi lights", action: "As required", locationImage: "ld.png", locationText: "LD8" },
                        { type: "item", requirement: "Exterior lights", action: "As required", locationImage: "ld.png", locationText: "LD9" },
                        { type: "item", requirement: "Stabilator", action: "Check movement", locationImage: "ld.png", locationText: "LD10" },
                        { type: "item", requirement: "Flight controls", action: "Check", locationImage: "ld.png", locationText: "LD11" },
                        { type: "item", requirement: "Autopilot", action: "OFF", locationImage: "ld.png", locationText: "LD12" },
                        { type: "item", requirement: "Navigation", action: "Set", locationImage: "ld.png", locationText: "LD13" }
                    ]
                },
                {
                    title: "Taxi",
                    items: [
                        { type: "item", requirement: "Parking brake", action: "Release", locationImage: "le.png", locationText: "LE1" },
                        { type: "item", requirement: "Canopy defrost", action: "ON/AUTO", locationImage: "le.png", locationText: "LE2" },
                        { type: "item", requirement: "Nosewheel steering", action: "As required", locationImage: "le.png", locationText: "LE3" },
                        { type: "item", requirement: "Flight controls", action: "Check", locationImage: "le.png", locationText: "LE4" }
                        // ... (Add more taxi items)
                    ]
                },
                // ... (Add more checklist categories like Before Takeoff, Takeoff, Climb, etc.)
            ],
            night: [
                // ... (Add night checklist items similar to the day checklists)
            ]
        },

       emergency: [
            {
                type: "category", // Main category item
                title: "GENERAL"
            },
            {
                title: "APU FIRE",
                items: [
                    { type: "item", condition: "If the APU is operating", action: "Set the APU to OFF", locationImage: "ra1.img", locationText: "RA1" },
                    { type: "item", condition: "If the fire persists", action: "Pull the fire T-handle of the APU", locationImage: "ra2.img", locationText: "RA2" },
                    { type: "item", condition: "If the fire persists", action: "Press the fire discharge agent", locationImage: "ra3.img", locationText: "RA3" },
                    { type: "item", condition: "If the fire persists", action: "Land as soon as possible", locationImage: "ra3.img", locationText: "RA3" },
                ]
            },
            {
                type: "category", // Main category item
                title: "FLIGHT AND FLIGHT CONTROL EMERGENCIES"
            },
            {
                title: "Flap Asymmetry",
                items: [
                    { type: "item", condition: "If the flaps fail", action: "Re-select the flap position", locationImage: "ra1.img", locationText: "RA1" },
                    { type: "item", condition: "If the flaps fail", action: "Set flaps to MVR", locationImage: "", locationText: "" },
                    { type: "item", condition: "If the flaps fail", action: "Enable the FLAP EMER RETR", locationImage: "", locationText: "" },
                ]
            }
            // ... Add more emergency procedure categories as needed
        ],
        airfields: [], // (Add airfield data if available)
    	reference: rwrThreatsContent + ordnanceContent, // or any other relevant reference data
    	notepad: "" // You might want to initialize this with some default text or keep it empty
    },
		f16: {
  checklist: {
    day: [
      {
        title: "BEFORE START CHECKLIST",
        items: [
          { type: "item", requirement: "MAIN PWR", action: "BAT", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FLCS PWR TEST SW", action: "TEST/OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "MAIN PWR", action: "MAIN PWR", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EPU GEN/LGTS", action: "OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "CANOPY", action: "CLOSE/LOCK", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "PARKING BRAKE", action: "SET", locationImage: "la.jpg", locationText: "" }
        ]
      },
      {
        title: "START CHECKLIST",
        items: [
          { type: "item", requirement: "JFS SW", action: "START 2", locationImage: "la.jpg", locationText: "" },
          { type: "note", text: "NOTE: WHEN ENG 20% & SEC OFF" },
          { type: "item", requirement: "THROTTLE", action: "IDLE", locationImage: "la.jpg", locationText: "" },
          { type: "note", text: "NOTE: MONITOR ENGINE PARAMETERS" }
        ]
      },
      {
        title: "AFTER START CHECKLIST",
        items: [
          { type: "item", requirement: "JFS SW", action: "CHECK OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "OXYGEN", action: "NORMAL/NORM/ON-TRIM", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "PROBE HEAT SW", action: "PROBE HEAT", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "PROBE HEAT SW", action: "TEST", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "PROBE HEAT SW", action: "OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FIRE/OVERHEAT", action: "TEST", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "MALF & IND LGTS", action: "TEST", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "AVIONICS SWs", action: "ALL 6 ON", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "MIDS LVT", action: "ON", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EGI/INS", action: "ALIGN", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "C&I KNOB", action: "UFC", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "LDG GEAR", action: "DONW/3 GREEN", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "SPEEDBRAKES", action: "CHECK", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "ADI (SAI)", action: "UNCAGE", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "LEFT HDPT SW", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "RIGHT HDPT SW", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FCR SW", action: "FCR", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "RDR ALT SW", action: "RDR ALT", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "ENG SEC CTRL", action: "CHECK(SEC/PRI)", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FLCS", action: "CYCLE/CHECK", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FLCS BIT", action: "BIT/OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "FUEL QTY", action: "TEST/NORM", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "DIGITAL BKUP SW", action: "BACKUP/OFF", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "TRIM/AP DISC", action: "DISC", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "TRIM HAT SW", action: "TEST/NO MOTION", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "TRIM/AP DISC", action: "NORM", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "TRIM HAT SW", action: "TEST/MOTION", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "MPO", action: "TEST", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EPU", action: "TEST", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EPU/GEN TEST SW", action: "ON & SET", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EXT.LGTS", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "LSR CODE", action: "SET", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EWI/RWR/JMR", action: "ON", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "CONFIG", action: "CAT I/CAT III", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "BINGO", action: "SET", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "TACAN/ILS", action: "ON & SET", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "ALTIMETER", action: "SET", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "EGI/INS", action: "NAV", locationImage: "la.jpg", locationText: "" },
          { type: "item", requirement: "HYD/OIL PRESS OFF -NWS", action: "ON", locationImage: "la.jpg", locationText: "" }
        ]
      },
{
    title: "BEFORE TAKE OFF CHECKLIST",
    items: [
      { type: "item", requirement: "FLAPS", action: "NORMAL", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "TRIM NEEDLES", action: "CENTERED", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ENGINE CTRL", action: "PRI", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "SPEEDBRAKE", action: "CLOSED", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "FUEL PANEL", action: "NORMAL", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "OXYGEN", action: "ON", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "EJECTION SEAT", action: "ARMED", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "PROBE HEAT", action: "ON", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "RADAR", action: "ON", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "THROTTLE", action: "90%", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "BRAKES", action: "RELEASE", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "THROTTLE", action: "MIL or A.B.", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: At 70KT" },
      { type: "item", requirement: "NWS", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "note: AT VR-10KT (MILITARY PWR) OR VR-15KT (A.B. PWR)" },
      { type: "item", requirement: "PITCH", action: "8° TO 12°", locationImage: "la.jpg", locationText: "" }
    ]
  },
  {
    title: "AFTER TAKE OFF CHECKLIST",
    items: [
      { type: "note", text: "BEFORE 300KT" },
      { type: "item", requirement: "GEAR", action: "UP", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LIGHTS", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "PITCH", action: "15°", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: CLIMB WITH 350KT TO 10.000FT" },
      { type: "item", requirement: "RADAR", action: "ON & SET", locationImage: "la.jpg", locationText: "" }
    ]
  },
  {
    title: "ABOVE 10.000FT CHECKLIST",
    items: [
      { type: "item", requirement: "FUEL TRANSFER", action: "CHECK", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "SYSTEMS CHECK", action: "PERFORM", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "WEAPONS SYSTEMS", action: "SET", locationImage: "la.jpg", locationText: "" }
    ]
  },
  {
    title: "DESCEND/BEFORE LANDING CHECKLIST",
    items: [
      { type: "item", requirement: "FUEL", action: "CHECK", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "TACAN/ILS", action: "ON & SET", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ALT./RAD.ALT", action: "CHECK & SET", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MINIMUMS", action: "SET", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ATT REFERENCES", action: "CHECK", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "EXT. LGTS", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ANTI-ICE", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "TGP", action: "STOW", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MASTER ARM", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LASER", action: "OFF", locationImage: "la.jpg", locationText: "" }
    ]
  },
{
    title: "LANDING CHECKLIST",
    items: [
      { type: "note", text: "NOTE: PEEL OFF AT 1,500FT AGL/300KT" },
      { type: "item", requirement: "THROTTLE", action: "80%", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "SPEEDBRAKE", action: "OPEN", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: BRAKE WITH 70° BANK AND 3-4G" },
      { type: "note", text: "NOTE: DOWNWIND LEG" },
      { type: "item", requirement: "SPEED", action: "200-220KT", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LDG GEAR", action: "DOWN/3 GREEN", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LDG/TAXI LGT", action: "LANDING", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "AOA", action: "11°", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: BASE TURN" },
      { type: "item", requirement: "PITCH", action: "8° TO 10°", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "AOA", action: "11°", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: FINAL (ALWAYS FLY \"ON BRAKET\")" },
      { type: "item", requirement: "FLT PATH MARKER", action: "-2.5° TO -3°", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "AOA", action: "11°", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: SHORT FINAL" },
      { type: "item", requirement: "FLT PATH MKR", action: "AT 500FT RWY MARK", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MAX PITCH", action: "13°", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: LANDING ROLL" },
      { type: "item", requirement: "MAX PITCH", action: "13°", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "SPEEDBRAKE", action: "OPEN", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: USE AERODYNAMIC BRAKING DOWN TO 100KT" },
      { type: "item", requirement: "BRAKES", action: "MOD-HVY", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: AT 30KT" },
      { type: "item", requirement: "NWS", action: "ON", locationImage: "la.jpg", locationText: "" }
    ]
  },
  {
    title: "AFTER LANDING CHECKLIST",
    items: [
      { type: "item", requirement: "SPEEDBRAKE", action: "CLOSE", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "EJECTION SEAT", action: "SAFE", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "PROBE HEAT", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ECM PWR", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "-EW/RWR/JMR", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "IFF MASTER", action: "STBY", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LDG/TAXI LGT", action: "AS REQ.", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ARMAMENT SWs", action: "OFF/SAFE or NORMAL", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LH/RH HDPT, FCR, RAD. ALT", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "-AVIONICS", action: "ALL 6 OFF", locationImage: "la.jpg", locationText: "" }
    ]
  },
  {
    title: "SHUTDOWN CHECKLIST",
    items: [
      { type: "item", requirement: "LDG/TAXI LGT", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "PARKING BRAKE", action: "SET", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "HUD", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "ADI (SAI)", action: "CAGE", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "THROTTLE", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "-EPU GEN/PMG LGTS", action: "CHECK OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MIDS LVT", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "EGI/INS", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "EGINS LVT", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MAIN PWR", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "OXYGEN REG", action: "OFF & 100%", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "CANOPY", action: "OPEN", locationImage: "la.jpg", locationText: "" }
    ]
  },
{
    title: "REFUELING CHECKLIST",
    items: [
      { type: "item", requirement: "RADAR", action: "STBY", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MASTER ARM", action: "OFF", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LIGHTS", action: "STEADY BRT", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "VISOR", action: "DOWN", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "AIR REFUEL SW", action: "OPEN", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "RDY BLUE LGT", action: "CHECK", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: DURING REFUELING" },
      { type: "item", requirement: "AR GREEN LGT", action: "GREEN", locationImage: "la.jpg", locationText: "" },
      { type: "note", text: "NOTE: AFTER REFUELING" },
      { type: "item", requirement: "AIR REFUEL SW", action: "CLOSE", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "LIGHTS", action: "AS REQUIRED", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "VISOR", action: "AS DESIRED", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "RADAR", action: "ON", locationImage: "la.jpg", locationText: "" },
      { type: "item", requirement: "MASTER ARM", action: "AS REQUIRED", locationImage: "la.jpg", locationText: "" } 
      ]
                },
                // ... (Add more checklist categories like Before Takeoff, Takeoff, Climb, etc.)
            ],
            night: [
                // ... (Add night checklist items similar to the day checklists)
            ]
        },
        emergency: [], // (Your existing emergency procedures)
        airfields: [], // (Add airfield data if available)
    	reference: rwrThreatsContent + ordnanceContent, // or any other relevant reference data
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

  // 4. Check if content has already been loaded for this tab and aircraft
    if (!contentDiv.querySelector('#checklist-content') && tabId === 'checklist') { // Only for checklist tab
    // Create the checklist-content div and day/night buttons if they don't exist
    const checklistContentDiv = document.createElement('div');
    checklistContentDiv.id = 'checklist-content';

    const checklistOptions = document.createElement('div');
    checklistOptions.id = 'checklist-options';

    const dayButton = document.createElement('button');
    dayButton.textContent = 'Day Operations';
    dayButton.onclick = () => changeChecklistType('day', aircraftId);
    checklistOptions.appendChild(dayButton);

    const nightButton = document.createElement('button');
    nightButton.textContent = 'Night Operations';
    nightButton.onclick = () => changeChecklistType('night', aircraftId);
    checklistOptions.appendChild(nightButton);

    // Append buttons, line break, then the checklist content
    contentDiv.appendChild(checklistOptions);
    contentDiv.appendChild(document.createElement('br'));
    contentDiv.appendChild(checklistContentDiv);

    loadChecklist(aircraftData[aircraftId].checklist);
  } else { // Handle all other tabs, including notepad
    // 5. Check if aircraft data exists for the specific tab (except for notepad)
    if (tabId !== 'notepad' && (!aircraftData[aircraftId] || !aircraftData[aircraftId][tabId])) {
      console.error(`Error: Data not found for aircraft ID: ${aircraftId} and tab: ${tabId}`);
      contentDiv.innerHTML = "Data not available for this aircraft and tab.";
      return;
    }
  



    // 6. Load content dynamically based on the tab and aircraft
    switch (tabId) {
      case 'emergency':
        loadEmergencyProcedures(aircraftData[aircraftId].emergency);
        break;
      case 'airfields':
        break;
      case 'reference':
        loadReferenceContent();
        break;
        case 'notepad':
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



function loadReferenceContent() {
    const emergencyTab = document.getElementById("reference");
    emergencyTab.innerHTML = rwrThreatsContent + ordnanceContent;
}


let currentChecklistType = 'day'; // Default to day operations

function changeChecklistType(type, aircraftId) {
    currentChecklistType = type;
    loadChecklist(aircraftData[aircraftId].checklist); 
}

function loadChecklist(checklistsData) {
    const checklistContentDiv = document.getElementById("checklist-content");

    // Check if the element exists
    if (!checklistContentDiv) {
        console.error("Error: Element with ID 'checklist-content' not found.");
        return; 
    }

    checklistContentDiv.innerHTML = ""; // Clear previous content within the checklistContentDiv

    // Use the passed checklistsData to populate the checklists
    checklistsData[currentChecklistType].forEach(checklist => { 
        // Create the collapsible header element
        const collapsible = document.createElement('div');
        collapsible.className = "collapsible";
        collapsible.textContent = checklist.title;

        // Create the content div for the checklist items
        const content = document.createElement('div');
        content.className = "checklist-content";
        content.style.display = "none"; // Start hidden

        // Create the table to hold the checklist items
        const table = document.createElement('table');

        // Create table header row
        const headerRow = table.insertRow();
        ["", "Requirement", "Action", "Location"].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        // Populate the table with checklist items
		checklist.items.forEach(item => {
      const row = table.insertRow();

      if (item.type === 'item') {
        // Handle regular checklist item 
        row.insertCell().innerHTML = '<input type="checkbox">';
        row.insertCell().textContent = item.requirement;
        row.insertCell().textContent = item.action;

        const locationCell = row.insertCell();
        if (item.locationImage && item.locationText) { // Check both locationImage and locationText
		  const locationBtn = document.createElement('button');
 		 locationBtn.className = "location-btn";
 		 locationBtn.dataset.img = item.locationImage; 
  		locationBtn.textContent = item.locationText;
  		locationCell.appendChild(locationBtn);
	} else {
          locationCell.textContent = "";
        }
      } else if (item.type === 'note') {
        // Handle note item
        const noteCell = row.insertCell();
        noteCell.colSpan = 4; // Span across all columns
        noteCell.textContent = item.text;
        noteCell.classList.add('note-cell'); 
      }

if (item.type === 'item') {
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
          checkCategoryCompletion(collapsible); // Call the function to check category completion
        });
      }
        });

        content.appendChild(table);

        // Add event listener to toggle the checklist content visibility on click
        collapsible.addEventListener('click', () => {
            content.style.display = (content.style.display === "none") ? "block" : "none";
        });

        // Append both collapsible header and the content
        checklistContentDiv.appendChild(collapsible); 
        checklistContentDiv.appendChild(content);
    });
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
drawingArea.addEventListener("mousedown", startDrawing);
drawingArea.addEventListener("mousemove", draw);
drawingArea.addEventListener("mouseup", stopDrawing);
drawingArea.addEventListener("mouseleave", stopDrawing);

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

