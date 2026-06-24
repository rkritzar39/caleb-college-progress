async function loadProgress() {
  try {
    var response = await fetch("progress.json");

    if (!response.ok) {
      throw new Error("Could not load progress.json (" + response.status + ")");
    }

    var data = await response.json();

    // Top section
    document.getElementById("siteTitle").textContent = data.siteTitle || "My College Progress";
    document.getElementById("siteSubtitle").textContent =
      data.siteSubtitle || "Tracking my academic journey.";
    document.getElementById("aboutText").textContent =
      data.about || "No description available.";

    // Overview stats
    document.getElementById("semesterValue").textContent =
      data.semester || "--";

    document.getElementById("coursesValue").textContent =
      data.courses ? data.courses.length : 0;

    document.getElementById("assignmentsValue").textContent =
      (data.assignmentsCompleted || 0) + "/" + (data.assignmentsTotal || 0);

    document.getElementById("overallProgressValue").textContent =
      (data.overallProgress || 0) + "%";

    document.getElementById("overallProgressText").textContent =
      (data.overallProgress || 0) + "% complete";

    var overallBar = document.getElementById("overallProgressBar");
    overallBar.style.width = (data.overallProgress || 0) + "%";

    // Render sections
    renderCourses(data.courses || []);
    renderUpdates(data.updates || []);
    renderGoals(data.goals || []);
  } catch (error) {
    console.error("Error loading progress data:", error);
    document.getElementById("aboutText").textContent =
      "Unable to load progress data right now.";
  }
}

function renderCourses(courses) {
  var container = document.getElementById("coursesList");
  container.innerHTML = "";

  if (!courses.length) {
    var emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No courses available yet.";
    container.appendChild(emptyMessage);
    return;
  }

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

    var status = document.createElement("p");
    status.textContent = "Status: " + (course.status || "Not available");

    var gradeLetter = document.createElement("p");
    gradeLetter.textContent = course.gradeLetter
      ? "Current Grade: " + course.gradeLetter
      : "Current Grade: Not yet available";

    var gradeScore = document.createElement("p");
    gradeScore.textContent = course.gradeScore
      ? "Current Score: " + course.gradeScore
      : "Current Score: Not yet available";

    var latestAssignment = document.createElement("p");
    latestAssignment.textContent = course.latestAssignment
      ? "Latest Assignment: " + course.latestAssignment
      : "Latest Assignment: None yet";

    var latestAssignmentScore = document.createElement("p");
    latestAssignmentScore.textContent = course.latestAssignmentScore
      ? "Latest Assignment Score: " + course.latestAssignmentScore
      : "Latest Assignment Score: None yet";

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
    card.appendChild(status);
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

loadProgress();
