// ===========================================================================
// 1. ANNOUNCEMENTS CONFIGURATION (Manually managed by the website owner)
// ===========================================================================

const ANNOUNCEMENTS = [
    {
        title: "SMCS 2029 News",
        detail: "Permission forms for Seneca Creek have been given out. Fill them out & return them by THIS FRIDAY, and pay the 38.25 USD cost on SchoolCash Online OR cash."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "The 1.15 Not-a-Quiz will be in class on Tuesday."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "The Unit 1 Quiz will be in class on 2026-10-13. It might be two different days (One for MCQs, one for FRQs) or a double period to finish both."
    },
    {
        title: "Foundations of Technology",
        detail: "The Discover Engineering assignment is due by end of day on Monday."
    },
    {
        title: "Foundations of Technology",
        detail: "Once you get a working Roomba, have ONE group member upload the code to the Canvas assignment & submit."
    },
];

const IS_HOLIDAY = false; 
const HOLIDAY_REASON = "School Holiday"; 

const SPECIFIC_HOLIDAYS = [
    "2026-10-16",
    "2026-11-02",
    "2026-11-03",
    "2026-11-26",
    "2026-11-27",
    "2026-12-24",
    "2026-12-25",
    "2027-01-01"
];

// ===========================================================================
// 2. LIVE 24-HOUR CLOCK (hh:mm:ss)
// ===========================================================================

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
// 3. DATE UPDATER & WEEKEND TOGGLE
// ===========================================================================

function updateDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDateISO = `${year}-${month}-${day}`;
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekName = daysOfWeek[now.getDay()];

    const dateDisplay = document.getElementById("dateDisplay");
    const dayDisplay = document.getElementById("dayDisplay");

    if (dateDisplay) dateDisplay.textContent = formattedDateISO;
    if (dayDisplay) dayDisplay.textContent = dayOfWeekName;

    const scheduleContainer = document.getElementById("scheduleContainer");
    const noSchoolBanner = document.getElementById("noSchoolBanner");
    const noSchoolReason = document.getElementById("noSchoolReason");

    if (now.getDay() === 0 || now.getDay() === 6) {
        if (scheduleContainer) scheduleContainer.style.display = "none";
        if (noSchoolBanner) noSchoolBanner.style.display = "block";
        if (noSchoolReason) noSchoolReason.textContent = "Weekend - No School Today!";
    } else {
        if (scheduleContainer) scheduleContainer.style.display = "block";
        if (noSchoolBanner) noSchoolBanner.style.display = "none";
    }
}

// ===========================================================================
// 4. ULTRA-SMOOTH TWO-PHASE BANNER ANIMATION
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    // 1. Inject announcement content
    const currentItem = ANNOUNCEMENTS[currentAnnouncementIndex];
    textElement.innerHTML = `
        <div class="xbox-title">${currentItem.title}</div>
        <div class="xbox-detail">${currentItem.detail}</div>
    `;

    // 2. Measure dimensions
    banner.style.transition = 'none';
    banner.style.width = 'max-content';
    banner.style.height = 'auto';

    const measuredWidth = banner.getBoundingClientRect().width;
    const measuredHeight = banner.getBoundingClientRect().height;

    const targetWidth = Math.min(measuredWidth, window.innerWidth * 0.96);
    const targetHeight = Math.max(measuredHeight, 62);

    // 3. Reset to collapsed state
    banner.style.width = '50px';
    banner.style.height = '50px';
    banner.style.borderRadius = '25px';
    banner.classList.remove("show-text");
    void banner.offsetWidth; // Force synchronous reflow

    // --- EXPANSION PHASE ---
    // Smooth custom fluid deceleration curve
    banner.style.transition = 'width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.35s cubic-bezier(0.16, 1, 0.3, 1)';

    // Step 1: Expand horizontally first
    requestAnimationFrame(() => {
        banner.style.width = `${targetWidth}px`;
        banner.style.height = '50px';
        banner.style.borderRadius = '25px';
    });

    // Step 2: Expand vertically smoothly at horizontal completion
    setTimeout(() => {
        banner.style.height = `${targetHeight}px`;
        banner.style.borderRadius = `${targetHeight / 2}px`;

        // Smoothly fade in text during vertical opening
        setTimeout(() => {
            banner.classList.add("show-text");
        }, 100);

    }, 400);

    // --- HOLD & SHRINK PHASE ---
    setTimeout(() => {
        // Step A: Fade out text
        banner.classList.remove("show-text");

        setTimeout(() => {
            // Easing for shrinking back down
            banner.style.transition = 'height 0.32s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.32s cubic-bezier(0.4, 0, 0.2, 1)';

            // Step B: Shrink vertically first
            banner.style.height = '50px';
            banner.style.borderRadius = '25px';

            setTimeout(() => {
                // Step C: Shrink horizontally back to circle
                banner.style.width = '50px';

                // Step D: Trigger next item cycle
                setTimeout(() => {
                    currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                    cycleXboxBanner();
                }, 420);

            }, 300);

        }, 180);

    }, 6000);
}

// ===========================================================================
// 5. INITIALIZATION
// ===========================================================================

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    cycleXboxBanner();
});
