
// ==========================================
// CASE 404: MISSING TRUTH
// COMPLETE GAME JAVASCRIPT
// ==========================================


// ==========================================
// GAME DATA
// ==========================================

let investigator = "";
let score = 100;
let seconds = 0;
let timerInterval = null;
let timerRunning = false;
let hintCount = 0;
let unlocked = false;
let notificationTimeout = null;

const correctPassword = "2108";


// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// BACK BUTTON NAVIGATION
// ==========================================

function backToStart() {
    showScreen("startScreen");
}

function backToInstructions() {
    showScreen("instructionsScreen");
}

function backToRegistration() {
    showScreen("registrationScreen");
}

function backToBriefing() {
    showScreen("briefingScreen");
}

function backToMission() {
    showScreen("missionScreen");
}

function backToInvestigation() {

    closeApp();

    showScreen("passwordScreen");

    showNotification("Returned to Password Investigation.");
}


// ==========================================
// INVESTIGATOR REGISTRATION
// ==========================================

function registerInvestigator() {

    const nameInput = document.getElementById("investigatorName");
    const error = document.getElementById("registrationError");

    const name = nameInput.value.trim();

    if (name === "") {

        error.textContent = "Please enter your investigator name.";

        nameInput.focus();

        return;
    }

    investigator = name;

    error.textContent = "";

    showNotification(
        "Investigator identity confirmed: " + investigator
    );

    showScreen("briefingScreen");
}


// ==========================================
// TIMER SYSTEM
// ==========================================

function startInvestigation() {

    if (!timerRunning && !unlocked) {

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        seconds = 0;
        timerRunning = true;

        updateTimer();

        timerInterval = setInterval(() => {

            if (!timerRunning) return;

            seconds++;

            updateTimer();

        }, 1000);

        showNotification("Investigation timer started.");
    }

    showScreen("passwordScreen");
}


function updateTimer() {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedTime =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");

    const timer = document.getElementById("timer");

    const desktopClock = document.getElementById("desktopClock");

    if (timer) {
        timer.textContent = formattedTime;
    }

    if (desktopClock) {
        desktopClock.textContent = formattedTime;
    }
}


function stopTimer() {

    timerRunning = false;

    if (timerInterval) {

        clearInterval(timerInterval);

        timerInterval = null;
    }
}


// ==========================================
// PASSWORD CLUES
// ==========================================

const clues = [

    {
        title: "PERSONAL NOTE",

        text: `"August has always been special to me. I never want to forget the day that changed my life. 21.08. I wish I could go back."`
    },

    {
        title: "CALENDAR ENTRY",

        text: `"AUGUST 21 — A day I will always remember. No matter what happens, this date will stay with me."`
    },

    {
        title: "OLD REMINDER",

        text: `"If I ever forget my computer password, remember this: Enter the day first, followed by the month. Four digits only."`
    }

];


function openClue(index) {

    const clue = clues[index];

    if (!clue) return;

    document.getElementById("clueTitle").textContent = clue.title;

    document.getElementById("clueText").textContent = clue.text;

    document.getElementById("clueModal").classList.add("show");
}


