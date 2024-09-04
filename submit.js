// Function to show a specific category's entry area and hide others
function showCategory(category) {
    const allEntryAreas = ['checklist', 'airfields', 'custom'].map(c => document.getElementById(`${c}-entry`));
    allEntryAreas.forEach(area => area.style.display = 'none');
    document.getElementById('output-area').style.display = 'none';
    document.getElementById(`${category}-entry`).style.display = 'block';
}




// AIRFIELDS --------------------------------------

function showLargeDataEntryAirfields() {
    document.getElementById('large-data-entry-airfields').style.display = 'block';
    document.getElementById('item-by-item-entry-airfields').style.display = 'none';
}

function showItemByItemEntryAirfields() {
    document.getElementById('large-data-entry-airfields').style.display = 'none';
    document.getElementById('item-by-item-entry-airfields').style.display = 'block';

    // Add at least one airfield item initially
    if (document.querySelectorAll('.item-input-airfields').length === 0) {
        addItemAirfields();
    }
}

// Function to add a new airfield item
function addItemAirfields(newItemDiv = null) {
    const itemEntryAreaAirfields = document.getElementById('item-entry-area-airfields');
    const itemDiv = newItemDiv || document.createElement('div');
    itemDiv.classList.add('item-input-airfields');

    addAddButton(itemDiv, addItemAirfields);
    addRemoveButton(itemDiv);

    // Create input fields for Airfield properties
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'ID', 'idInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'AIRFIELD', 'airfieldInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'ICAO', 'icaoInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'ARP', 'arpInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'Type', 'typeInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'Location', 'locationInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'TWR', 'twrInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'TACAN', 'tacanInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'RWY', 'rwyInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'ILS', 'ilsInput');
    itemDiv.appendChild(document.createElement('br'));
    createInputField(itemDiv, 'Image', 'imageInput');
    itemDiv.appendChild(document.createElement('br'));

    itemDiv.appendChild(document.createElement('br'));

   // itemEntryAreaAirfields.appendChild(itemDiv);

    if (!newItemDiv) {
        itemEntryAreaAirfields.appendChild(itemDiv);
    }
}
// AIRFIELDS END ------------------------



// CHECKLIST --------------------------------------------
let isFirstItem = true;
// Modify addItem() and addNote() to include the "type" selection
function addItem(newItemDiv = null, currType) {
    const itemEntryArea = document.getElementById('item-entry-area');
    const itemDiv = newItemDiv || document.createElement('div');
    itemDiv.classList.add('item-input');

    // Add buttons
    addAddButton(itemDiv, addItem);
    addRemoveButton(itemDiv);

    // Add a dropdown to select item type
      createSelectField(itemDiv, 'Type', 'itemType', ['category', 'item', 'note'], false);


    // Create input fields and textarea (initially hidden)
    createInputField(itemDiv, '', 'categoryTitle', false); // For category
    createInputField(itemDiv, 'Requirement', 'requirement', true);       // For item
    createInputField(itemDiv, 'Action', 'action', true);                 // For item
    createInputField(itemDiv, 'Location Text (optional)', 'locationText');  // For item
    createInputField(itemDiv, 'Location Image (optional)', 'locationImage', true); // For item

    const noteLabel = document.createElement('label');
    noteLabel.textContent = '';
    const noteTextarea = document.createElement('textarea');
    noteTextarea.id = 'noteText';
    itemDiv.appendChild(noteLabel);
    itemDiv.appendChild(noteTextarea);
    itemDiv.appendChild(document.createElement('br'));

    if (!newItemDiv) {
        itemEntryArea.appendChild(itemDiv);
    }

    // Handle visibility of input fields based on selected item type
	  const itemTypeSelect = itemDiv.querySelector('select[id="itemType"]');
	  itemTypeSelect.addEventListener('change', () => {
        updateItemInputsBasedOnType(itemDiv, itemTypeSelect.value);
    });

 if (isFirstItem) {
    itemTypeSelect.value = 'category';
    isFirstItem = false; // Reset the flag after the first item
  } else {
    itemTypeSelect.value = 'item';
  }

  // Trigger the 'change' event to update input fields based on the initial selection
  itemTypeSelect.dispatchEvent(new Event('change'));
}

