// ===========================================================================
// 1. ANNOUNCEMENTS CONFIGURATION (Manually managed by you)
// ===========================================================================

const ANNOUNCEMENTS = [
    {
        title: "Website Info",
        detail: "- Don't worry about the 00:00:00. That's just a feature that wasn't fixed yet."
    },
    {
        title: "Adv. Science 3: ESS",
        detail: "- Mr. Kingman said our field trip might be on 2026-10-23. Permissions forms are yet to be sent out."
    },
    {
        title: "Adv. Science 4: Biology",
        detail: "- If you didn't do good during the original quiz from 2026-09-10, reassessments are to be done in lunch either today, tomorrow, Monday, or Tuesday."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "- We will have a guest speaker today. Report to the ISP Hub whenever you have Ms. Hallisey's class."
    }
];

const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; 

const SPECIFIC_HOLIDAYS = [
    "2026-11-26",
    "2026-12-25",
    "2027-01-01"
];

function updateClock() {
    const timeDisplay = document.getElementById("timeDisplay");
    if (!timeDisplay) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}
// ===========================================================================
// XBOX POP-UP BANNER ANIMATION LOOP
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    const currentItem = ANNOUNCEMENTS[currentAnnouncementIndex];

    // Inject structured HTML so only title is bolded
    textElement.innerHTML = `<span class="xbox-title">${currentItem.title}</span><span class="xbox-detail">${currentItem.detail}</span>`;

    // 1. Calculate dynamic target width based on text length
    banner.style.transition = 'none';
    banner.style.width = 'auto';
    banner.style.maxWidth = '92vw'; // Prevents overflowing small screens
    
    const targetWidth = banner.getBoundingClientRect().width;

    // Reset back to collapsed 50px state
    banner.style.width = '50px';
    
    // Force layout update before starting animation
    void banner.offsetWidth;

    // Re-enable smooth 0.75-second transition
    banner.style.transition = 'width 0.75s cubic-bezier(0.25, 1, 0.5, 1)';

    // Step 1: Smoothly expand bar over 0.75 seconds
    requestAnimationFrame(() => {
        banner.style.width = `${targetWidth}px`;
    });

    // Step 2: Fade in text halfway through expansion
    setTimeout(() => {
        banner.classList.add("show-text");
    }, 400);

    // Step 3: Display message for 5.5 seconds
    setTimeout(() => {
        // Fade out text first
        banner.classList.remove("show-text");

        // Step 4: Smoothly shrink bar back to square/circle over 0.75 seconds
        setTimeout(() => {
            banner.style.width = '50px';

            // Step 5: Wait for collapse transition (750ms) to finish, then trigger next message
            setTimeout(() => {
                currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                cycleXboxBanner();
            }, 800);

        }, 300);

    }, 5500);
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
