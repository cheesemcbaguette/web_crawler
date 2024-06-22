export { normalizeURL, getURLsFromHTML, crawlPage  };

import { JSDOM } from 'jsdom'

function normalizeURL(url) {
    try {
        // Parse the URL using the URL constructor
        const parsedURL = new URL(url);
        
        // Extract the hostname and pathname, convert hostname to lowercase
        let hostname = parsedURL.hostname.toLowerCase();
        let pathname = parsedURL.pathname;

        // Remove the trailing slash from the pathname if it exists
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }

        // Combine the hostname and pathname for the normalized URL
        const normalizedURL = `${hostname}${pathname}`;
        
        return normalizedURL;
    } catch (e) {
        // Handle invalid URL input
        console.error('Invalid URL:', e);
        return null;
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    // Parse the HTML string into a DOM object
    const dom = new JSDOM(htmlBody);
    
    // Extract the document object from the DOM
    const document = dom.window.document;
    
    // Select all <a> (anchor) elements in the document
    const anchorElements = document.querySelectorAll('a');
    
    // Initialize an array to hold the URLs
    const urls = [];

    // Iterate over each <a> element
    anchorElements.forEach(anchor => {
        // Get the href attribute of the anchor element
        let href = anchor.href;
        
        // If the href starts with '/', it's a relative URL
        if (href.startsWith('/')) {
            // Convert the relative URL to an absolute URL using the baseURL
            href = new URL(href, baseURL).href;
        }
        
        // Add the URL to the array
        urls.push(href);
    });

    // Return the array of URLs
    return urls;
}

// Recursive function to crawl pages
async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
    // Check if currentURL is on the same domain as baseURL
    const base = new URL(baseURL);
    const current = new URL(currentURL);
    if (base.origin !== current.origin) {
        return pages;
    }

    // Normalize the current URL
    const normalizedURL = normalizeURL(currentURL);

    // If the URL is already in pages, increment the count and return
    if (pages[normalizedURL]) {
        pages[normalizedURL]++;
        return pages;
    }

    // Add the URL to pages with a count of 1
    pages[normalizedURL] = 1;

    // Fetch the HTML of the current URL
    const htmlBody = await fetchPageHTML(currentURL);
    if (!htmlBody) {
        return pages;
    }

    // Extract URLs from the HTML
    const urls = getURLsFromHTML(htmlBody, baseURL);

    // Recursively crawl each URL
    for (const url of urls) {
        await crawlPage(baseURL, url, pages);
    }

    return pages;
}

// Helper function to fetch the HTML of a page
async function fetchPageHTML(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error: Received status code ${response.status} for URL: ${url}`);
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            console.error(`Error: Received non-HTML content type ${contentType} for URL: ${url}`);
            return null;
        }

        const htmlBody = await response.text();
        return htmlBody;
    } catch (error) {
        console.error(`Error: Failed to fetch ${url} - ${error.message}`);
        return null;
    }
}