// Helper function to update input fields based on selected item type
function updateItemInputsBasedOnType(itemDiv, selectedType) {
    const categoryTitleInput = itemDiv.querySelector('input[id="categoryTitle"]');
    const otherInputs = itemDiv.querySelectorAll('input:not([id="categoryTitle"]), label:not([for="categoryTitle"])');
    const noteElements = itemDiv.querySelectorAll('label[for="noteText"], textarea[id="noteText"]');

    if (selectedType === 'category') {
        categoryTitleInput.style.display = 'block';
        otherInputs.forEach(input => input.style.display = 'none');
        noteElements.forEach(el => el.style.display = 'none');
    } else if (selectedType === 'item') {
        categoryTitleInput.style.display = 'none';
        otherInputs.forEach(input => input.style.display = 'block');
        noteElements.forEach(el => el.style.display = 'none');
    } else if (selectedType === 'note') {
        categoryTitleInput.style.display = 'none';
        otherInputs.forEach(input => input.style.display = 'none');
        noteElements.forEach(el => el.style.display = 'block');
    }
}


function addNote() {
    const itemEntryArea = document.getElementById('item-entry-area');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-input');

    // Add a hidden input to indicate it's a note
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.id = 'itemType';
    typeInput.value = 'note';
    itemDiv.appendChild(typeInput);

    // Create textarea for note text
    const noteLabel = document.createElement('label');
    const noteTextarea = document.createElement('textarea');
    noteTextarea.id = 'noteText';
    itemDiv.appendChild(noteLabel);
    itemDiv.appendChild(noteTextarea);
    itemDiv.appendChild(document.createElement('br'));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => itemDiv.remove();
    itemDiv.appendChild(removeButton);

    itemEntryArea.appendChild(itemDiv);
}

// Helper function to create a select (dropdown) field with a label
function createSelectField(parentDiv, labelText, selectId, options, addLabel = true) {
  const select = document.createElement('select');
  select.id = selectId;

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);

  });
  parentDiv.appendChild(select);
}

// CHECKLIST END --------------------------------------------



// CUSTOM ---------------------------------------

// Function to add a new item type field
function addItemType() {
    const itemComposition = document.getElementById('itemComposition');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = 'Enter item type name (e.g., RWR, Image, Name)';
    itemComposition.appendChild(newInput);
    itemComposition.appendChild(document.createElement('br'));
}

// Functions to show/hide Big Data or Item by Item entry for Custom
function showLargeDataEntryCustom() {
    document.getElementById('large-data-entry-custom').style.display = 'block';
    document.getElementById('item-by-item-entry-custom').style.display = 'none';
}

function showItemByItemEntryCustom() {
    document.getElementById('large-data-entry-custom').style.display = 'none';
    document.getElementById('item-by-item-entry-custom').style.display = 'block';

    // Update item input fields based on defined item types
    updateCustomItemInputs();
}

