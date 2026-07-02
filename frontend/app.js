const searchInput = document.querySelector("#search-input");
const productsBody = document.querySelector("#products-body");
const tableContainer = document.querySelector("#table-container");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const productCount = document.querySelector("#product-count");
const toast = document.querySelector("#toast");

const newProductBtn = document.querySelector("#new-product-btn");
const productModal = document.querySelector("#product-modal");
const productForm = document.querySelector("#product-form");
const productFormError = document.querySelector("#product-form-error");
const productNameInput = document.querySelector("#product-name");
const productNameError = document.querySelector("#product-name-error");
const productDescriptionInput = document.querySelector("#product-description");
const productQuantityField = document.querySelector("#product-quantity-field");
const productQuantityInput = document.querySelector("#product-quantity");
const productQuantityError = document.querySelector("#product-quantity-error");
const productFormSubmit = document.querySelector("#product-form-submit");
const productModalTitle = document.querySelector("#product-modal-title");

const movementModal = document.querySelector("#movement-modal");
const movementForm = document.querySelector("#movement-form");
const movementFormError = document.querySelector("#movement-form-error");
const movementProductName = document.querySelector("#movement-product-name");
const movementSegmented = movementModal.querySelector(".segmented");
const movementQuantityInput = document.querySelector("#movement-quantity");
const movementQuantityError = document.querySelector("#movement-quantity-error");
const movementObservationInput = document.querySelector("#movement-observation");
const movementFormSubmit = document.querySelector("#movement-form-submit");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalError = document.querySelector("#delete-modal-error");
const deleteProductName = document.querySelector("#delete-product-name");
const deleteModalWarning = document.querySelector("#delete-modal-warning");
const deleteConfirmBtn = document.querySelector("#delete-confirm-btn");

let products = [];
let editingProductId = null;
let movementProductId = null;
let deleteProductId = null;
let toastTimeoutId = null;

function productName(product) { return product.name ?? ""; }
function productDescription(product) { return product.description || "Sem descrição"; }
function productQuantity(product) { return Number(product.currentQuantity ?? 0); }
function findProductById(id) {
  return products.find((product) => Number(product.id) === Number(id));
}

async function apiRequest(url, options) {
  const response = await fetch(url, options);
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }
  if (!response.ok) {
    const message = payload && payload.message ? payload.message : "Ocorreu um erro inesperado.";
    throw new Error(message);
  }
  return payload;
}

function showToast(message, variant = "success") {
  clearTimeout(toastTimeoutId);
  toast.textContent = message;
  toast.classList.toggle("error", variant === "error");
  toast.hidden = false;
  toastTimeoutId = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

/* ---------- Modais ---------- */

function openModal(overlay) {
  overlay.hidden = false;
}

function closeModal(overlay) {
  overlay.hidden = true;
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal-overlay:not([hidden])").forEach(closeModal);
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal(overlay);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(document.querySelector(`#${button.dataset.closeModal}`));
  });
});

/* ---------- Listagem de produtos ---------- */

function updateCount(count) {
  productCount.textContent = count === 1 ? "1 produto" : `${count} produtos`;
}

function renderProducts(items) {
  productsBody.replaceChildren();
  statusMessage.hidden = true;
  tableContainer.hidden = items.length === 0;
  emptyState.hidden = items.length !== 0;
  updateCount(items.length);

  items.forEach((product) => {
    const quantity = productQuantity(product);
    const row = document.createElement("tr");
    if (quantity === 0) row.classList.add("out-of-stock");

    const nameCell = document.createElement("td");
    nameCell.className = "product-name";
    nameCell.textContent = productName(product);

    const descriptionCell = document.createElement("td");
    descriptionCell.className = "description";
    descriptionCell.textContent = productDescription(product);

    const quantityCell = document.createElement("td");
    quantityCell.className = "quantity-column";
    const badge = document.createElement("span");
    badge.className = "stock-badge";
    badge.textContent = quantity === 0 ? "Sem estoque" : quantity;
    quantityCell.appendChild(badge);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-action";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = product.id;
    editBtn.textContent = "Editar";

    const moveBtn = document.createElement("button");
    moveBtn.type = "button";
    moveBtn.className = "btn-action";
    moveBtn.dataset.action = "move";
    moveBtn.dataset.id = product.id;
    moveBtn.textContent = "Movimentar";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-action danger";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = product.id;
    deleteBtn.textContent = "Excluir";

    actions.append(editBtn, moveBtn, deleteBtn);
    actionsCell.appendChild(actions);

    row.append(nameCell, descriptionCell, quantityCell, actionsCell);
    productsBody.appendChild(row);
  });
}

function filterProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = products.filter((product) =>
    productName(product).toLocaleLowerCase("pt-BR").includes(query)
  );
  renderProducts(filtered);
}

