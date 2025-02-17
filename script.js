const library = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = Number(pages);
    this.read = Boolean(read);
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

function addBookToLibrary(title, author, pages, read) {
    library.push(new Book(title, author, pages, read));
}

function removeBookFromLibrary(index) {
    library.splice(index, 1);
}

function addBooksToPage() {
    library.forEach((book, index) => {
        addBookToPage(book, index);
    });
}

function addBookToPage(book, index = -1) {
    if (!(book instanceof Book)) {
        throw Error("Argument must be a book object");
    }

    const elemControls = document.createElement("div");
    elemControls.classList.add("controls");
    elemControls.innerHTML =
        `<button class="delete" ` + (index >= 0 ? ` data-index="${index}"` : "") + `>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <title>delete</title>
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
            </svg>
        </button>`;
  
    const elemTitle = document.createElement("h2");
    elemTitle.innerText = book.title;

    const elemAuthor = document.createElement("div");
    elemAuthor.classList.add("author");
    elemAuthor.innerText = book.author;

    const elemPages = document.createElement("div");
    elemPages.innerText = `Pages: ${book.pages}`;

    const elemRead = document.createElement("div");
    elemRead.innerText = book.read ? "Read" : "Not Read";
    elemRead.classList.add(book.read ? "success" : "failure");

    const elemInfo = document.createElement("div");
    elemInfo.classList.add("info");
    elemInfo.appendChild(elemPages);
    elemInfo.appendChild(elemRead);

    const elemBook = document.createElement("div");
    elemBook.classList.add("book");
    elemBook.appendChild(elemTitle);
    elemBook.appendChild(elemAuthor);
    elemBook.appendChild(elemInfo);
    elemBook.appendChild(elemControls);

    document.querySelector("#library").appendChild(elemBook);
}

function syncPage() {
    removeBooksFromPage();
    addBooksToPage();
}

function removeBooksFromPage() {
    document.querySelector("#library").replaceChildren();
}

function clearAddBookForm() {
    const form = document.querySelector("#add-book-form");
    form.classList.remove("submitted");
    form.reset();
}

function setupAddBookForm() {
    // Button to open the form.
    const buttonAdd = document.querySelector("#add-book-open");
    buttonAdd.addEventListener("click", event => {
        document.querySelector("#add-book-dialog").showModal();
    });
    // Button to cancel and close the form.
    const buttonCancel = document.querySelector("#add-book-cancel");
    buttonCancel.addEventListener("click", event => {
        document.querySelector("#add-book-dialog").close();
        clearAddBookForm();
    });
    // Button to submit (add).
    const buttonSubmit = document.querySelector("#add-book-submit");
    buttonSubmit.addEventListener("click", event => {
        document.querySelector("#add-book-form").classList.add("submitted");
    });
    // Form submit.
    document.querySelector("#add-book-form").addEventListener("submit", event => {
        // Prevent the default submit behavior of the form.
        event.preventDefault();

        const data   = new FormData(event.target)
        const title  = data.get("title");
        const author = data.get("author");
        const pages  = data.get("pages");
        const read   = data.get("readStatus");

        addBookToLibrary(title, author, pages, read === "yes" ? true : false);
        addBookToPage(library[library.length - 1]);
        // Reset the form and close the dialog.
        syncPage();
        document.querySelector("#add-book-dialog").close();
    });
}

function setupBookDelete() {
    const elem = document.querySelector("#library");
    elem.addEventListener("click", event => {
        const button = event.target.closest("button.delete");
        // Check if the target is a delete button.
        if (!button) {
            return;
        }

        const index  = button.dataset.index;
        const result = confirm(`Are you sure you want to delete the book "${library[index].title}"`);

        if (result) {
            removeBookFromLibrary(index);
            syncPage();
        }
    });
}

addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 121, false);
addBookToLibrary("The Lord of the Ring", "J. R. R. Tolkien", 410, false);
addBookToLibrary("Gateway", "Frederik Pohl", 234, true);
addBookToLibrary("Rendezvous With Rama", "Arthur C. Clarke", 342, true);
addBookToLibrary("Ringworld", "Larry Niven", 212, true);
syncPage();
setupAddBookForm();
setupBookDelete();