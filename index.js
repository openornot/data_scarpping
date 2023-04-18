const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });


    const page = await browser.newPage();
    await page.goto('https://www.glassdoor.co.in/Job/software-engineer-jobs-SRCH_KO0,17.htm?context=Jobs&clickSource=searchBox');


    // Extract job titles and job locations
    const jobTitles = await page.$$eval('.exy0tjh5 div > a > span', titles => titles.map(title => title.textContent.trim()));
    const jobLocations = await page.$$eval('.exy0tjh5 div > span', locations => locations.map(location => location.textContent.trim()));


    // Create an array of job objects
    const jobsData = [];
    for (let i = 0; i < jobTitles.length; i++) {
        const job = {
            title: jobTitles[i],
            location: jobLocations[i]
        };
        jobsData.push(job);
    }


    // Convert jobsData to CSV string
    let csvContent = "Title,Location\n";
    for (const job of jobsData) {
        csvContent += `${job.title},${job.location}\n`;
    }


    // Write CSV string to a file
    fs.writeFileSync('jobs.csv', csvContent, 'utf-8');


    console.log('CSV file written successfully.');


    // Close the browser
    await browser.close();
})();