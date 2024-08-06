

// Helper function to create an input field with a label
function createInputField(parentDiv, labelText, inputId, itemType) {
  const label = document.createElement('label');
  label.textContent = labelText + ': ';
  label.htmlFor = inputId;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;

  parentDiv.appendChild(label);
  parentDiv.appendChild(input);

  // Conditionally add the <br> element only if itemType is 'item'
  if (inputId !== 'categoryTitle') {
  //  parentDiv.appendChild(document.createElement('br')); 
  }
}

// Function to handle form submission and generate JSON
document.getElementById('data-entry-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    let jsonData;

    // Check which submit button was clicked
    if (event.submitter.id === 'generate-json-large') {
        jsonData = generateChecklistJSON(); 
    } else if (event.submitter.id === 'generate-json-item') {
        jsonData = generateChecklistJSON(); 
    }

    // Display the generated JSON in the output textarea
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.value = JSON.stringify(jsonData, null, 2); 
});

// Function to generate JSON for checklists
function generateChecklistJSON() {
    const checklistData = {};
    let currentCategory = null;
    let warnings = [];

    const largeDataTextarea = document.getElementById('large-data-textarea');
    const largeDataText = largeDataTextarea.value.trim();

    if (largeDataText) {
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

                    if (parts.length === 3) { // If the third column is present
                        locationImage = parts[2].trim();
                        locationText = locationImage.split('.')[0]; // Extract filename without extension
                    } else { // If the third column is missing
                        const categoryWords = currentCategory.split(' ').slice(0, 2); // Get the first two words of the category
                        locationImage = categoryWords.join('_').toLowerCase() + '.png'; // Construct the image filename
                    }

                    checklistData[currentCategory].push({
                        type: "item",
                        requirement: requirement,
                        action: action,
                        location: locationImage, 
                        locationText: locationText 
                    });
                } else {
                    warnings.push(`Invalid line format: ${line}`);
                }
            }
        });

        // ... (rest of the code to display the JSON or warnings)
    } else { 
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
  }

  return checklistData; // Return the actual checklist data
}

function copyToClipboard() {
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.select();
    document.execCommand('copy');
}

// Modify addItem() and addNote() to include the "type" selection
function addItem() {
    const itemEntryArea = document.getElementById('item-entry-area');

    // Create a container div for the item inputs
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-input');

    // Add a button to remove the item
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        itemDiv.remove();
    };
    itemDiv.appendChild(removeButton);

    // Add a dropdown to select item type
    createSelectField(itemDiv, 'Type', 'itemType', ['item', 'category', 'note']); // Add 'note' option

    // Create input fields for Requirement, Action, locationImage, and locationText
    createInputField(itemDiv, 'Requirement', 'requirement');
    createInputField(itemDiv, 'Action', 'action');
    createInputField(itemDiv, 'Location Image (optional)', 'locationImage');
    createInputField(itemDiv, 'Location Text (optional)', 'locationText');

    // Create textarea for note text (initially hidden)
    const noteLabel = document.createElement('label');
    noteLabel.textContent = 'Note: ';
    noteLabel.style.display = 'none'; // Initially hide the note label

    const noteTextarea = document.createElement('textarea');
    noteTextarea.id = 'noteText';
    noteTextarea.style.display = 'none'; // Initially hide the note textarea

    itemDiv.appendChild(noteLabel);
    itemDiv.appendChild(noteTextarea);
    itemDiv.appendChild(document.createElement('br'));



    itemEntryArea.appendChild(itemDiv);

    // Conditionally create input for category title and handle visibility of other fields
    const itemTypeSelect = itemDiv.querySelector('select[id="itemType"]');
    itemTypeSelect.addEventListener('change', () => {
        const categoryTitleInput = itemDiv.querySelector('input[id="categoryTitle"]');
        const otherInputs = itemDiv.querySelectorAll('input:not([id="categoryTitle"]), label:not([for="categoryTitle"])');
        if (itemTypeSelect.value === 'category') {
            if (!categoryTitleInput) {
                createInputField(itemDiv, 'Category Title', 'categoryTitle');
            }
            otherInputs.forEach(input => input.style.display = 'none');
            noteLabel.style.display = 'none';
            noteTextarea.style.display = 'none';
        } else if (itemTypeSelect.value === 'item') {
            if (categoryTitleInput) {
                categoryTitleInput.parentNode.remove(); 
            }
            otherInputs.forEach(input => input.style.display = 'block');
            noteLabel.style.display = 'none';
            noteTextarea.style.display = 'none';
        } else if (itemTypeSelect.value === 'note') {
            otherInputs.forEach(input => input.style.display = 'none');
            noteLabel.style.display = 'block';
            noteTextarea.style.display = 'block';
        }
    });
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
    noteLabel.textContent = 'Note: ';
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
function createSelectField(parentDiv, labelText, selectId, options) {
    const label = document.createElement('label');
    label.textContent = labelText + ': ';
    label.htmlFor = selectId;

    const select = document.createElement('select');
    select.id = selectId;

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    parentDiv.appendChild(label);
    parentDiv.appendChild(select);
    parentDiv.appendChild(document.createElement('br'));
}



function showLargeDataEntry() {
  document.getElementById('large-data-entry').style.display = 'block';
  document.getElementById('item-by-item-entry').style.display = 'none';
}

function showItemByItemEntry() {
  document.getElementById('large-data-entry').style.display = 'none';
  document.getElementById('item-by-item-entry').style.display = 'block';
}