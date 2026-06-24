async function loadProgress() {
  try {
    const response = await fetch("progress.json");

    if (!response.ok) {
      throw new Error("Could not load progress.json (" + response.status + ")");
    }

    const data = await response.json();

    document.getElementById("siteTitle").textContent = data.siteTitle;
    document.getElementById("siteSubtitle").textContent = data.siteSubtitle;
    document.getElementById("aboutText").textContent = data.about;
    document.getElementById("semesterValue").textContent = data.semester;
    document.getElementById("coursesValue").textContent = data.courses.length;
    document.getElementById("assignmentsValue").textContent =
      data.assignmentsCompleted + "/" + data.assignmentsTotal;
    document.getElementById("overallProgressValue").textContent =
      data.overallProgress + "%";
    document.getElementById("overallProgressText").textContent =
      data.overallProgress + "% complete";

    var overallBar = document.getElementById("overallProgressBar");
    overallBar.style.width = data.overallProgress + "%";

    renderCourses(data.courses);
    renderUpdates(data.updates);
    renderGoals(data.goals);
  } catch (error) {
    console.error("Error loading progress data:", error);
    document.getElementById("aboutText").textContent =
      "Unable to load progress data right now.";
  }
}

function renderCourses(courses) {
  var container = document.getElementById("coursesList");
  container.innerHTML = "";

  courses.forEach(function(course) {
    var card = document.createElement("div");
    card.className = "course-card";

    var title = document.createElement("h3");
    title.textContent = course.name;

    var meta = document.createElement("div");
    meta.className = "course-meta";
    meta.textContent = course.term;

    var description = document.createElement("p");
    description.textContent = course.description;

    var progressWrapper = document.createElement("div");
    progressWrapper.className = "course-progress";

    var progressLabel = document.createElement("div");
    progressLabel.className = "course-progress-label";
    progressLabel.textContent = "Progress: " + course.progress + "%";

    var progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    var progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    progressFill.style.width = course.progress + "%";

    progressBar.appendChild(progressFill);
    progressWrapper.appendChild(progressLabel);
    progressWrapper.appendChild(progressBar);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(description);
    card.appendChild(progressWrapper);

    container.appendChild(card);
  });
}

function renderUpdates(updates) {
  var updatesList = document.getElementById("updatesList");
  updatesList.innerHTML = "";

  updates.forEach(function(update) {
    var li = document.createElement("li");
    li.textContent = update;
    updatesList.appendChild(li);
  });
}

function renderGoals(goals) {
  var goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  goals.forEach(function(goal) {
    var li = document.createElement("li");
    li.textContent = goal;
    goalsList.appendChild(li);
  });
}

loadProgress();
