// ===========================================================================
// 1. DYNAMIC DATA LOADER FROM data.json
// ===========================================================================

let ANNOUNCEMENTS = [];

async function loadSiteData() {
    try {
        let response = await fetch('data.json?v=' + Date.now());
        let data = await response.json();
        
        ANNOUNCEMENTS = data.announcements || [];
        
        // Populate Block X Members
        const blockXList = document.querySelector('.content-grid .card:nth-child(1) .members-list');
        if (blockXList && data.blockXMembers) {
            blockXList.innerHTML = data.blockXMembers.map(name => `<li>${name}</li>`).join('');
        }

        // Populate Block Y Members
        const blockYList = document.querySelector('.content-grid .card:nth-child(3) .members-list');
        if (blockYList && data.blockYMembers) {
            blockYList.innerHTML = data.blockYMembers.map(name => `<li>${name}</li>`).join('');
        }

        // Populate Block Schedule Grid
        if (data.schedule) {
            const scheduleGrid = document.querySelector('.schedule-grid');
            if (scheduleGrid) {
                let gridHTML = `
                    <div class="col-header">Block X</div>
                    <div class="col-header">Period</div>
                    <div class="col-header">Block Y</div>
                `;
                data.schedule.forEach(s => {
                    gridHTML += `
                        <div class="class-cell">
                            <span class="class-title">${s.blockXTitle}</span>
                            <span class="class-room">${s.blockXRoom}</span>
                        </div>
                        <div class="period-num">${s.period}</div>
                        <div class="class-cell">
                            <span class="class-title">${s.blockYTitle}</span>
                            <span class="class-room">${s.blockYRoom}</span>
                        </div>
                    `;
                });
                scheduleGrid.innerHTML = gridHTML;
            }
        }

        // Trigger banner once data is loaded
        cycleXboxBanner();
    } catch (e) {
        console.error("Failed to load data.json", e);
    }
}

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
// 4. PRECISION TIMED BANNER ANIMATION
// ===========================================================================

let currentAnnouncementIndex = 0;

function cycleXboxBanner() {
    const banner = document.getElementById("xboxBanner");
    const textElement = document.getElementById("xboxText");

    if (!banner || !textElement || ANNOUNCEMENTS.length === 0) return;

    const currentItem = ANNOUNCEMENTS[currentAnnouncementIndex];
    textElement.innerHTML = `
        <div class="xbox-title">${currentItem.title}</div>
        <div class="xbox-detail">${currentItem.detail}</div>
    `;

    banner.style.transition = 'none';
    banner.style.width = 'max-content';
    banner.style.height = 'auto';

    const measuredWidth = banner.getBoundingClientRect().width;
    const measuredHeight = banner.getBoundingClientRect().height;

    const targetWidth = Math.min(measuredWidth, window.innerWidth * 0.96);
    const targetHeight = Math.max(measuredHeight, 62);

    banner.style.width = '50px';
    banner.style.height = '50px';
    banner.style.borderRadius = '25px';
    banner.classList.remove("show-text");
    void banner.offsetWidth;

    banner.style.transition = 'width 0.55s cubic-bezier(0.25, 1, 0.5, 1), height 0.45s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.45s cubic-bezier(0.25, 1, 0.5, 1)';

    requestAnimationFrame(() => {
        banner.style.width = `${targetWidth}px`;
    });

    setTimeout(() => {
        banner.style.height = `${targetHeight}px`;
        banner.style.borderRadius = `${targetHeight / 2}px`;

        setTimeout(() => {
            banner.classList.add("show-text");
        }, 200);

    }, 100);

    setTimeout(() => {
        banner.classList.remove("show-text");

        setTimeout(() => {
            banner.style.transition = 'height 0.45s cubic-bezier(0.25, 1, 0.5, 1), width 0.55s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
            banner.style.height = '50px';
            banner.style.borderRadius = '25px';

            setTimeout(() => {
                banner.style.width = '50px';

                setTimeout(() => {
                    currentAnnouncementIndex = (currentAnnouncementIndex + 1) % ANNOUNCEMENTS.length;
                    cycleXboxBanner();
                }, 950);

            }, 100);

        }, 200);

    }, 6500);
}

// ===========================================================================
// 5. INITIALIZATION
// ===========================================================================

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    loadSiteData();
});
