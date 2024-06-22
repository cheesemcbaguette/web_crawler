export { printReport, sortPages  };

// Function to sort pages by the number of inbound internal links
function sortPages(pages) {
    // Convert the pages object into an array of [url, count] pairs
    const pagesArray = Object.entries(pages);
    
    // Sort the array by count in descending order
    pagesArray.sort((a, b) => b[1] - a[1]);

    return pagesArray;
}

// Function to print the report
function printReport(pages) {
    console.log('Starting the report...');

    // Sort the pages
    const sortedPages = sortPages(pages);

    // Print each page in a formatted way
    for (const [url, count] of sortedPages) {
        console.log(`Found ${count} internal links to ${url}`);
    }
}

