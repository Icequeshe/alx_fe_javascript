// Array to store quote objects. Each object has a 'text' and a 'category'.
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Get the DOM element where quotes will be displayed.
const quoteDisplay = document.getElementById('quoteDisplay');
// Get the button to show a new quote.
const newQuoteButton = document.getElementById('newQuote');
// Get input fields for adding new quotes.
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' element.
 * If the quotes array is empty, it displays a message indicating no quotes are available.
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
        noQuotesMessage.textContent = "No quotes available. Add some quotes!";
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-lg', 'text-center');
        quoteDisplay.appendChild(noQuotesMessage);
        return; // Exit the function if no quotes are present.
    }

    // Generate a random index to select a quote from the array.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

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
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * It validates the input fields to ensure they are not empty before adding.
 * After adding, it clears the input fields and displays a new random quote.
 *
 * This function demonstrates:
 * - Accessing input values (`inputElement.value`).
 * - Basic input validation.
 * - Modifying an array (`array.push`).
 * - Clearing input fields.
 * - Re-rendering dynamic content by calling `showRandomQuote()`.
 */
function addQuote() {
    // Get the trimmed values from the input fields.
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Perform basic validation to ensure both fields are not empty.
    if (text === '' || category === '') {
        // In a real application, you might display a user-friendly error message in the UI.
        console.error("Both quote text and category are required!");
        alert("Please enter both a quote and a category."); // Using alert for simplicity as per common practice, though a custom modal is preferred in production.
        return; // Stop the function if validation fails.
    }

    // Create a new quote object.
    const newQuote = { text: text, category: category };
    // Add the new quote to the 'quotes' array.
    quotes.push(newQuote);

    // Clear the input fields after adding the quote for a better user experience.
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Log the updated quotes array to the console for debugging purposes.
    console.log("Quotes updated:", quotes);

    // Immediately show a random quote, which might be the newly added one.
    showRandomQuote();
}

// Add an event listener to the "Show New Quote" button.
// When clicked, the showRandomQuote function will be executed.
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial call to display a quote when the page loads.
// This ensures the user sees content immediately.
window.onload = showRandomQuote;