// Function to update item input fields based on defined item types
function updateCustomItemInputs() {
    const itemEntryAreaCustom = document.getElementById('item-entry-area-custom');
    itemEntryAreaCustom.innerHTML = ''; // Clear existing inputs

    const itemTypes = Array.from(document.querySelectorAll('#itemComposition input'))
        .map(input => input.value.trim())
        .filter(value => value !== '');

    if (itemTypes.length > 0) {
        addItemCustom(); // Add at least one item initially
    }
}
let isFirstCustomItem = true;
// Function to add a new custom item
function addItemCustom(newItemDiv = null) {
    const itemEntryAreaCustom = document.getElementById('item-entry-area-custom');
    const itemDiv = newItemDiv || document.createElement('div');
    itemDiv.classList.add('item-input-custom');
    const hasCategory = document.getElementById('hasCategoryCheckbox').checked;


    // Add buttons
    addAddButton(itemDiv, addItemCustom);
    addRemoveButton(itemDiv);

    // Add a dropdown to select item type
    const itemTypes = Array.from(document.querySelectorAll('#itemComposition input'))
        .map(input => input.value.trim())
        .filter(value => value !== '');
    const options = ['note']; // 'note' is always available
    if (document.getElementById('hasCategoryCheckbox').checked) {
        options.unshift('category');
    }
    if (itemTypes.length > 0) {
        options.push('item');
    }
    createSelectField(itemDiv, 'Type', 'itemTypeCustom', options);

    // Create input fields and textarea (initially hidden)
    if (document.getElementById('hasCategoryCheckbox').checked) {
        createInputField(itemDiv, 'Category', 'categoryCustom', true);
    }

    // Create input fields for custom item types (initially hidden)
    itemTypes.forEach(itemType => {
        createInputField(itemDiv, itemType, `${itemType}Input`, true);
    });

    const noteLabel = document.createElement('label');
    //noteLabel.textContent = 'Note: ';
    const noteTextarea = document.createElement('textarea');
    noteTextarea.id = 'noteTextCustom';
    itemDiv.appendChild(noteLabel);
    itemDiv.appendChild(noteTextarea);
    itemDiv.appendChild(document.createElement('br'));

    if (!newItemDiv) {
        itemEntryAreaCustom.appendChild(itemDiv);
    }

    // Handle visibility of input fields based on selected item type
    const itemTypeSelect = itemDiv.querySelector('select[id="itemTypeCustom"]');
    itemTypeSelect.addEventListener('change', () => {
        updateCustomItemInputsBasedOnType(itemDiv, itemTypeSelect.value, itemTypes);
    });

    // Set the initial selected option based on isFirstCustomItem and hasCategory
    if (isFirstCustomItem && hasCategory) {
        itemTypeSelect.value = 'category';
        isFirstCustomItem = false; // Reset the flag after the first item
    } else if (itemTypes.length > 0) { // Only default to 'item' if there are item types defined
        itemTypeSelect.value = 'item';
    }

    // Trigger the 'change' event to update input fields based on the initial selection
    itemTypeSelect.dispatchEvent(new Event('change'));
}

// Helper function to update input fields based on selected item type
function updateCustomItemInputsBasedOnType(itemDiv, selectedType, itemTypes) {
    const categoryInput = itemDiv.querySelector('input[id="categoryCustom"]');
    const customItemInputs = Array.from(itemDiv.querySelectorAll('input:not([id="categoryCustom"])'));
    const noteElements = itemDiv.querySelectorAll('label[for="noteTextCustom"], textarea[id="noteTextCustom"]');

    if (selectedType === 'category') {
        if (categoryInput) {
            categoryInput.style.display = 'block';
        }
        customItemInputs.forEach(input => input.style.display = 'none');
        noteElements.forEach(el => el.style.display = 'none');
    } else if (selectedType === 'item') {
        if (categoryInput) {
            categoryInput.style.display = 'none';
        }
        customItemInputs.forEach(input => input.style.display = 'block');
        noteElements.forEach(el => el.style.display = 'none');
    } else if (selectedType === 'note') {
        if (categoryInput) {
            categoryInput.style.display = 'none';
        }
        customItemInputs.forEach(input => input.style.display = 'none');
        noteElements.forEach(el => el.style.display = 'block');
    }
}



// END OF CUSTOM --------------------------

// Helper function to add a "Remove" button
function addRemoveButton(itemDiv) {
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        itemDiv.remove();
    };
    itemDiv.appendChild(removeButton);
}

// Helper function to add an "Add" button
function addAddButton(itemDiv, addItemFunction) {
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = 'Add Before';
  addButton.onclick = () => {
    const newItemDiv = document.createElement('div');
    addItemFunction(newItemDiv);

    // Insert the new item div before the current item div
    itemDiv.parentNode.insertBefore(newItemDiv, itemDiv);

    // Trigger the 'change' event on the dropdown of the newly added item
    // to ensure the correct input fields are displayed initially
    const newItemDropdown = newItemDiv.querySelector('select[id="itemType"]');
    if (newItemDropdown) {
      // Dispatch a 'change' event to trigger the event listener
      newItemDropdown.dispatchEvent(new Event('change'));
    }
  };
  itemDiv.appendChild(addButton);
}


