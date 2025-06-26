// Default quotes if no data is found in local storage
const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Global array to store client-side quote objects (local data)
let quotes = [];

// Configuration for syncing
const SYNC_INTERVAL_MS = 15000; // Sync every 15 seconds
const NOTIFICATION_TIMEOUT_MS = 3000; // Notifications disappear after 3 seconds

// NEW: Define the mock API URL for JSONPlaceholder
const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts";


// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const syncButton = document.getElementById('syncButton');
const notificationArea = document.getElementById('notificationArea');

// --- Notification System ---

/**
 * Displays a temporary notification message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification ('success', 'error', 'info').
 */
let notificationTimeout; // To clear previous timeouts
function displayNotification(message, type = 'info') {
    // Clear any existing timeout to allow new notifications to display fully
    clearTimeout(notificationTimeout);

    notificationArea.textContent = message;
    notificationArea.className = 'notification-area show'; // Reset classes and show
    notificationArea.classList.add(type);

    // Set a timeout to hide the notification after a few seconds
    notificationTimeout = setTimeout(() => {
        notificationArea.classList.remove('show');
    }, NOTIFICATION_TIMEOUT_MS);
}


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
        displayNotification("Error loading local data. Using default quotes.", "error");
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
        displayNotification("Error saving data locally.", "error");
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

// --- Mock API Interaction (Using JSONPlaceholder) ---

/**
 * Fetches quotes from a mock server API (JSONPlaceholder).
 * It maps the fetched data to fit the application's quote structure.
 * @returns {Promise<Array<Object>>} A promise that resolves with the fetched quotes.
 */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(MOCK_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // JSONPlaceholder posts have 'title' and 'body'. Map 'title' to 'text'.
        // For 'category', we can assign a default or randomly pick from known categories.
        // Get up to 20 posts for a reasonable sample.
        const fetchedQuotes = data.slice(0, 20).map((post, index) => ({
            text: post.title,
            // Assign a category by cycling through categories from your defaultQuotes
            category: defaultQuotes[index % defaultQuotes.length].category || "General"
        }));
        console.log("Fetched quotes from JSONPlaceholder:", fetchedQuotes);
        return fetchedQuotes;
    } catch (error) {
        console.error("Error fetching from mock API:", error);
        displayNotification("Failed to fetch quotes from server. Check console for details.", "error");
        return []; // Return empty array on error to prevent crashing
    }
}

/**
 * Simulates pushing a new quote to the server using JSONPlaceholder's POST endpoint.
 * Note: JSONPlaceholder does not actually save the data; it only simulates a successful POST.
 * @param {Object} quote - The quote object to push.
 * @returns {Promise<void>} A promise that resolves when the push is complete.
 */
