
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

const form = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const errorEl = document.getElementById("form-error");
const listEl = document.getElementById("todo-list");
const filterInput = document.getElementById("filter-input");


function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(iso) {
  
  return iso;
}

function render(filtered = null) {
  const arr = (filtered ?? tasks).slice().sort((a, b) => a.date.localeCompare(b.date));
  listEl.innerHTML = "";
  if (arr.length === 0) {
    listEl.innerHTML = `<li style="grid-template-columns: 1fr"><span>No tasks yet</span></li>`;
    return;
  }
  for (const t of arr) {
    const li = document.createElement("li");
    li.dataset.id = t.id;

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = t.title;

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = formatDate(t.date);

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      tasks = tasks.filter(x => x.id !== t.id);
      save();
      render(applyTextFilter(filterInput.value));
    });

    li.appendChild(title);
    li.appendChild(date);
    li.appendChild(del);
    listEl.appendChild(li);
  }
}

function validate(title, dateStr) {

  if (!title.trim()) return "Task cannot be empty.";
  if (!dateStr) return "Please choose a due date.";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Invalid date.";
  return "";
}

function applyTextFilter(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return null; // render() will use full tasks
  return tasks.filter(t =>
    t.title.toLowerCase().includes(needle)
  );
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const title = titleInput.value;
  const dateStr = dateInput.value;

  const msg = validate(title, dateStr);
  if (msg) {
    errorEl.textContent = msg;
    return;
  }

  const task = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    date: dateStr
  };
  tasks.push(task);
  save();


  titleInput.value = "";
  dateInput.value = "";
  render(applyTextFilter(filterInput.value));
});

filterInput.addEventListener("input", () => {
  render(applyTextFilter(filterInput.value));
});


render();