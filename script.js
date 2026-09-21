// ===========================================================================
// CONFIGURATION
// ===========================================================================

// Array of announcements to loop through in the Xbox popup bar
const ANNOUNCEMENTS = [
    "Adv. Science 3: ESS - Finish the pre-lab part of the packet given on 2026-09-17 by start of class on 2026-09-22.",
    "Adv. Science 4: Biology - Finish the Calorimetry Pre-Lab Questions on a document on your Google Drive, have it ready by start of class 2026-09-22.",
    "Algorithms & Data Structures - There is a Not-a-Quiz on 1.11 and 1.12 in class on 2026-09-22."
];

const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; 

const SPECIFIC_HOLIDAYS = [
    "2026-09-21",
    "2026-11-26",
    "2026-12-25",
    "2027-01-01"
];

// ===========================================================================
// XBOX POP-UP BANNER ANIMATION LOOP
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    textElement.textContent = ANNOUNCEMENTS[currentAnnouncementIndex];

    // 1. Expand bar
    banner.classList.add("expanded");

    // 2. Fade in text
    setTimeout(() => {
        banner.classList.add("show-text");
    }, 400);

    // 3. Hold on screen for 5 seconds, then fade out text
    setTimeout(() => {
        banner.classList.remove("show-text");

        // 4. Collapse bar
        setTimeout(() => {
            banner.classList.remove("expanded");

            // 5. Next announcement iteration
            setTimeout(() => {
                currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                cycleXboxBanner();
            }, 800);

        }, 300);

    }, 5000);
}

// ===========================================================================
// AUTOMATIC DATE & NO-SCHOOL LOGIC
// ===========================================================================

document.addEventListener("DOMContentLoaded", () => {

    cycleXboxBanner();

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekName = daysOfWeek[now.getDay()];

    const dateDisplay = document.getElementById("dateDisplay");
    const dayDisplay = document.getElementById("dayDisplay");

    if (dateDisplay) dateDisplay.textContent = formattedDate;
    if (dayDisplay) dayDisplay.textContent = dayOfWeekName;

    const isWeekend = (now.getDay() === 0 || now.getDay() === 6);
    const isSpecificHoliday = SPECIFIC_HOLIDAYS.includes(formattedDate);

    const scheduleContainer = document.getElementById("scheduleContainer");
    const noSchoolBanner = document.getElementById("noSchoolBanner");
    const noSchoolReason = document.getElementById("noSchoolReason");

    if (isWeekend || IS_HOLIDAY || isSpecificHoliday) {
        if (scheduleContainer) scheduleContainer.style.display = "none";
        if (noSchoolBanner) noSchoolBanner.style.display = "block";

        if (isWeekend) {
            if (noSchoolReason) noSchoolReason.textContent = "Weekend - No School Today!";
        } else if (IS_HOLIDAY) {
            if (noSchoolReason) noSchoolReason.textContent = HOLIDAY_REASON;
        } else if (isSpecificHoliday) {
            if (noSchoolReason) noSchoolReason.textContent = "School Holiday!";
        }
    }
});
