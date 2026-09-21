// ===========================================================================
// CONFIGURATION: Easily edit your announcement text or set custom holidays here
// ===========================================================================

// 1. Sliding Red Bar Announcement Message
const ANNOUNCEMENT_TEXT = "Adv. Science 3: ESS - Finish the pre-lab part of the packet given on 2026-09-17 by start of class on 2026-09-22.";

// 2. Set to 'true' if you want to manually trigger "NO SCHOOL TODAY" for holidays/snow days
const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; // Reason displayed when IS_HOLIDAY is true

// 3. Optional list of specific holiday dates (YYYY-MM-DD)
const SPECIFIC_HOLIDAYS = [
    "2026-09-21", // No School
    "2026-10-16", // No School
    "2026-11-02", // No School - MP1 Grading
    "2026-11-03", // No School - Election Day
    "2026-11-26", // Thanksgiving
    "2026-12-25", // Christmas
    "2027-01-01"  // New Year's Day
];

// ===========================================================================
// AUTOMATIC DATE & NO-SCHOOL LOGIC
// ===========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Set Marquee Text
    const marqueeElement = document.getElementById("marqueeText");
    if (marqueeElement) {
        marqueeElement.textContent = ANNOUNCEMENT_TEXT;
    }

    // 2. Get today's local date based on user's timezone
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

    // 3. Check for Weekend or Holiday condition
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