// Helper function to create an input field with a label
function createInputField(parentDiv, labelText, inputId, itemType) {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.placeholder = labelText; // Set the label text as the placeholder

  parentDiv.appendChild(input);

  // Conditionally add the <br> element only if itemType is 'item'
  if (inputId !== 'categoryTitle') {
    // parentDiv.appendChild(document.createElement('br'));
  }
}

document.getElementById('data-entry-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let jsonData;

    // Check which submit button was clicked
    if (event.submitter.id === 'generate-json-large') {
        jsonData = generateChecklistJSON("checklistlarge");
    } else if (event.submitter.id === 'generate-json-item') {
        jsonData = generateChecklistJSON("checklistitem");
    } else if (event.submitter.id === 'generate-json-large-custom') {
        jsonData = generateChecklistJSON("customlarge");
    } else if (event.submitter.id === 'generate-json-item-custom') {
        jsonData = generateChecklistJSON("customitem");
    } else if (event.submitter.id === 'generate-json-large-airfields') {
        jsonData = generateChecklistJSON("airfieldlarge");
    } else if (event.submitter.id === 'generate-json-item-airfields') {
        jsonData = generateChecklistJSON("airfielditem");
    }

    // Display the generated JSON in the output textarea
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.value = JSON.stringify(jsonData, null, 2);
});


// data generation ------------------------------------------------------------------