function closeClue() {

    const modal = document.getElementById("clueModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// ==========================================
// PASSWORD HINTS
// ==========================================

const hints = [

    "HINT 1: The password is connected to an important date in Elena's life.",

    "HINT 2: Look closely at the Personal Note and Calendar Entry.",

    "HINT 3: The password contains four digits. Enter the day first, followed by the month.",

    "HINT 4: The date is August 21. Remember the required order."

];


function useHint() {

    if (unlocked) return;

    score = Math.max(0, score - 5);

    const currentScore = document.getElementById("currentScore");

    if (currentScore) {
        currentScore.textContent = score;
    }

    const hintIndex = Math.min(
        hintCount,
        hints.length - 1
    );

    showNotification(hints[hintIndex]);

    hintCount++;
}


// ==========================================
// CHECK COMPUTER PASSWORD
// ==========================================

function checkPassword() {

    const input = document.getElementById("passwordInput");

    const feedback = document.getElementById("passwordFeedback");

    if (!input || !feedback) return;

    const enteredPassword = input.value.trim();

    if (unlocked) return;

    if (enteredPassword === "") {

        feedback.textContent = "Please enter a password.";

        input.focus();

        return;
    }

    if (
        enteredPassword.length !== 4 ||
        !/^\d{4}$/.test(enteredPassword)
    ) {

        feedback.textContent = "Password must contain exactly 4 digits.";

        input.value = "";

        input.focus();

        return;
    }


    // CORRECT PASSWORD

    if (enteredPassword === correctPassword) {

        unlocked = true;

        stopTimer();

        feedback.style.color = "#72b58b";

        feedback.textContent = "ACCESS GRANTED. COMPUTER UNLOCKED.";

        showNotification("Password correct! Computer unlocked.");

        setTimeout(() => {

            closeApp();

            showScreen("computerScreen");

            showNotification("Welcome to Elena's personal computer.");

        }, 1000);

    }


    // INCORRECT PASSWORD

    else {

        score = Math.max(0, score - 10);

        const currentScore = document.getElementById("currentScore");

        if (currentScore) {
            currentScore.textContent = score;
        }

        feedback.style.color = "#e16c72";

        feedback.textContent =
            "ACCESS DENIED. Incorrect password. -10 POINTS.";

        input.value = "";

        input.focus();

    }

}


// ==========================================
// COMPUTER APPLICATIONS
// ==========================================

const appData = {

    // --------------------------------------
    // FILES
    // --------------------------------------

    files: {

        title: "MY FILES",

        content: `

            <h3>ELENA'S PERSONAL FILES</h3>

            <div class="app-item">

                📄 <strong>Personal Information.txt</strong>

                <small>Last modified: August 20</small>

                <p>A document containing Elena's personal details.</p>

            </div>


            <div class="app-item">

                📄 <strong>Journal Entry.doc</strong>

                <small>Last modified: August 21</small>

                <p>A personal journal entry saved before her death.</p>

            </div>


            <div class="app-item">

                📄 <strong>Important Documents.pdf</strong>

                <small>Last modified: August 18</small>

                <p>Some documents about an unknown individual.</p>

            </div>


            <div class="app-item">

                🔒 <strong>hidden_404.dat</strong>

                <small>FILE STATUS: RESTRICTED</small>

                <p>A suspicious file that may contain important information.</p>

            </div>


            <div class="app-notice">

                SYSTEM NOTE: Some files may contain important evidence.

            </div>

        `
    },


    // --------------------------------------
    // PHOTOS - 10 PERSONAL PHOTOS
    // --------------------------------------

    photos: {

        title: "PHOTO GALLERY",

        content: `

            <h3>ELENA'S PERSONAL PHOTOS</h3>

            <div class="photo-gallery">

                <div class="photo-item">
                    <img src="assets/images/bedroom.png" alt="Personal photo">
                    <p class="photo-caption">MAY 6, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/dog.png" alt="Personal photo">
                    <p class="photo-caption">JUNE 14, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/elenapic.png" alt="Personal photo">
                    <p class="photo-caption">JUNE 22, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/friends.png" alt="Personal photo">
                    <p class="photo-caption">JUNE 30, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/stalker.png" alt="Personal photo">
                    <p class="photo-caption">JULY 1, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/friends1.png" alt="Personal photo">
                    <p class="photo-caption">JULY 5, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/hallway.png" alt="Personal photo">
                    <p class="photo-caption">JULY 7, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/guy.png" alt="Personal photo">
                    <p class="photo-caption">JULY 8, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/photos.png" alt="Personal photo">
                    <p class="photo-caption">JULY 9, 2026</p>
                </div>


                <div class="photo-item">
                    <img src="assets/images/friends2.png" alt="Personal photo">
                    <p class="photo-caption">JANUARY 7, 2026</p>
                </div>

            </div>


            <div class="app-notice">

                PHOTO ARCHIVE: JANUARY - JULY 2026.

                LAST PHOTO SAVED: JULY 9, 2026.

                BODY DISCOVERED: JULY 10, 2026.

            </div>

        `
    },


    // --------------------------------------
    // MESSAGES
    // --------------------------------------

    messages: {

        title: "MESSAGES",

        content: `

            <h3>PRIVATE CONVERSATIONS</h3>


            <div class="app-item">

                <strong>UNKNOWN NUMBER</strong>

                <small>August 20 • 9:14 PM</small>

                <p>
                    "You shouldn't have looked into something
                    that doesn't concern you."
                </p>

            </div>


            <div class="app-item">

                <strong>Elena</strong>

                <small>August 20 • 9:18 PM</small>

                <p>
                    "I know what happened. You can't keep hiding
                    the truth forever."
                </p>

            </div>


            <div class="app-item">

                <strong>UNKNOWN NUMBER</strong>

                <small>August 21 • 12:03 AM</small>

                <p>
                    "This is your last warning. Delete everything."
                </p>

            </div>


            <div class="app-notice">

                MESSAGE WARNING: Sender identity unavailable.

            </div>

        `
    },


    // --------------------------------------
    // NOTES
    // --------------------------------------

    notes: {

        title: "PERSONAL NOTES",

        content: `

            <h3>ELENA'S PRIVATE NOTES</h3>


            <div class="app-item">

                <strong>August 18</strong>

                <p>
                    Someone has been following me lately.
                    I don't know who I can trust anymore.
                </p>

            </div>


            <div class="app-item">

                <strong>August 20</strong>

                <p>
                    I found something that could change everything.
                    I need to keep it somewhere safe.
                </p>

            </div>


            <div class="app-item">

                <strong>August 21</strong>

                <p>
                    If something happens to me, I hope someone
                    finds the truth hidden in this computer.
                </p>

            </div>


            <div class="app-notice">

                PRIVATE NOTE: Last entry saved on August 21.

            </div>

        `
    },


    // --------------------------------------
    // BROWSER HISTORY
    // --------------------------------------

    history: {

        title: "BROWSER HISTORY",

        content: `

            <h3>RECENT SEARCH HISTORY</h3>


            <div class="app-item">

                🌐 <strong>How to recover deleted files</strong>

                <small>August 19 • 8:30 PM</small>

            </div>


            <div class="app-item">

                🌐 <strong>Unknown phone number lookup</strong>

                <small>August 20 • 10:15 PM</small>

            </div>


            <div class="app-item">

                🌐 <strong>How to protect private information</strong>

                <small>August 20 • 11:42 PM</small>

            </div>


            <div class="app-item">

                🌐 <strong>What to do if someone is threatening you</strong>

                <small>August 21 • 12:20 AM</small>

            </div>


            <div class="app-notice">

                BROWSER ACTIVITY: Several searches suggest that Elena
                may have been experiencing a serious problem.

            </div>

        `
    }

};


// ==========================================
// OPEN COMPUTER APPLICATION
// ==========================================

function openApp(appName) {

    if (!unlocked) return;

    const app = appData[appName];

    if (!app) return;

    const appTitle = document.getElementById("appTitle");
    const appContent = document.getElementById("appContent");
    const appWindow = document.getElementById("appWindow");

    if (!appTitle || !appContent || !appWindow) return;

    appTitle.textContent = app.title;

    appContent.innerHTML = app.content;

    appWindow.classList.add("show");

    showNotification(app.title + " opened.");

}


// ==========================================
// CLOSE COMPUTER APPLICATION
// ==========================================

function closeApp() {

    const appWindow = document.getElementById("appWindow");

    if (appWindow) {
        appWindow.classList.remove("show");
    }

}


// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message) {

    const notification = document.getElementById("notification");

    if (!notification) return;

    notification.textContent = message;

    notification.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {

        notification.classList.remove("show");

    }, 3000);

}


