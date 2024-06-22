import {crawlPage  } from "./crawl.js";
import { printReport } from './report.js';

async function main() {
    // Process command line arguments
    const args = process.argv.slice(2); // Get arguments passed to the script while skipping the first two (aka run and start)

    // Check the number of arguments
    if (args.length < 1) {
        console.error('Error: No base URL provided.');
        process.exit(1);
    } else if (args.length > 1) {
        console.error('Error: Too many arguments provided.');
        process.exit(1);
    }

    // Extract the base URL
    const baseURL = args[0];

    // Print a message indicating the crawler is starting
    console.log(`Starting the crawler at ${baseURL}`);

    // Start crawling from the base URL
    const pages = await crawlPage(baseURL);
    
    printReport(pages);
}
  
main()