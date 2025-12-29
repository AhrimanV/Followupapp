const navButtons = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".content");
const screenTitle = document.getElementById("screen-title");
const screenSubtitle = document.getElementById("screen-subtitle");

const screenMeta = {
  home: {
    title: "Home",
    subtitle: "Search and start a new audit follow-up.",
  },
  "create-audit": {
    title: "Create Audit",
    subtitle: "Capture audit details and summary notes.",
  },
  "create-tasks": {
    title: "Create Tasks",
    subtitle: "Log failed points and assign owners.",
  },
  "task-list": {
    title: "Task List",
    subtitle: "Track progress across all tasks.",
  },
  "task-detail": {
    title: "Task Detail",
    subtitle: "Review task submissions and proof.",
  },
  "reviewer-queue": {
    title: "Reviewer Queue",
    subtitle: "Approve or reject incoming submissions.",
  },
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.screen;

    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    screens.forEach((screen) => {
      screen.classList.toggle("hidden", screen.id !== `screen-${target}`);
    });

    const meta = screenMeta[target];
    if (meta) {
      screenTitle.textContent = meta.title;
      screenSubtitle.textContent = meta.subtitle;
    }
  });
});
