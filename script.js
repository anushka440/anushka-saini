
"use strict";

// STEP 1: Select HTML elements
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskSubject = document.getElementById("task-subject");
const taskDeadline = document.getElementById("task-deadline");
const taskPriority = document.getElementById("task-priority");
const taskMinutes = document.getElementById("task-minutes");

const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const formMessage = document.getElementById("form-message");
const taskFilter = document.getElementById("task-filter");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressPercent = document.getElementById("progress-percent");

// STEP 2: Load tasks from browser Local Storage
// Local Storage keeps the task data in this browser after refresh or reopening.
const STORAGE_KEY = "studentStudyPlannerTasks";

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (!savedTasks) return [];

        const parsedTasks = JSON.parse(savedTasks);
        if (!Array.isArray(parsedTasks)) return [];

        // Keep only valid task objects to avoid errors from damaged stored data.
        return parsedTasks.filter(task =>
            task &&
            Number.isInteger(task.id) &&
            typeof task.title === "string" &&
            typeof task.subject === "string" &&
            typeof task.deadline === "string" &&
            typeof task.priority === "string" &&
            Number.isFinite(Number(task.minutes)) &&
            typeof task.completed === "boolean"
        ).map(task => ({
            ...task,
            minutes: Number(task.minutes)
        }));
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
        return [];
    }
}

let tasks = loadTasks();
let nextId = tasks.reduce((largestId, task) =>
    Math.max(largestId, task.id), 0
) + 1;

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Unable to save tasks:", error);
        showMessage("Your changes are visible, but could not be saved in this browser.");
        return false;
    }
}

// STEP 3: Display a message near the form
function showMessage(message, isError = true) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#b42318" : "#18864b";
}

// STEP 4: Update the dashboard statistics
const pendingCount = document.getElementById("pending-count");

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
    progressPercent.textContent = percentage + "%";
}


// STEP 5: Display tasks on the webpage
function renderTasks() {
    taskList.replaceChildren();

    const filterValue = taskFilter.value;

    const visibleTasks = tasks.filter(task => {
        if (filterValue === "pending") {
            return !task.completed;
        }

        if (filterValue === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.hidden = tasks.length > 0;

    if (tasks.length > 0 && visibleTasks.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No tasks match this filter.";
        taskList.appendChild(message);
        return;
    }

    visibleTasks.forEach(task => {
        // Create the card
        const card = document.createElement("article");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        // Create the task title
        const title = document.createElement("h3");
        title.textContent = task.title;

        // Create task details
        const details = document.createElement("p");
        details.textContent =
            `Subject: ${task.subject} | Deadline: ${task.deadline}`;

        const information = document.createElement("p");
        information.textContent =
            `Priority: ${task.priority} | Estimated time: ${task.minutes} minutes`;

        // Create the action buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.className = "complete-button";
        completeButton.textContent =
            task.completed ? "Completed" : "Mark Complete";
        completeButton.disabled = task.completed;

        completeButton.addEventListener("click", () => {
            task.completed = true;
            saveTasks();
            renderTasks();
            updateStatistics();
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            const newTitle = prompt("Edit task name:", task.title);

            if (newTitle === null) {
                return;
            }

            if (newTitle.trim() === "") {
                alert("Task name cannot be blank.");
                return;
            }

            task.title = newTitle.trim();
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Delete the task "${task.title}"?`
            );

            if (!confirmed) {
                return;
            }

            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();

            renderTasks();
            updateStatistics();
            showMessage("Task deleted successfully.", false);
        });

        actions.append(
            completeButton,
            editButton,
            deleteButton
        );

        card.append(
            title,
            details,
            information,
            actions
        );

        taskList.appendChild(card);
    });
}

// STEP 6: Handle form submission
taskForm.addEventListener("submit", function (event) {
    // Prevent the browser from reloading the page
    event.preventDefault();

    const title = taskTitle.value.trim();
    const subject = taskSubject.value;
    const deadline = taskDeadline.value;
    const priority = taskPriority.value;
    const minutes = Number(taskMinutes.value);

    // Validate task name
    if (title === "") {
        showMessage("Please enter a task name.");
        taskTitle.focus();
        return;
    }

    // Validate subject and deadline
    if (subject === "" || deadline === "") {
        showMessage("Please select a subject and deadline.");
        return;
    }

    // Validate estimated study time
    if (
        taskMinutes.value.trim() === "" ||
        !Number.isFinite(minutes) ||
        minutes <= 0
    ) {
        showMessage("Estimated minutes must be a positive number.");
        taskMinutes.focus();
        return;
    }

    // Create a JavaScript object for the new task
    const newTask = {
        id: nextId++,
        title: title,
        subject: subject,
        deadline: deadline,
        priority: priority,
        minutes: minutes,
        completed: false
    };

    // Add the new task to the array and save it in Local Storage
    tasks.push(newTask);
    const wasSaved = saveTasks();

    // Reset the form and refresh the page content
    taskForm.reset();
    showMessage(
        wasSaved
            ? "Task added successfully and saved in this browser."
            : "Task added for this session, but browser storage was unavailable.",
        !wasSaved
    );

    renderTasks();
    updateStatistics();

    // Return focus to the task-name field
    taskTitle.focus();
});

// STEP 7: Respond when the filter changes
taskFilter.addEventListener("change", renderTasks);

// STEP 8: Initialize the dashboard using tasks loaded from Local Storage
renderTasks();
updateStatistics();

console.log("Study Planner JavaScript loaded successfully.");
console.log(`${tasks.length} saved task(s) loaded from Local Storage.`);
