async function loadProgress() {
  try {
    var response = await fetch("progress.json");

    if (!response.ok) {
      throw new Error("Could not load progress.json (" + response.status + ")");
    }

    var data = await response.json();

    setText("siteTitle", data.siteTitle || "My College Progress");
    setText("siteSubtitle", data.siteSubtitle || "Tracking my academic journey.");
    setText("aboutText", data.about || "No description available.");
    setText("semesterValue", data.semester || "--");
    setText("startDateValue", formatDisplayDate(data.semesterStart) || "--");
    setText("creditHoursValue", data.totalCreditHours || 0);
    setText(
      "assignmentsValue",
      (data.assignmentsCompleted || 0) + "/" + (data.assignmentsTotal || 0)
    );
    setText("overallProgressValue", (data.overallProgress || 0) + "%");
    setText("overallProgressText", (data.overallProgress || 0) + "% complete");
    setText("countdownValue", calculateCountdown(data.semesterStart));

    var overallBar = document.getElementById("overallProgressBar");
    if (overallBar) {
      overallBar.style.width = (data.overallProgress || 0) + "%";
    }

    renderCourses(data.courses || [], data.semesterStart);
    renderUpdates(data.updates || []);
    renderGoals(data.goals || []);
    renderDates(data.upcomingDates || []);
  } catch (error) {
    console.error("Error loading progress data:", error);

    var about = document.getElementById("aboutText");
    if (about) {
      about.textContent = "Unable to load progress data right now.";
    }
  }
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function renderCourses(courses, semesterStart) {
  var container = document.getElementById("coursesList");
  if (!container) return;

  container.innerHTML = "";

  if (!courses.length) {
    var emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No courses available yet.";
    container.appendChild(emptyMessage);
    return;
  }

  var beforeStart = isBeforeSemesterStart(semesterStart);

  courses.forEach(function (course) {
    var card = document.createElement("div");
    card.className = "course-card";

    var title = document.createElement("h3");
    title.textContent = course.name || "Untitled Course";

    var meta = document.createElement("div");
    meta.className = "course-meta";
    meta.textContent =
      (course.term || "") +
      (course.hours ? " • " + course.hours + " credit hours" : "");

    var description = document.createElement("p");
    description.textContent = course.description || "No description available.";

    var statusWrap = document.createElement("div");
    var statusLabel = document.createElement("div");
    statusLabel.className = "course-detail";
    statusLabel.textContent = "Status";

    var statusChip = document.createElement("span");
    statusChip.className = "status-chip " + getStatusClass(course.status);
    statusChip.textContent = course.status || "Not available";

    statusWrap.appendChild(statusLabel);
    statusWrap.appendChild(statusChip);

    var gradeLetter = document.createElement("p");
    gradeLetter.className = "course-detail";
    gradeLetter.textContent =
      "Current Grade: " +
      (beforeStart || !course.gradeLetter ? "Not yet available" : course.gradeLetter);

    var gradeScore = document.createElement("p");
    gradeScore.className = "course-detail";
    gradeScore.textContent =
      "Current Score: " +
      (beforeStart || !course.gradeScore ? "Not yet available" : course.gradeScore);

    var latestAssignment = document.createElement("p");
    latestAssignment.className = "course-detail";
    latestAssignment.textContent =
      "Latest Assignment: " +
      (beforeStart || !course.latestAssignment ? "None yet" : course.latestAssignment);

    var latestAssignmentScore = document.createElement("p");
    latestAssignmentScore.className = "course-detail";
    latestAssignmentScore.textContent =
      "Latest Assignment Score: " +
      (beforeStart || !course.latestAssignmentScore
        ? "None yet"
        : course.latestAssignmentScore);

    var progressWrapper = document.createElement("div");
    progressWrapper.className = "course-progress";

    var progressLabel = document.createElement("div");
    progressLabel.className = "course-progress-label";
    progressLabel.textContent = "Progress: " + (course.progress || 0) + "%";

    var progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    var progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    progressFill.style.width = (course.progress || 0) + "%";

    progressBar.appendChild(progressFill);
    progressWrapper.appendChild(progressLabel);
    progressWrapper.appendChild(progressBar);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(description);
    card.appendChild(statusWrap);
    card.appendChild(gradeLetter);
    card.appendChild(gradeScore);
    card.appendChild(latestAssignment);
    card.appendChild(latestAssignmentScore);
    card.appendChild(progressWrapper);

    container.appendChild(card);
  });
}

function renderUpdates(updates) {
  var updatesList = document.getElementById("updatesList");
  if (!updatesList) return;

  updatesList.innerHTML = "";

  if (!updates.length) {
    var emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No updates yet.";
    updatesList.appendChild(emptyMessage);
    return;
  }

  updates.forEach(function (update) {
    var li = document.createElement("li");
    li.textContent = update;
    updatesList.appendChild(li);
  });
}

function renderGoals(goals) {
  var goalsList = document.getElementById("goalsList");
  if (!goalsList) return;

  goalsList.innerHTML = "";

  if (!goals.length) {
    var emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No goals listed yet.";
    goalsList.appendChild(emptyMessage);
    return;
  }

  goals.forEach(function (goal) {
    var li = document.createElement("li");
    li.textContent = goal;
    goalsList.appendChild(li);
  });
}

function renderDates(dates) {
  var datesList = document.getElementById("datesList");
  if (!datesList) return;

  datesList.innerHTML = "";

  if (!dates.length) {
    var emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No upcoming dates yet.";
    datesList.appendChild(emptyMessage);
    return;
  }

  dates.forEach(function (dateItem) {
    var li = document.createElement("li");
    li.textContent = dateItem.date + " — " + dateItem.label;
    datesList.appendChild(li);
  });
}

function calculateCountdown(startDate) {
  if (!startDate) return "--";

  var today = new Date();
  var start = new Date(startDate + "T00:00:00");
  var diff = start - today;
  var days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return String(days);
  if (days === 0) return "Today";
  return "Started";
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "--";
  var date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function isBeforeSemesterStart(dateStr) {
  if (!dateStr) return false;
  var today = new Date();
  var start = new Date(dateStr + "T00:00:00");
  return today < start;
}

function getStatusClass(status) {
  if (!status) return "status-planning";
  var normalized = status.toLowerCase();

  if (normalized.indexOf("active") !== -1) return "status-active";
  if (normalized.indexOf("registered") !== -1) return "status-registered";
  return "status-planning";
}

loadProgress();
