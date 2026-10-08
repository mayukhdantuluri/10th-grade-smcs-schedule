// Annoucements to be manually changed by me
const ANNOUNCEMENTS = [
    {
        title: "SMCS 2029 News",
        detail: "Permission forms for Seneca Creek have been given out. Fill them out & return them by TOMORROW, and pay the 38.25 USD cost on SchoolCash Online OR cash."
    },
    {
        title: "Foundations of Technology",
        detail: "Mr. Lees is out tomorrow. Upload your journal entries for Survivor Island tomorrow to receive credit."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "The GuessBirthday code is due today by end of class."
    },
    {
        title: "Adv. Science 3: ESS",
        detail: "Mr. Kingman will be out tomorrow. Finish the Groundwater Contamination Packet in class."
    },
    {
        title: "Foundations of Technology",
        detail: "The plan for the Survivor Island challenge is to finish it by next week THURSDAY."
    },
    {
        title: "Foundations of Technology",
        detail: "The Discover Engineering assignment is due by end of day on SUNDAY."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "The Unit 1 Test will be in class on TUESDAY. There will be an MCQ and FRQ section."
    },
    {
        title: "Algorithms & Data Structures",
        detail: "On the Unit 1 Test, for the FRQ section, you won't be allowed to run the code to make sure it works."
    },
    {
        title: "Adv. Science 4: Biology",
        detail: "The Carbohydrates, Lipids & Proteins Unit Test will be next week on THURSDAY."
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
    "2026-12-28",
    "2026-12-29",
    "2026-12-30",
    "2026-12-31",
    "2027-01-01",
    "2027-01-18",
    "2027-01-25",
    "2027-02-15",
    "2027-03-09",
    "2027-03-26",
    "2027-03-29",
    "2027-03-30",
    "2027-03-31",
    "2027-04-01",
    "2027-04-02",
    "2027-04-12",
    "2027-04-22",
    "2027-05-17",
    "2027-05-31"
];

// Live clock in 24-hour format
function updateClock() {
    const timeDisplay = document.getElementById("timeDisplay");
    if (!timeDisplay) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Date updater
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

// News Banner animation
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

    // 2. Measure required target dimensions
    banner.style.transition = 'none';
    banner.style.width = 'max-content';
    banner.style.height = 'auto';

    const measuredWidth = banner.getBoundingClientRect().width;
    const measuredHeight = banner.getBoundingClientRect().height;

    const targetWidth = Math.min(measuredWidth, window.innerWidth * 0.96);
    const targetHeight = Math.max(measuredHeight, 62);

    // 3. Reset to collapsed 50x50 circle
    banner.style.width = '50px';
    banner.style.height = '50px';
    banner.style.borderRadius = '25px';
    banner.classList.remove("show-text");
    void banner.offsetWidth; // Force synchronous layout reflow

    // --- EXPANSION TRANSITIONS ---
    banner.style.transition = 'width 0.55s cubic-bezier(0.25, 1, 0.5, 1), height 0.45s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.45s cubic-bezier(0.25, 1, 0.5, 1)';

    // Step 1: Horizontal expansion begins immediately (t = 0s)
    requestAnimationFrame(() => {
        banner.style.width = `${targetWidth}px`;
    });

    // Step 2: Vertical expansion begins 0.1s (100ms) after horizontal expansion
    setTimeout(() => {
        banner.style.height = `${targetHeight}px`;
        banner.style.borderRadius = `${targetHeight / 2}px`;

        // Fade in text as vertical opening completes
        setTimeout(() => {
            banner.classList.add("show-text");
        }, 200);

    }, 100); // Max 0.1s time difference

    // --- HOLD & SHRINK PHASE ---
    setTimeout(() => {
        // Step A: Fade out text
        banner.classList.remove("show-text");

        setTimeout(() => {
            banner.style.transition = 'height 0.45s cubic-bezier(0.25, 1, 0.5, 1), width 0.55s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.45s cubic-bezier(0.25, 1, 0.5, 1)';

            // Step B: Vertical shrink starts first
            banner.style.height = '50px';
            banner.style.borderRadius = '25px';

            // Step C: Horizontal shrink starts 0.1s (100ms) after vertical shrink
            setTimeout(() => {
                banner.style.width = '50px';

                // Step D: Pause for ~0.4s in circle state (under 0.5s max limit)
                setTimeout(() => {
                    currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                    cycleXboxBanner();
                }, 800); // 100ms start + 550ms width transition finishes at 650ms. 650ms + 300ms pause = 950ms total delay.

            }, 100); // Max 0.1s time difference

        }, 200); // Wait for text fade-out

    }, 6500); // Message display hold duration
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    cycleXboxBanner();
});
