// Default quotes if no data is found in local storage
const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Global array to store quote objects
let quotes = [];

// Get the DOM element where quotes will be displayed.
const quoteDisplay = document.getElementById('quoteDisplay');
// Get the button to show a new quote.
const newQuoteButton = document.getElementById('newQuote');
// Get input fields for adding new quotes.
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
// Get the category filter dropdown.
const categoryFilter = document.getElementById('categoryFilter');

// --- Web Storage Functions ---

/**
 * Loads quotes from local storage. If no quotes are found,
 * it initializes the quotes array with a set of default quotes.
 * This function is called once when the application starts.
 */
function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            // Parse the JSON string back into a JavaScript array
            quotes = JSON.parse(storedQuotes);
        } else {
            // If no quotes are in local storage, use the default ones
            quotes = [...defaultQuotes];
            // And save them to local storage for the first time
            saveQuotes();
        }
    } catch (e) {
        console.error("Error loading quotes from local storage:", e);
        // Fallback to default quotes if there's an issue with local storage
        quotes = [...defaultQuotes];
    }
}

/**
 * Saves the current 'quotes' array to local storage.
 * The array is converted to a JSON string before saving.
 * This ensures data persistence across browser sessions.
 */
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
        console.error("Error saving quotes to local storage:", e);
    }
}

/**
 * Saves the index of the last viewed quote to session storage.
 * This demonstrates the use of session storage for temporary, session-specific data.
 * @param {number} index - The index of the quote that was just displayed.
 */
function saveLastViewedQuoteIndex(index) {
    try {
        sessionStorage.setItem('lastViewedQuoteIndex', index);
    } catch (e) {
        console.error("Error saving last viewed quote index to session storage:", e);
    }
}

/**
 * Retrieves the index of the last viewed quote from session storage.
 * @returns {number|null} The index of the last viewed quote, or null if not found.
 */
function loadLastViewedQuoteIndex() {
    try {
        const index = sessionStorage.getItem('lastViewedQuoteIndex');
        return index !== null ? parseInt(index, 10) : null;
    } catch (e) {
        console.error("Error loading last viewed quote index from session storage:", e);
        return null;
    }
}

/**
 * Saves the last selected category filter to local storage.
 * @param {string} category - The category string to save.
 */
function saveLastSelectedCategory(category) {
    try {
        localStorage.setItem('lastSelectedCategory', category);
    } catch (e) {
        console.error("Error saving last selected category to local storage:", e);
    }
}

/**
 * Retrieves the last selected category filter from local storage.
 * @returns {string|null} The last selected category, or null if not found.
 */
function loadLastSelectedCategory() {
    try {
        return localStorage.getItem('lastSelectedCategory');
    } catch (e) {
        console.error("Error loading last selected category from local storage:", e);
        return null;
    }
}

// --- DOM Manipulation and Logic Functions ---

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' element.
 * It considers the currently selected category filter.
 * If the filtered quotes array is empty, it displays a message indicating no quotes are available.
 * It also saves the index of the displayed quote to session storage.
 *
 * This function demonstrates:
 * - Clearing existing DOM content (`innerHTML = ''`).
 * - Creating new DOM elements (`document.createElement`).
 * - Adding CSS classes to elements (`element.classList.add`).
 * - Setting text content (`element.textContent`).
 * - Appending child elements (`parentElement.appendChild`).
 */
function showRandomQuote() {
    // Clear any existing content in the quote display area to avoid multiple quotes piling up.
    quoteDisplay.innerHTML = '';

    const selectedCategory = categoryFilter.value;
    let quotesToDisplay = [];

    // Filter quotes based on the selected category
    if (selectedCategory === 'all') {
        quotesToDisplay = quotes;
    } else {
        quotesToDisplay = quotes.filter(quote => quote.category === selectedCategory);
    }

    // Check if there are any quotes available after filtering.
    if (quotesToDisplay.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes available for this category. Try a different filter or add new quotes!";
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-lg', 'text-center');
        quoteDisplay.appendChild(noQuotesMessage);
        saveLastViewedQuoteIndex(-1); // Indicate no quote viewed
        return; // Exit the function if no quotes are present.
    }

    let randomIndex;
    // Try to load the last viewed quote index from session storage for *all* quotes.
    // Note: The session storage remembers the index in the full 'quotes' array.
    // If we're filtering, this might not directly apply to the 'quotesToDisplay' array.
    // For simplicity with filtering, we'll just pick a random one from the filtered set
    // and only use the 'lastViewedQuoteIndex' if 'all' categories are selected.
    if (selectedCategory === 'all') {
        const lastIndex = loadLastViewedQuoteIndex();
        if (lastIndex !== null && lastIndex >= 0 && lastIndex < quotes.length) {
            randomIndex = lastIndex;
        } else {
            randomIndex = Math.floor(Math.random() * quotes.length);
        }
    } else {
        randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    }


    const selectedQuote = quotesToDisplay[randomIndex];

    // If 'all' categories are selected, save the index from the original 'quotes' array.
    // Otherwise, we don't store the index, as it's within a temporary filtered array.
    if (selectedCategory === 'all') {
        const originalIndex = quotes.indexOf(selectedQuote); // Find the index in the original array
        if (originalIndex !== -1) {
            saveLastViewedQuoteIndex(originalIndex);
        }
    } else {
        // Clear session storage for last viewed quote if filtering is active,
        // as the index won't be consistent across filter changes.
        sessionStorage.removeItem('lastViewedQuoteIndex');
    }


    // Create a container div for the quote.
    const quoteContainer = document.createElement('div');
    quoteContainer.classList.add(
        'quote-container', // Custom class for styling
        'w-full', 'max-w-xl', 'p-6', 'bg-white', 'rounded-xl', 'shadow-lg', // Tailwind classes
        'flex', 'flex-col', 'items-center', 'justify-center', 'text-center'
    );

    // Create a paragraph element for the quote text.
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${selectedQuote.text}"`; // Add quotation marks.
    quoteText.classList.add(
        'quote-text', // Custom class for styling
        'text-2xl', 'font-medium', 'text-gray-800', 'mb-4', 'leading-relaxed' // Tailwind classes
    );

    // Create a paragraph element for the quote category.
    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `- ${selectedQuote.category}`; // Prefix with a hyphen.
    quoteCategory.classList.add(
        'quote-category', // Custom class for styling
        'text-lg', 'text-gray-600', 'italic' // Tailwind classes
    );

    // Append the quote text and category to the quote container.
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);

    // Append the complete quote container to the display area.
    quoteDisplay.appendChild(quoteContainer);
}

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 * It also sets the selected option based on the last saved filter preference.
 */