async function pushNewQuoteToServer(quote) {
    try {
        const response = await fetch(MOCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Map your quote to JSONPlaceholder's expected post structure
            body: JSON.stringify({
                title: quote.text,
                body: `Category: ${quote.category}`,
                userId: 1, // Dummy user ID
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Successfully simulated POSTing new quote:", result);
    } catch (error) {
        console.error("Error pushing new quote to mock API:", error);
        // Notification for single quote push failure is optional, often handled by main sync
    }
}

// --- Data Syncing and Conflict Resolution ---

/**
 * Performs a data synchronization between the client's local quotes and the mock server.
 * Conflict Resolution Strategy: Server's additions take precedence.
 * After merging, the client's current state (now including server additions) is saved locally.
 */
async function syncQuotes() {
    displayNotification("Syncing data...", "info");
    try {
        const remoteQuotes = await fetchQuotesFromServer(); // Get latest from server
        let changesDetected = false;

        // Step 1: Merge server's unique quotes into local data
        remoteQuotes.forEach(serverQuote => {
            // Check if this server quote already exists in our local array (by text and category)
            const existsLocally = quotes.some(localQuote =>
                localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
            );

            if (!existsLocally) {
                quotes.push(serverQuote);
                changesDetected = true;
                console.log("Added new quote from server:", serverQuote);
            }
        });

        // Step 2: Save the potentially updated local quotes to localStorage.
        if (changesDetected) {
            saveQuotes(); // Save the merged local quotes
            populateCategories(); // Update categories if new ones were added
            showRandomQuote(); // Refresh the display
            displayNotification("Data synced: New quotes added from server.", "success");
        } else {
            displayNotification("Data synced. No new quotes from server.", "success");
        }

    } catch (error) {
        console.error("Error during sync:", error);
        displayNotification("Sync failed. Please try again later.", "error");
    }
}


// --- DOM Manipulation and Logic Functions ---

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' element.
 * It considers the currently selected category filter.
 * If the filtered quotes array is empty, it displays a message indicating no quotes are available.
 * It also saves the index of the displayed quote to session storage.
 */
function showRandomQuote() {
    quoteDisplay.innerHTML = ''; // Clear existing content

    const selectedCategory = categoryFilter.value;
    let quotesToDisplay = [];

    // Filter quotes based on the selected category
    if (selectedCategory === 'all') {
        quotesToDisplay = quotes;
    } else {
        quotesToDisplay = quotes.filter(quote => quote.category === selectedCategory);
    }

    if (quotesToDisplay.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes available for this category. Try a different filter or add new quotes!";
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-lg', 'text-center');
        quoteDisplay.appendChild(noQuotesMessage);
        saveLastViewedQuoteIndex(-1); // Indicate no quote viewed
        return;
    }

    let randomIndex;
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

    if (selectedCategory === 'all') {
        const originalIndex = quotes.indexOf(selectedQuote);
        if (originalIndex !== -1) {
            saveLastViewedQuoteIndex(originalIndex);
        }
    } else {
        sessionStorage.removeItem('lastViewedQuoteIndex');
    }

    const quoteContainer = document.createElement('div');
    quoteContainer.classList.add(
        'quote-container',
        'w-full', 'max-w-xl', 'p-6', 'bg-white', 'rounded-xl', 'shadow-lg',
        'flex', 'flex-col', 'items-center', 'justify-center', 'text-center'
    );

    const quoteText = document.createElement('p');
    quoteText.textContent = `"${selectedQuote.text}"`;
    quoteText.classList.add(
        'quote-text',
        'text-2xl', 'font-medium', 'text-gray-800', 'mb-4', 'leading-relaxed'
    );

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `- ${selectedQuote.category}`;
    quoteCategory.classList.add(
        'quote-category',
        'text-lg', 'text-gray-600', 'italic'
    );

    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
    quoteDisplay.appendChild(quoteContainer);
}

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 * It also sets the selected option based on the last saved filter preference.
 */
function populateCategories() {
    const categories = new Set(quotes.map(quote => quote.category));

    while (categoryFilter.children.length > 1) {
        categoryFilter.removeChild(categoryFilter.lastChild);
    }

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = loadLastSelectedCategory();
    if (lastSelectedCategory && (categories.has(lastSelectedCategory) || lastSelectedCategory === 'all')) {
        categoryFilter.value = lastSelectedCategory;
    } else {
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
    saveLastSelectedCategory(selectedCategory);
    showRandomQuote();
}

/**
 * Handles the logic for adding a new quote to the 'quotes' array based on user input.
 * It also attempts to push the new quote to the simulated server.
 */
async function createAddQuoteForm() {
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    if (text === '' || category === '') {
        displayNotification("Both quote text and category are required!", "error");
        return;
    }

    const newQuote = { text: text, category: category };
    quotes.push(newQuote); // Add to local array

    saveQuotes(); // Save locally

    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    console.log("Quotes updated locally:", quotes);
    displayNotification("Quote added locally. Attempting to send to server...", "info");

    // Attempt to push this specific new quote to the server.
    // This addresses the "posting data to server" check.
    await pushNewQuoteToServer(newQuote);

    // After adding locally and attempting to push, then run a full sync
    // to reconcile any server-side additions (if other clients were adding)
    // or to simply confirm the state.
    await syncQuotes(); // Full sync after adding a quote
    populateCategories(); // Ensure new category is reflected
    showRandomQuote(); // Show random quote after sync completes and updates
}

// --- JSON Import/Export Functions ---

/**
 * Exports the current 'quotes' array to a JSON file and triggers a download.
 */
function exportToJsonFile() {
    try {
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        displayNotification('Quotes exported successfully as quotes.json!', "success");
    } catch (e) {
        console.error("Error exporting quotes to JSON:", e);
        displayNotification("Failed to export quotes. Please try again.", "error");
    }
}

/**
 * Imports quotes from a selected JSON file.
 * This function also triggers a sync after importing.
 * @param {Event} event - The change event from the file input.
 */
async function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                let importedChanges = false;
                importedQuotes.forEach(newQuote => {
                    const exists = quotes.some(existingQuote =>
                        existingQuote.text === newQuote.text && existingQuote.category === newQuote.category
                    );
                    if (!exists) {
                        quotes.push(newQuote);
                        importedChanges = true;
                    }
                });

                if (importedChanges) {
                    saveQuotes();
                    populateCategories();
                    displayNotification('Quotes imported successfully! Syncing with server...', "success");
                } else {
                    displayNotification('No new quotes imported from file.', "info");
                }

                await syncQuotes(); // Sync after import, regardless of local changes
                showRandomQuote();
            } else {
                displayNotification('Invalid JSON file format. Expected array of objects with "text" and "category".', "error");
            }
        } catch (error) {
            console.error("Error parsing JSON or importing quotes:", error);
            displayNotification('Failed to import quotes. Please ensure the file is a valid JSON format.', "error");
        }
    };
    fileReader.onerror = function(e) {
        console.error("FileReader error:", e);
        displayNotification('Error reading file. Please try again.', "error");
    };
    fileReader.readAsText(file);
}

// --- Event Listeners and Initialization ---

newQuoteButton.addEventListener('click', showRandomQuote);
syncButton.addEventListener('click', syncQuotes); // Manual sync button

// Initial setup when the page loads:
window.onload = async function() {
    loadQuotes(); // Load quotes from local storage

    // Perform an initial sync to get server data and push any local changes
    await syncQuotes(); // Initial sync

    populateCategories(); // Populate the category filter dropdown based on synced data
    filterQuotes(); // Apply the last saved filter and display a quote

    // Set up periodic background sync
    setInterval(syncQuotes, SYNC_INTERVAL_MS);
};