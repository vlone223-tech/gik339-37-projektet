const url = "http://localhost:3000/library";

// State variables for managing updates and deletions
let isUpdating = false;
let updatingBookId = null;
let deleteBookId = null;

// Add a book
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (isUpdating) return; // Prevent submission during update mode

  const bookData = {
    bookTitle: document.getElementById("bookTitle").value.trim(),
    bookGenre: document.getElementById("bookGenre").value.trim(),
    publishedYear: parseInt(document.getElementById("publishedYear").value),
    rating: parseInt(document.getElementById("rating").value),
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then(() => {
      showMessage("Book added successfully!", "success");
      resetFormAndButtons();
      fetchAndDisplayBooks();
    })
    .catch(() => showMessage("Failed to add book.", "danger"));
});

// Fetch and display all books
function fetchAndDisplayBooks() {
  fetch(url)
    .then((response) => response.json())
    .then((books) => {
      const bookList = document.getElementById("bookList");
      bookList.innerHTML = "";

      books.forEach((book) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        listItem.innerHTML = `
          <div>
            <p><strong>Title:</strong> ${book.bookTitle}</p>
            <p><strong>Genre:</strong> ${book.bookGenre}</p>
            <p><strong>Year:</strong> ${book.publishedYear}</p>
            <p><strong>Rating:</strong> ${book.rating}</p>
          </div>
          <div>
            <button class="btn btn-warning btn-sm" onclick="prepareUpdateBook(${book.id})">Update</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteBook(${book.id}, '${book.bookTitle}')">Delete</button>
          </div>
        `;

        bookList.appendChild(listItem);
      });
    })
    .catch(() => showMessage("Failed to fetch books.", "danger"));
}

// Prepare for updating a book
function prepareUpdateBook(id) {
  isUpdating = true;
  updatingBookId = id;

  document.getElementById("updateBookBtn").style.display = "block";
  document.getElementById("submitBookBtn").style.display = "none";

  fetch(`${url}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("bookTitle").value = data.bookTitle || "";
      document.getElementById("bookGenre").value = data.bookGenre || "";
      document.getElementById("publishedYear").value = data.publishedYear || "";
      document.getElementById("rating").value = data.rating || "";

      document.getElementById("bookForm").scrollIntoView({ behavior: "smooth" });
    })
    .catch(() => showMessage("Failed to fetch book details.", "danger"));
}

// Update a book
document.getElementById("updateBookBtn").addEventListener("click", function (e) {
  e.preventDefault();
  if (!isUpdating || !updatingBookId) return;

  const bookData = {
    bookTitle: document.getElementById("bookTitle").value.trim(),
    bookGenre: document.getElementById("bookGenre").value.trim(),
    publishedYear: parseInt(document.getElementById("publishedYear").value),
    rating: parseInt(document.getElementById("rating").value),
  };

  fetch(`${url}/${updatingBookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then((response) => response.json())
    .then(() => {
      showMessage("Book updated successfully!", "success");
      resetFormAndButtons();
      fetchAndDisplayBooks();
    })
    .catch(() => showMessage("Failed to update book.", "danger"));
});

// Confirm book deletion
function confirmDeleteBook(id, title) {
  deleteBookId = id;

  document.getElementById("deleteConfirmModalBody").innerHTML = `
    Are you sure you want to delete the book "<strong>${title}</strong>"?
  `;

  const deleteConfirmModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
  deleteConfirmModal.show();
}

// Delete a book
document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
  if (deleteBookId !== null) {
    fetch(`${url}/${deleteBookId}`, { method: "DELETE" })
      .then(() => {
        showMessage("Book deleted successfully!", "success");
        fetchAndDisplayBooks();
      })
      .catch(() => showMessage("Failed to delete book.", "danger"));
  }
});

// Reset form and buttons
function resetFormAndButtons() {
  document.getElementById("bookForm").reset();
  document.getElementById("updateBookBtn").style.display = "none";
  document.getElementById("submitBookBtn").style.display = "block";
  isUpdating = false;
  updatingBookId = null;
}

// Show message
function showMessage(message, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.className = `alert alert-${type}`;
  messageBox.style.display = "block";
  document.getElementById("messageText").innerText = message;
  setTimeout(() => (messageBox.style.display = "none"), 3000);
}

// Initialize and fetch books on load
window.onload = fetchAndDisplayBooks;
