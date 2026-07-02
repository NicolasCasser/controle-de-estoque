const filterTabs = document.querySelector(".filter-tabs");
const movementsBody = document.querySelector("#movements-body");
const tableContainer = document.querySelector("#table-container");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const movementCount = document.querySelector("#movement-count");

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function updateCount(count) {
  movementCount.textContent = count === 1 ? "1 movimentação" : `${count} movimentações`;
}

function renderMovements(items) {
  movementsBody.replaceChildren();
  statusMessage.hidden = true;
  tableContainer.hidden = items.length === 0;
  emptyState.hidden = items.length !== 0;
  updateCount(items.length);

  items.forEach((movement) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = dateFormatter.format(new Date(movement.createdAt));

    const productCell = document.createElement("td");
    productCell.className = "product-name";
    productCell.textContent = movement.product?.name ?? "Produto removido";

    const typeCell = document.createElement("td");
    const typeBadge = document.createElement("span");
    typeBadge.className = `type-badge ${movement.type === "ENTRADA" ? "entrada" : "saida"}`;
    typeBadge.textContent = movement.type === "ENTRADA" ? "Entrada" : "Saída";
    typeCell.appendChild(typeBadge);

    const quantityCell = document.createElement("td");
    quantityCell.className = "quantity-column";
    quantityCell.textContent = movement.quantity;

    const observationCell = document.createElement("td");
    observationCell.className = "description";
    observationCell.textContent = movement.observation || "—";

    row.append(dateCell, productCell, typeCell, quantityCell, observationCell);
    movementsBody.appendChild(row);
  });
}

async function loadMovements(type) {
  statusMessage.hidden = false;
  statusMessage.classList.remove("error");
  statusMessage.textContent = "Carregando movimentações...";
  tableContainer.hidden = true;
  emptyState.hidden = true;

  try {
    const url = type ? `/movements?type=${type}` : "/movements";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Não foi possível carregar o histórico.");
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error("Resposta inválida do servidor.");
    renderMovements(payload);
  } catch (error) {
    tableContainer.hidden = true;
    emptyState.hidden = true;
    statusMessage.hidden = false;
    statusMessage.classList.add("error");
    statusMessage.textContent = error.message;
    updateCount(0);
  }
}

filterTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  filterTabs.querySelectorAll("button").forEach((btn) => btn.classList.toggle("active", btn === button));
  loadMovements(button.dataset.type);
});

loadMovements("");
