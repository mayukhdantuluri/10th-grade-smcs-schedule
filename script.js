// ===========================================================================
// CONFIGURATION
// ===========================================================================

// 1. Array of messages for the Xbox pop-up banner (Add, edit, or remove as many as you want)
const ANNOUNCEMENTS = [
    "Adv. Science 3: ESS - Finish the pre-lab part of the packet given on 2026-09-17 by start of class on 2026-09-22.",
    "Adv. Science 4: Biology - Finish the Calorimetry Pre-Lab Questions on a document in Google Drive & have it ready by class on 2026-09-22.",
    "Algorithms & Data Structures - There is a Not-a-Quiz on 1.11 and 1.12 in class on 2026-09-22.",
];

// 2. Set to 'true' if you want to manually trigger "NO SCHOOL TODAY"
const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; 

// 3. Optional list of specific holiday dates (YYYY-MM-DD)
const SPECIFIC_HOLIDAYS = [
    "2026-09-21", // No School
    "2026-11-26", // Thanksgiving
    "2026-12-25", // Christmas
    "2027-01-01"  // New Year's Day
];

// ===========================================================================
// XBOX POP-UP BANNER ANIMATION LOOP
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    // Set text for current loop iteration
    textElement.textContent = ANNOUNCEMENTS[currentAnnouncementIndex];

    // Step 1: Expand the red bar
    banner.classList.add("expanded");

    // Step 2: Fade in the text after bar expands
    setTimeout(() => {
        banner.classList.add("show-text");
    }, 400);

    // Step 3: Hold on screen for 5 seconds, then fade out text
    setTimeout(() => {
        banner.classList.remove("show-text");

        // Step 4: Collapse bar back into circle logo
        setTimeout(() => {
            banner.classList.remove("expanded");

            // Step 5: Wait for collapse animation to finish, then start next message
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

    // Start Xbox Pop-up Loop
    cycleXboxBanner();

    // Get today's local date based on user's timezone
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Format YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    // Get Day of Week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekName = daysOfWeek[now.getDay()];

    // Display Date and Day of Week
    const dateDisplay = document.getElementById("dateDisplay");
    const dayDisplay = document.getElementById("dayDisplay");

    if (dateDisplay) dateDisplay.textContent = formattedDate;
    if (dayDisplay) dayDisplay.textContent = dayOfWeekName;

    // Check for Weekend or Holiday condition
    const isWeekend = (now.getDay() === 0 || now.getDay() === 6); // 0 = Sunday, 6 = Saturday
    const isSpecificHoliday = SPECIFIC_HOLIDAYS.includes(formattedDate);

    const scheduleContainer = document.getElementById("scheduleContainer");
    const noSchoolBanner = document.getElementById("noSchoolBanner");
    const noSchoolReason = document.getElementById("noSchoolReason");

    if (isWeekend || IS_HOLIDAY || isSpecificHoliday) {
        // Hide schedule, show No School message
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