// Function to generate JSON for checklists
function generateChecklistJSON(theType) {
    const checklistData = {};
    let currentCategory = null;
    let warnings = [];

    // Make the output area visible
    document.getElementById('output-area').style.display = 'block';
    const hasCategory = document.getElementById('hasCategoryCheckbox').checked;
    const itemTypes = Array.from(document.querySelectorAll('#itemComposition input'))
        .map(input => input.value.trim())
        .filter(value => value !== '');



    if (theType === "checklistlarge") {
        const largeDataTextarea = document.getElementById('large-data-textarea');
        const largeDataText = largeDataTextarea.value.trim();


        const lines = largeDataText.split('\n');

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('[')) {
                currentCategory = line.slice(1, -1).trim();
                checklistData[currentCategory] = [];
            } else if (line.startsWith('NOTE:')) {
                if (currentCategory) {
                    checklistData[currentCategory].push({
                        type: "note",
                        text: line.slice(5).trim()
                    });
                } else {
                    warnings.push("NOTE encountered before any category header.");
                }
            } else if (line !== '') {

                const parts = line.split(';');

                if (parts.length >= 2 && currentCategory) {
			        const requirement = parts[0].trim();
			        let action = parts[1].trim();
			        let location = "";
			        let locationText = "";

			        if (parts.length === 3) {
			            locationText = parts[2].trim(); // Third option goes to locationText
			        } else if (parts.length === 4) {
			            locationText = parts[2].trim(); // Third option goes to locationText
			            location = parts[3].trim();     // Fourth option goes to location (image filename)
			        }

			        checklistData[currentCategory].push({
			            type: "item",
			            requirement: requirement,
			            action: action,
			            location: location,
			            locationText: locationText
			        });
			    } else {
			        warnings.push(`Invalid line format: ${line}`);
			    }
            }
        });
    } else if (theType === "checklistitem") {
        const itemInputs = document.querySelectorAll('.item-input');
        itemInputs.forEach(itemInput => {
            const type = itemInput.querySelector('select[id="itemType"]').value;
            if (type === 'category') {
                currentCategory = itemInput.querySelector('input[id="categoryTitle"]').value;
                checklistData[currentCategory] = [];
            } else if (type === 'item') {
                const requirement = itemInput.querySelector('input[id="requirement"]').value;
                const action = itemInput.querySelector('input[id="action"]').value;
                const locationImage = itemInput.querySelector('input[id="locationImage"]').value;
                const locationText = itemInput.querySelector('input[id="locationText"]').value;

                checklistData[currentCategory].push({
                    type: "item",
                    requirement: requirement,
                    action: action,
                    location: locationImage || "",
                    locationText: locationText || ""
                });
            } else if (type === 'note') {
                const noteText = itemInput.querySelector('textarea[id="noteText"]').value;
                checklistData[currentCategory].push({
                    type: "note",
                    text: noteText
                });
            }
        });
	} else if (theType === "customlarge") {
	    // Handle Big Data input for Custom
	    const largeDataTextareaCustom = document.getElementById('large-data-textarea-custom');
	    const largeDataTextCustom = largeDataTextareaCustom.value.trim();

	    const lines = largeDataTextCustom.split('\n');
	    lines.forEach(line => {
	        line = line.trim();

	        if (hasCategory && line.startsWith('[')) {
	            // Start of a new category
	            currentCategory = line.slice(1, -1).trim();
	            checklistData[currentCategory] = [];
	        } else if (line.startsWith('NOTE:')) {
	            if (currentCategory || !hasCategory) {
	                const categoryKey = hasCategory ? currentCategory : "Default";
	                if (!checklistData[categoryKey]) {
	                    checklistData[categoryKey] = [];
	                }
	                checklistData[categoryKey].push({
	                    type: "note",
	                    text: line.slice(5).trim()
	                });
	            }
	        } else if (line !== '') {
	            const parts = line.split(';');
	            let itemData = {};
				 // Initialize currentItemIndex
	            // Check if the line has at least the required number of parts (itemTypes)
	            if (parts.length >= itemTypes.length) {
	                    // If no category, directly assign itemTypes to parts
	                itemTypes.forEach((itemType, index) => {
	                   itemData[itemType] = parts[index].trim();
	                });
					const categoryKey = hasCategory ? currentCategory : "Default";
					if (hasCategory) {
                        itemData = { type: "item", ...itemData };
                    }

	                if (!checklistData[categoryKey]) {
	                    checklistData[categoryKey] = [];
	                }
	                checklistData[categoryKey].push(itemData);

	                // If hasCategory is true and it's the first item in the CURRENT category, add 'type: "item"'
	                //if (hasCategory) {
	                //    checklistData[categoryKey][currentItemIndex] = { type: "item", ...checklistData[categoryKey][currentItemIndex] };
	                 //   console.log(checklistData[categoryKey][currentItemIndex]);
	                //}

	            }



	        }
	    });
	} else if (theType === "customitem") {
        // Handle Item by Item input for Custom
        const itemInputsCustom = document.querySelectorAll('.item-input-custom');
        let customItems = []; // Array to store custom items

        itemInputsCustom.forEach(itemInput => {
            const type = itemInput.querySelector('select[id="itemTypeCustom"]').value;
            if (type === 'category') {
                currentCategory = itemInput.querySelector('input[id="categoryCustom"]').value;
                if (!checklistData[currentCategory]) {
                    checklistData[currentCategory] = [];
                }
                // If there were custom items added before this category, add them to the checklistData
                if (customItems.length > 0) {
                    if (!hasCategory) {
                        if (!checklistData['Default']) {
                            checklistData['Default'] = [];
                        }
                        checklistData['Default'] = checklistData['Default'].concat(customItems);
                    } else {
                        checklistData[currentCategory] = checklistData[currentCategory].concat(customItems);
                    }
                    customItems = []; // Reset customItems
                }
            } else if (type === 'item') {
                const itemData = {}; // No need for 'type: "item"' anymore
                if (hasCategory && checklistData[currentCategory].length === 0) {
                    itemData.type = "item";
                }
                itemTypes.forEach(itemType => {
                    const inputId = `${itemType}Input`;
                    const inputValue = itemInput.querySelector(`input[id="${inputId}"]`).value;
                    itemData[itemType] = inputValue;
                });
                customItems.push(itemData); // Add item to customItems array
            } else if (type === 'note') {
                const noteText = itemInput.querySelector('textarea[id="noteTextCustom"]').value;
                if (currentCategory || !hasCategory) {
                    const categoryKey = hasCategory ? currentCategory : "Default";
                    if (!checklistData[categoryKey]) {
                        checklistData[categoryKey] = [];
                    }
                    checklistData[categoryKey].push({
                        type: "note",
                        text: noteText
                    });
                }
            }
        });

        // Add any remaining custom items to the last category or "Default"
        if (customItems.length > 0) {
            if (!hasCategory) {
                if (!checklistData['Default']) {
                    checklistData['Default'] = [];
                }
                checklistData['Default'] = checklistData['Default'].concat(customItems);
            } else {
                checklistData[currentCategory] = checklistData[currentCategory].concat(customItems);
            }
        }
    }
    else if (theType === 'airfieldlarge' || theType === 'airfielditem') {
        const airfieldData = [];

        if (theType === 'airfieldlarge') {
            // Handle Big Data input for Airfields
            const largeDataTextareaAirfields = document.getElementById('large-data-textarea-airfields');
            const largeDataTextAirfields = largeDataTextareaAirfields.value.trim();

            const lines = largeDataTextAirfields.split('\n');
            lines.forEach(line => {
                console.log(largeDataTextAirfields);
                line = line.trim();
                if (line !== '') {
                    const parts = line.split(';');

	                  airfieldData.push({
	                    "ID": parts[0]?.trim() || "", // Use optional chaining and default to empty string
	                    "AIRFIELD": parts[1]?.trim() || "",
	                    "ICAO": parts[2]?.trim() || "",
	                    "ARP": parts[3]?.trim() || "",
	                    "Type": parts[4]?.trim() || "",
	                    "Location": parts[5]?.trim() || "",
	                    "TWR": parts[6]?.trim() || "",
	                    "TACAN": parts[7]?.trim() || "",
	                    "RWY": parts[8]?.trim() || "",
	                    "ILS": parts[9]?.trim() || ""
	                });


                }
            });


        }  else if (theType === 'airfielditem') {
            // Handle Item by Item input for Airfields
            const itemInputsAirfields = document.querySelectorAll('.item-input-airfields');
            itemInputsAirfields.forEach(itemInput => {
                airfieldData.push({
                    "ID": itemInput.querySelector('input[id="idInput"]').value,
                    "AIRFIELD": itemInput.querySelector('input[id="airfieldInput"]').value,
                    "ICAO": itemInput.querySelector('input[id="icaoInput"]').value,
                    "ARP": itemInput.querySelector('input[id="arpInput"]').value,
                    "Type": itemInput.querySelector('input[id="typeInput"]').value,
                    "Location": itemInput.querySelector('input[id="locationInput"]').value,
                    "TWR": itemInput.querySelector('input[id="twrInput"]').value,
                    "TACAN": itemInput.querySelector('input[id="tacanInput"]').value,
                    "RWY": itemInput.querySelector('input[id="rwyInput"]').value,
                    "ILS": itemInput.querySelector('input[id="ilsInput"]').value,
                    "image": itemInput.querySelector('input[id="imageInput"]').value
                });
            });
        }

        // Display the generated JSON and make the output area visible
        const jsonOutput = document.getElementById('json-output');
        jsonOutput.value = JSON.stringify(airfieldData, null, 2);
        document.getElementById('output-area').style.display = 'block';

        return airfieldData; // Return the airfieldData
    }


    return checklistData;
}

