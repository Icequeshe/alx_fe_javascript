// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// Select DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
const categorySelect = document.getElementById('categorySelect');

// Function to display a random quote based on selected category
function showRandomQuote() {
  let selectedCategory = categorySelect.value;

  // Filter quotes based on selected category
  let filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());

  // Display message if no quotes found
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available for this category.';
    return;
  }

  // Select random quote
  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let randomQuote = filteredQuotes[randomIndex];

  // Update DOM
  quoteDisplay.innerText = randomQuote.text;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  // Check for empty input
  if (newQuoteText === '' || newQuoteCategory === '') {
    alert('Please enter both a quote and a category.');
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Check if category exists in the dropdown
  let categoryExists = false;
  for (let i = 0; i < categorySelect.options.length; i++) {
    if (categorySelect.options[i].value.toLowerCase() === newQuoteCategory.toLowerCase()) {
      categoryExists = true;
      break;
    }
  }

  // If category is new, add it to the dropdown
  if (!categoryExists) {
    let newOption = document.createElement('option');
    newOption.value = newQuoteCategory;
    newOption.innerText = newQuoteCategory;
    categorySelect.appendChild(newOption);
  }

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert('Quote added successfully!');
}

// Initialize default categories
function initializeCategories() {
  let defaultCategories = ['Motivation', 'Inspiration', 'Success'];
  defaultCategories.forEach(cat => {
    let option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    categorySelect.appendChild(option);
  });
}

// Run category initialization
initializeCategories();

// Event listener for "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for "Add Quote" button
addQuoteButton.addEventListener('click', addQuote);
