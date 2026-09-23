// ===========================================================================
// 1. ANNOUNCEMENTS CONFIGURATION (Manually managed by you)
// ===========================================================================

const ANNOUNCEMENTS = [
    {
        title: "Adv. Science 3: ESS",
        detail: "- Mr. Kingman said our field trip might be on 2026-10-23. Permissions forms are yet to be sent out."
    },
    {
        title: "Adv. Science 4: Biology",
        detail: "- Finish the Calorimetry Lab by end of class tomorrow."
    },
    {
        title: "Foundations of Technology",
        detail: "- Mr. Lees is not here tomorrow. Today in class, he gave you (or someone in your group) the third sensor to research for the Sensor Assignment."
    },
    {
        title: "Website News",
        detail: "- Website shouldn't be manually updated now. Now I import from the Google Sheets"
    }
];

// ===========================================================================
// 2. GOOGLE SHEET & COURSE MAPPING CONFIGURATION
// ===========================================================================

// Converted your Google Sheet web page link into a direct live CSV data feed
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRQurR8W4u5YTsrrjvDMJqJjDKzbzFVwLKEMuXOd8L2lK4YHN2L3rLb6mR4kXUOMi3hJ--ypSHQJ3z/pub?gid=627232616&single=true&output=csv";

// Course Abbreviation Mappings
const COURSE_MAP = {
    "bio": "Adv. Science 4: Biology",
    "ess": "Adv. Science 3: ESS",
    "cs": "Algorithms & Data Structures",
    "fot": "Foundations of Technology"
};

// Default room and teacher mappings for rendering
const ROOM_MAP = {
    "Adv. Science 4: Biology": "2614 Yu",
    "Adv. Science 3: ESS": "1708 Kingman",
    "Algorithms & Data Structures": "1702 Hallisey",
    "Foundations of Technology": "1620 Lees"
};

// Manual Holiday / No School Override (optional)
const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; 

// ===========================================================================
// 3. XBOX POP-UP BANNER ANIMATION LOOP
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    const currentItem = ANNOUNCEMENTS[currentAnnouncementIndex];
    textElement.innerHTML = `<span class="xbox-title">${currentItem.title}</span><span class="xbox-detail">${currentItem.detail}</span>`;

    // Measure target width based on text
    banner.style.transition = 'none';
    banner.style.width = 'auto';
    banner.style.maxWidth = '92vw';
    
    const targetWidth = banner.getBoundingClientRect().width;

    banner.style.width = '50px';
    void banner.offsetWidth; // Force redraw

    banner.style.transition = 'width 0.75s cubic-bezier(0.25, 1, 0.5, 1)';

    requestAnimationFrame(() => {
        banner.style.width = `${targetWidth}px`;
    });

    setTimeout(() => {
        banner.classList.add("show-text");
    }, 400);

    setTimeout(() => {
        banner.classList.remove("show-text");

        setTimeout(() => {
            banner.style.width = '50px';

            setTimeout(() => {
                currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                cycleXboxBanner();
            }, 800);

        }, 300);

    }, 5500);
}

// ===========================================================================
// 4. LIVE SCHEDULE AUTO-UPDATER FROM GOOGLE SHEETS
// ===========================================================================

// Simple CSV line parser
function parseCSV(text) {
    const lines = text.split('\n');
    return lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
}

// Convert shorthand key to full name
function formatCourseName(key) {
    if (!key) return "No Class / Free Period";
    const cleanKey = key.toLowerCase().trim();
    return COURSE_MAP[cleanKey] || key; // Returns mapped name or raw text if already full name
}

async function fetchAndApplySchedule() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const formattedDateISO = `${year}-${month}-${day}`; // YYYY-MM-DD
    const formattedDateUS = `${now.getMonth() + 1}/${now.getDate()}/${year}`; // M/D/YYYY
    
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekName = daysOfWeek[now.getDay()];

    // Render Date Header
    const dateDisplay = document.getElementById("dateDisplay");
    const dayDisplay = document.getElementById("dayDisplay");
    if (dateDisplay) dateDisplay.textContent = formattedDateISO;
    if (dayDisplay) dayDisplay.textContent = dayOfWeekName;

    const scheduleContainer = document.getElementById("scheduleContainer");
    const noSchoolBanner = document.getElementById("noSchoolBanner");
    const noSchoolReason = document.getElementById("noSchoolReason");

    // Check Weekend or Manual Holiday
    if (now.getDay() === 0 || now.getDay() === 6 || IS_HOLIDAY) {
        if (scheduleContainer) scheduleContainer.style.display = "none";
        if (noSchoolBanner) noSchoolBanner.style.display = "block";
        if (noSchoolReason) noSchoolReason.textContent = IS_HOLIDAY ? HOLIDAY_REASON : "Weekend - No School Today!";
        return;
    }

    try {
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch sheet");
        
        const csvData = await response.text();
        const rows = parseCSV(csvData);

        // Find row matching today's date (searches YYYY-MM-DD or M/D/YYYY format)
        let todayRow = rows.find(row => row[0].includes(formattedDateISO) || row[0].includes(formattedDateUS));

        if (!todayRow) {
            // Default active day schedule fallback if date row isn't explicitly listed in sheet
            return;
        }

        // Check if sheet row explicitly marks "No School" or "Holiday"
        if (todayRow[1] && (todayRow[1].toLowerCase().includes("no school") || todayRow[1].toLowerCase().includes("holiday"))) {
            if (scheduleContainer) scheduleContainer.style.display = "none";
            if (noSchoolBanner) noSchoolBanner.style.display = "block";
            if (noSchoolReason) noSchoolReason.textContent = todayRow[1];
            return;
        }

    } catch (error) {
        console.warn("Using default schedule (Google Sheet offline or fetching issue):", error);
    }
}

// ===========================================================================
// 5. INITIALIZATION
// ===========================================================================

document.addEventListener("DOMContentLoaded", () => {
    cycleXboxBanner();
    fetchAndApplySchedule();
});
