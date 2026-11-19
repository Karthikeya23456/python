
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No tasks yet. Add your first task!</p>';
    }

    tasks.forEach((task, index) => {
        const item = document.createElement("div");
        item.className = "task-item" + (task.completed ? " done" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const name = document.createElement("span");
        name.textContent = task.name;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.title = "Delete task";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, name, deleteButton);
        taskList.appendChild(item);
    });

    updateDashboard();
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === "") return;

    tasks.push({
        name: name,
        completed: false
    });

    saveTasks();
    taskInput.value = "";
    renderTasks();
});

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressText").textContent = percentage + "%";
    document.getElementById("circlePercent").textContent = percentage + "%";

    document.getElementById("progressCircle").style.background =
        `conic-gradient(var(--primary) ${percentage * 3.6}deg, var(--border) 0deg)`;

    document.getElementById("progressMessage").textContent =
        total === 0
        ? "Start adding tasks to track your progress."
        : percentage === 100
        ? "Excellent! You completed all your tasks! 🎉"
        : "Keep going! You are making great progress.";
}

// Dark mode
const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("studyTheme") === "dark") {
    document.body.classList.add("dark");
}

function updateThemeButton() {
    themeBtn.textContent = document.body.classList.contains("dark")
        ? "☀ Light Mode"
        : "☾ Dark Mode";
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "studyTheme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );

    updateThemeButton();
});

// Save notes
const notesInput = document.getElementById("notesInput");
const saveNotes = document.getElementById("saveNotes");
const saveStatus = document.getElementById("saveStatus");

notesInput.value = localStorage.getItem("studyNotes") || "";

saveNotes.addEventListener("click", () => {
    localStorage.setItem("studyNotes", notesInput.value);
    saveStatus.textContent = "✓ Notes saved successfully!";
});

// Today's date
document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Navigation active state
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

// Initial dashboard
renderTasks();