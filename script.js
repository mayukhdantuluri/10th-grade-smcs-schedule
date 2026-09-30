// ===========================================================================
// 1. ANNOUNCEMENTS CONFIGURATION (Manually managed by you)
// ===========================================================================

const ANNOUNCEMENTS = [
    {
        title: "",
        detail: "Our field trip to Seneca Creek is on 2026-10-23 from 7:45 AM to 2:15 PM. Permission forms have been given out. The cost is 38.25 USD."
    },
    {
        title: "Adv. Science 4: Biology",
        detail: "If you bombed the quiz from 2026-09-10, the final reassessment opportunities are today in Falcon Time & at Lunch."
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

    // Weekend Check: hide schedule grid, show banner, keep time visible
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
// 4. XBOX POP-UP BANNER ANIMATION LOOP
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    const currentItem = ANNOUNCEMENTS[currentAnnouncementIndex];
    textElement.innerHTML = `<span class="xbox-title">${currentItem.title}</span><span class="xbox-detail">${currentItem.detail}</span>`;

    banner.style.transition = 'none';
    banner.style.width = 'auto';
    banner.style.maxWidth = '92vw';
    
    const targetWidth = banner.getBoundingClientRect().width;

    banner.style.width = '50px';
    void banner.offsetWidth;

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
// 5. INITIALIZATION
// ===========================================================================

updateClock();
updateDate();

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    cycleXboxBanner();
});