async function loadProducts() {
  try {
    const payload = await apiRequest("/products");
    if (!Array.isArray(payload)) throw new Error("Resposta inválida do servidor.");
    products = payload.sort((a, b) =>
      productName(a).localeCompare(productName(b), "pt-BR", { sensitivity: "base" })
    );
    filterProducts();
  } catch (error) {
    tableContainer.hidden = true;
    emptyState.hidden = true;
    statusMessage.hidden = false;
    statusMessage.classList.add("error");
    statusMessage.textContent = error.message;
    updateCount(0);
  }
}

productsBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const product = findProductById(button.dataset.id);
  if (!product) return;

  if (button.dataset.action === "edit") openProductModal("edit", product);
  if (button.dataset.action === "move") openMovementModal(product);
  if (button.dataset.action === "delete") openDeleteModal(product);
});

searchInput.addEventListener("input", filterProducts);

/* ---------- Cadastro / edição de produto ---------- */

function clearProductFormErrors() {
  productFormError.hidden = true;
  productFormError.textContent = "";
  productNameError.textContent = "";
  productQuantityError.textContent = "";
}

function openProductModal(mode, product) {
  clearProductFormErrors();
  productForm.reset();
  editingProductId = mode === "edit" ? product.id : null;

  if (mode === "edit") {
    productModalTitle.textContent = "Editar produto";
    productFormSubmit.textContent = "Salvar alterações";
    productNameInput.value = product.name ?? "";
    productDescriptionInput.value = product.description ?? "";
    productQuantityField.hidden = true;
  } else {
    productModalTitle.textContent = "Novo produto";
    productFormSubmit.textContent = "Salvar";
    productQuantityField.hidden = false;
    productQuantityInput.value = "0";
  }

  openModal(productModal);
  productNameInput.focus();
}

newProductBtn.addEventListener("click", () => openProductModal("create"));

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearProductFormErrors();

  const name = productNameInput.value.trim();
  if (!name) {
    productNameError.textContent = "O nome do produto é obrigatório.";
    return;
  }

  const payload = { name, description: productDescriptionInput.value.trim() || null };

  if (!editingProductId) {
    const quantity = Number(productQuantityInput.value);
    if (!Number.isInteger(quantity) || quantity < 0) {
      productQuantityError.textContent = "Informe um número inteiro maior ou igual a zero.";
      return;
    }
    payload.initialQuantity = quantity;
  }

  productFormSubmit.disabled = true;
  try {
    if (editingProductId) {
      await apiRequest(`/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showToast("Produto atualizado com sucesso.");
    } else {
      await apiRequest("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showToast("Produto cadastrado com sucesso.");
    }
    closeModal(productModal);
    await loadProducts();
  } catch (error) {
    productFormError.textContent = error.message;
    productFormError.hidden = false;
  } finally {
    productFormSubmit.disabled = false;
  }
});

/* ---------- Movimentação de estoque ---------- */

function clearMovementFormErrors() {
  movementFormError.hidden = true;
  movementFormError.textContent = "";
  movementQuantityError.textContent = "";
}

function setMovementType(type) {
  movementSegmented.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === type);
  });
}

function getMovementType() {
  return movementSegmented.querySelector("button.active").dataset.type;
}

function openMovementModal(product) {
  clearMovementFormErrors();
  movementForm.reset();
  movementProductId = product.id;
  movementProductName.textContent = product.name;
  setMovementType("ENTRADA");
  openModal(movementModal);
  movementQuantityInput.focus();
}

movementSegmented.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  setMovementType(button.dataset.type);
});

movementForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMovementFormErrors();

  const quantity = Number(movementQuantityInput.value);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    movementQuantityError.textContent = "Informe um número inteiro maior que zero.";
    return;
  }

  const payload = {
    productId: movementProductId,
    type: getMovementType(),
    quantity,
    observation: movementObservationInput.value.trim() || null,
  };

  movementFormSubmit.disabled = true;
  try {
    await apiRequest("/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showToast("Movimentação registrada com sucesso.");
    closeModal(movementModal);
    await loadProducts();
  } catch (error) {
    movementFormError.textContent = error.message;
    movementFormError.hidden = false;
  } finally {
    movementFormSubmit.disabled = false;
  }
});

/* ---------- Exclusão de produto ---------- */

function openDeleteModal(product) {
  deleteModalError.hidden = true;
  deleteModalError.textContent = "";
  deleteProductId = product.id;
  deleteProductName.textContent = product.name;
  deleteModalWarning.hidden = productQuantity(product) === 0;
  openModal(deleteModal);
}

deleteConfirmBtn.addEventListener("click", async () => {
  deleteModalError.hidden = true;
  deleteConfirmBtn.disabled = true;
  try {
    await apiRequest(`/products/${deleteProductId}`, { method: "DELETE" });
    showToast("Produto excluído com sucesso.");
    closeModal(deleteModal);
    await loadProducts();
  } catch (error) {
    deleteModalError.textContent = error.message;
    deleteModalError.hidden = false;
  } finally {
    deleteConfirmBtn.disabled = false;
  }
});

loadProducts();