function populateCategories() {
    // Get unique categories from the quotes array
    const categories = new Set(quotes.map(quote => quote.category));

    // Clear existing options in the dropdown, but preserve the first "All Categories" option
    while (categoryFilter.children.length > 1) {
        categoryFilter.removeChild(categoryFilter.lastChild);
    }

    // Add each unique category as an option
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category filter from local storage
    const lastSelectedCategory = loadLastSelectedCategory();
    if (lastSelectedCategory && categories.has(lastSelectedCategory) || lastSelectedCategory === 'all') {
        categoryFilter.value = lastSelectedCategory;
    } else {
        // Default to 'all' if the last selected category is no longer available or not set
        categoryFilter.value = 'all';
    }
}

/**
 * Filters the displayed quotes based on the selected category in the dropdown.
 * This function is called when the 'onchange' event of the category filter fires.
 * It saves the selected filter to local storage and then updates the displayed quote.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    saveLastSelectedCategory(selectedCategory); // Persist the selected filter
    showRandomQuote(); // Display a new random quote based on the applied filter
}

/**
 * Handles the logic for adding a new quote to the 'quotes' array based on user input.
 * It validates the input fields, adds the new quote, clears the input fields,
 * and updates the displayed quote. It also saves the updated quotes to local storage
 * and repopulates the categories dropdown in case a new category was introduced.
 */
function createAddQuoteForm() {
    // Get the trimmed values from the input fields.
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Perform basic validation to ensure both fields are not empty.
    if (text === '' || category === '') {
        console.error("Both quote text and category are required!");
        alert("Please enter both a quote and a category.");
        return; // Stop the function if validation fails.
    }

    // Create a new quote object.
    const newQuote = { text: text, category: category };
    // Add the new quote to the 'quotes' array.
    quotes.push(newQuote);

    // Save the updated quotes array to local storage.
    saveQuotes();
    // Re-populate categories in case a new category was added
    populateCategories();

    // Clear the input fields after adding the quote for a better user experience.
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Log the updated quotes array to the console for debugging purposes.
    console.log("Quotes updated:", quotes);

    // Immediately show a random quote, which might be the newly added one.
    showRandomQuote();
}

// --- JSON Import/Export Functions ---

/**
 * Exports the current 'quotes' array to a JSON file and triggers a download.
 * Uses Blob and URL.createObjectURL to create a downloadable link dynamically.
 */
function exportToJsonFile() {
    try {
        const json = JSON.stringify(quotes, null, 2); // Pretty print JSON
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a); // Append to body to make it clickable
        a.click(); // Programmatically click the link to trigger download
        document.body.removeChild(a); // Remove the link after download initiated
        URL.revokeObjectURL(url); // Clean up the object URL
        alert('Quotes exported successfully as quotes.json!');
    } catch (e) {
        console.error("Error exporting quotes to JSON:", e);
        alert("Failed to export quotes. Please try again.");
    }
}

/**
 * Imports quotes from a selected JSON file.
 * This function is triggered by the 'onchange' event of the file input.
 * It reads the file, parses the JSON content, merges it with existing quotes,
 * saves to local storage, and updates the display.
 * @param {Event} event - The change event from the file input.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return; // No file selected
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            // Basic validation to ensure imported data is an array of objects
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                // Add new quotes, avoiding exact duplicates if they already exist
                importedQuotes.forEach(newQuote => {
                    // Check if a quote with the same text and category already exists
                    const exists = quotes.some(existingQuote =>
                        existingQuote.text === newQuote.text && existingQuote.category === newQuote.category
                    );
                    if (!exists) {
                        quotes.push(newQuote);
                    }
                });

                saveQuotes(); // Save updated quotes to local storage
                populateCategories(); // Update categories dropdown with potentially new categories
                alert('Quotes imported successfully!');
                showRandomQuote(); // Update the display with potentially new quotes
            } else {
                alert('Invalid JSON file format. Please upload a file with an array of quote objects, each having "text" and "category" properties.');
            }
        } catch (error) {
            console.error("Error parsing JSON or importing quotes:", error);
            alert('Failed to import quotes. Please ensure the file is a valid JSON format.');
        }
    };
    fileReader.onerror = function(e) {
        console.error("FileReader error:", e);
        alert('Error reading file. Please try again.');
    };
    fileReader.readAsText(file);
}

// --- Event Listeners and Initialization ---

// Add an event listener to the "Show New Quote" button.
// When clicked, the showRandomQuote function will be executed.
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial setup when the page loads:
window.onload = function() {
    loadQuotes(); // Load quotes from local storage
    populateCategories(); // Populate the category filter dropdown
    filterQuotes(); // Apply the last saved filter and display a quote
};
