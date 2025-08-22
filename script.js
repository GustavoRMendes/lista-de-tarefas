const container = document.querySelector(".container");
const addButton = document.querySelector("#add-task");
const taskInput = document.querySelector("#task");
const list = document.querySelector("#task-list");

function saveTasks() {
  const tasks = [];
  list.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((t) => createTask(t.text, t.completed));
}

function createButton(icon) {
  const button = document.createElement("button");
  button.textContent = icon;
  return button;
}

function createTask(texto, completed = false) {
  const newItem = document.createElement("li");

  const itemText = document.createElement("span");
  itemText.textContent = texto;

  if (completed) itemText.classList.add("completed");

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("button-group");

  const editTask = createButton("✏️");
  const removeTask = createButton("❌");
  const doneTask = createButton("✅");

  newItem.appendChild(itemText);
  buttonGroup.appendChild(editTask);
  buttonGroup.appendChild(removeTask);
  buttonGroup.appendChild(doneTask);
  newItem.appendChild(buttonGroup);
  list.appendChild(newItem);

  removeTask.addEventListener("click", () => {
    newItem.remove();
    saveTasks();
  });

  doneTask.addEventListener("click", () => {
    itemText.classList.toggle("completed");
    saveTasks();
  });

  editTask.addEventListener("click", () => edit(newItem));
  saveTasks();
  return newItem;
}

function edit(newItem) {
  if (newItem.classList.contains("editing")) return;

  newItem.classList.add("editing");

  const oldTextNode = newItem.firstChild;
  const oldText = oldTextNode.textContent.trim();

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.setAttribute("aria-label", "Editar tarefa");

  newItem.replaceChild(input, oldTextNode);
  input.focus();
  input.setSelectionRange(0, input.value.length);

  const finish = (save = true) => {
    const finalText = save ? input.value.trim() || oldText : oldText;
    const newTextNode = document.createTextNode(finalText);
    newItem.replaceChild(newTextNode, input);
    newItem.classList.remove("editing");
    saveTasks();
  };

  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") finish(true);
    if (ev.key === "Escape") finish(false);
  });

  input.addEventListener("blur", () => finish(true));
}

addButton.addEventListener("click", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (text) {
    createTask(text);
    taskInput.value = "";
    taskInput.focus();
  }
});

loadTasks();
