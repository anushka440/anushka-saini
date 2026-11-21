STUDENT PRODUCTIVITY AND STUDY PLANNER
======================================

PROJECT FILES
-------------
index.html   - Structure and content of the web application
styles.css   - Styling, layout and responsive design
script.js    - Task operations, validation, filtering, statistics and Local Storage

HOW TO RUN
----------
1. Extract the complete Student-Productivity-Planner folder from the ZIP file.
2. Open the extracted folder in Visual Studio Code.
3. Open index.html in Google Chrome (or another modern browser).
   You may also use the Live Server extension in Visual Studio Code.
4. Do not open index.html from inside the ZIP archive. Extract the folder first.

LOCAL STORAGE
-------------
The application stores tasks in the browser's Local Storage using the key:
studentStudyPlannerTasks

Tasks are saved when they are added, edited, marked complete or deleted.
When the page is opened again in the same browser profile, the application
loads the saved tasks and updates the dashboard statistics.

Local Storage is browser- and device-specific. Clearing browser site data,
using a different browser/profile, or using another device will not transfer
these tasks automatically. The application does not send task data to a server.

SUGGESTED FINAL TEST
--------------------
1. Add a task with all required details.
2. Refresh the browser page. Confirm that the task is still displayed.
3. Mark the task as complete. Confirm the Completed count increases and the
   Pending count decreases.
4. Refresh again. Confirm the completion status remains saved.
5. Edit the task title, refresh, and confirm the edited title remains.
6. Delete the task, refresh, and confirm it remains deleted.
7. Try submitting a blank task title and a non-positive study duration.
8. Test All, Pending and Completed filters.

GROUP DETAILS (as provided for the report)
------------------------------------------
Anushka - 2572003
Manvi Debral - 2572008
Shivanshi Khanduri - 2572012

Course: Client Side Web Technologies, CSS-250
Programme: B.Sc. Computer Science, 3rd Semester
Faculty: Mr. Divyanshu Semwal
