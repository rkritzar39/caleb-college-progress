async function loadProgress() {
  try {
    const response = await fetch("progress.json");
    const data = await response.json();

    document.getElementById("siteTitle").textContent = data.siteTitle;
    document.getElementById("siteSubtitle").textContent = data.siteSubtitle;
    document.getElementById("aboutText").textContent = data.about;
    document.getElementById("semesterValue").textContent = data.semester;
    document.getElementById("coursesValue").textContent = data.courses.length;
    document.getElementById("assignmentsValue").textContent = data.assignmentsCompleted + "/" + data.assignmentsTotal;
    document.getElementById("overallProgressValue").textContent = ${data.overallProgress}%;
    document.getElementById("overallProgressText").textContent = ${data.overallProgress}% complete;

    const overallBar = document.getElementById("overallProgressBar");
    overallBar.style.width = ${data.overallProgress}%;

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
  const container = document.getElementById("coursesList");
  container.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = 
      <h3>${course.name}</h3>
      <div class="course-meta">${course.term}</div>
      <p>${course.description}</p>
      <div class="course-progress">
        <div class="course-progress-label">Progress: ${course.progress}%</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${course.progress}%"></div>
        </div>
      </div>
    ;

    container.appendChild(card);
  });
}

function renderUpdates(updates) {
  const updatesList = document.getElementById("updatesList");
  updatesList.innerHTML = "";

  updates.forEach(update => {
    const li = document.createElement("li");
    li.textContent = update;
    updatesList.appendChild(li);
  });
}

function renderGoals(goals) {
  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  goals.forEach(goal => {
    const li = document.createElement("li");
    li.textContent = goal;
    goalsList.appendChild(li);
  });
}

loadProgress();