// END OF DATA GENERATION -----------------------------------------------------------------




function invertData() {
    const jsonOutput = document.getElementById('json-output');
    const jsonData = JSON.parse(jsonOutput.value); 

    const largeDataTextarea = document.getElementById('large-data-textarea');
    const largeDataText = largeDataTextarea.value.trim();


    let invertedData = "";

    for (const category in jsonData) {
        if (jsonData.hasOwnProperty(category)) {
            invertedData += `[${category}]\n`; 
            jsonData[category].forEach(item => {
                if (item.type === 'item') {
                    invertedData += `${item.requirement};${item.action};${item.locationText};${item.location}\n`;
                } else if (item.type === 'note') {
                    invertedData += `NOTE: ${item.text}\n`;
                }
            });
            invertedData += '\n'; 
        }
    }

    // Decide where to put the inverted data (replace existing textarea or a new one)
    largeDataTextarea.value = invertedData; // PLACES DATA ON SOURCE LOCATION
}



function copyToClipboard() {
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.select();
    document.execCommand('copy');
}

function showLargeDataEntry() {
    document.getElementById('large-data-entry').style.display = 'block';
    document.getElementById('item-by-item-entry').style.display = 'none';
}

function showItemByItemEntry() {
    document.getElementById('large-data-entry').style.display = 'none';
    document.getElementById('item-by-item-entry').style.display = 'block';
}