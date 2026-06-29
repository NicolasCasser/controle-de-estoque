const searchInput = document.querySelector("#search-input");
const productsBody = document.querySelector("#products-body");
const tableContainer = document.querySelector("#table-container");
const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const productCount = document.querySelector("#product-count");

let products = [];

function productName(product) { return product.nome ?? product.name ?? ""; }
function productDescription(product) { return product.descricao ?? product.description ?? "Sem descrição"; }
function productQuantity(product) { return Number(product.quantidadeAtual ?? product.currentQuantity ?? 0); }

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

    row.append(nameCell, descriptionCell, quantityCell);
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
    const response = await fetch("/products");
    if (!response.ok) throw new Error("Não foi possível carregar os produtos.");
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error("Resposta inválida do servidor.");
    products = payload.sort((a, b) =>
      productName(a).localeCompare(productName(b), "pt-BR", { sensitivity: "base" })
    );
    renderProducts(products);
  } catch (error) {
    tableContainer.hidden = true;
    emptyState.hidden = true;
    statusMessage.hidden = false;
    statusMessage.classList.add("error");
    statusMessage.textContent = error.message;
    updateCount(0);
  }
}

searchInput.addEventListener("input", filterProducts);
loadProducts();