// ==========================================
// RETURN TO MAIN MENU
// ==========================================

function returnToMainMenu() {

    const confirmReturn = confirm(

        "Are you sure you want to return to the Main Menu? Your current investigation progress will be reset."

    );

    if (!confirmReturn) return;


    // STOP TIMER

    stopTimer();


    // RESET GAME DATA

    investigator = "";

    score = 100;

    seconds = 0;

    hintCount = 0;

    unlocked = false;


    // RESET INPUTS

    const currentScore = document.getElementById("currentScore");
    const passwordInput = document.getElementById("passwordInput");
    const passwordFeedback = document.getElementById("passwordFeedback");
    const investigatorName = document.getElementById("investigatorName");
    const registrationError = document.getElementById("registrationError");

    if (currentScore) currentScore.textContent = score;

    if (passwordInput) passwordInput.value = "";

    if (passwordFeedback) {

        passwordFeedback.textContent = "";

        passwordFeedback.style.color = "";

    }

    if (investigatorName) investigatorName.value = "";

    if (registrationError) registrationError.textContent = "";


    // RESET MODALS AND APPLICATIONS

    closeApp();

    closeClue();


    // RESET TIMER DISPLAY

    updateTimer();


    // RETURN TO START SCREEN

    showScreen("startScreen");

    showNotification("Returned to Main Menu. New investigation ready.");

}


// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener("keydown", function(event) {

    // ESCAPE KEY

    if (event.key === "Escape") {

        closeClue();

        closeApp();

    }


    // ENTER KEY FOR PASSWORD

    if (

        event.key === "Enter" &&

        document.getElementById("passwordScreen")?.classList.contains("active") &&

        document.activeElement.id === "passwordInput"

    ) {

        checkPassword();

    }

});


// ==========================================
// INITIAL GAME DISPLAY
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const currentScore = document.getElementById("currentScore");

    if (currentScore) {
        currentScore.textContent = score;
    }

    updateTimer();

    showScreen("startScreen");

    console.log("CASE 404: MISSING TRUTH");

    console.log("Game initialized successfully.");

});
