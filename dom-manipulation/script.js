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
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' element.
 * If the quotes array is empty, it displays a message indicating no quotes are available.
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

    // Check if there are any quotes available.
    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes available. Add some quotes or import from a file!";
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-lg', 'text-center');
        quoteDisplay.appendChild(noQuotesMessage);
        saveLastViewedQuoteIndex(-1); // Indicate no quote viewed
        return; // Exit the function if no quotes are present.
    }

    let randomIndex;
    // Try to load the last viewed quote index from session storage
    const lastIndex = loadLastViewedQuoteIndex();

    // If there's a last viewed index and it's valid, display that quote
    // Otherwise, pick a new random quote
    if (lastIndex !== null && lastIndex >= 0 && lastIndex < quotes.length) {
        randomIndex = lastIndex;
    } else {
        randomIndex = Math.floor(Math.random() * quotes.length);
    }

    const selectedQuote = quotes[randomIndex];
    saveLastViewedQuoteIndex(randomIndex); // Save the index of the currently displayed quote

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
 * Handles the logic for adding a new quote to the 'quotes' array based on user input.
 * It validates the input fields, adds the new quote, clears the input fields,
 * and updates the displayed quote. It also saves the updated quotes to local storage.
 *
 * This function demonstrates:
 * - Accessing input values (`inputElement.value`).
 * - Basic input validation.
 * - Modifying an array (`array.push`).
 * - Clearing input fields.
 * - Re-rendering dynamic content by calling `showRandomQuote()`.
 * - Persisting data by calling `saveQuotes()`.
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

    // Clear the input fields after adding the quote for a better user experience.
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Log the updated quotes array to the console for debugging purposes.
    console.log("Quotes updated:", quotes);

    // Immediately show a random quote, which might be the newly added one.
    showRandomQuote();
}

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
                // Use Set to avoid duplicate quotes if merging is preferred, or just push
                // For simplicity, we'll just push. If de-duplication is needed, a Set could be used.
                quotes.push(...importedQuotes);
                saveQuotes(); // Save updated quotes to local storage
                alert('Quotes imported successfully!');
                showRandomQuote(); // Update the display with potentially new quotes
            } else {
                alert('Invalid JSON file format. Please upload a file with an array of quote objects.');
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


// Add an event listener to the "Show New Quote" button.
// When clicked, the showRandomQuote function will be executed.
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial setup when the page loads:
window.onload = function() {
    loadQuotes(); // Load quotes from local storage
    showRandomQuote(); // Display an initial quote (potentially the last viewed or a random one)
};
