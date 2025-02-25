// SVG for the button to delete a book (https://pictogrammers.com/library/mdi/icon/trash-can/)
const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <title>delete</title>
    <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
</svg>`;
// SVG for the button to mark a book as read (https://pictogrammers.com/library/mdi/icon/eye-check/)
const svgRead = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <title>read</title>
    <path d="M23.5,17L18.5,22L15,18.5L16.5,17L18.5,19L22,15.5L23.5,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,17C12.5,17 12.97,16.93 13.42,16.79C13.15,17.5 13,18.22 13,19V19.45L12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5C17,4.5 21.27,7.61 23,12C22.75,12.64 22.44,13.26 22.08,13.85C21.18,13.31 20.12,13 19,13C18.22,13 17.5,13.15 16.79,13.42C16.93,12.97 17,12.5 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17Z" />
</svg>`;
// SVG for the button to mark a book as not read (https://pictogrammers.com/library/mdi/icon/eye-remove/)
const svgNotRead = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <title>not read</title>
    <path d="M22.54 16.88L20.41 19L22.54 21.12L21.12 22.54L19 20.41L16.88 22.54L15.47 21.12L17.59 19L15.47 16.88L16.88 15.47L19 17.59L21.12 15.47L22.54 16.88M12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9M12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12C17 12.5 16.9 13 16.77 13.43C17.46 13.16 18.21 13 19 13C20.12 13 21.17 13.32 22.07 13.85C22.43 13.27 22.74 12.65 23 12C21.27 7.61 17 4.5 12 4.5S2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C12.35 19.5 12.69 19.5 13.03 19.45C13 19.3 13 19.15 13 19C13 18.21 13.16 17.46 13.43 16.77C13 16.9 12.5 17 12 17Z" />
</svg>`;

class Book {
    constructor(title, author, pages, read) {
        const p = Number(pages);
        if (isNaN(p) || p < 0)
        {
            throw new TypeError("Invalid number of pages");
        }

        this.title  = title;
        this.author = author;
        this.pages  = p;
        this.read   = Boolean(read);
    }

    toggleRead() {
        this.read = !this.read;
    }
}

class Library {
    #books = [];

    get count() {
        return this.#books.length;
    }

    toggleRead(index) { 
        this.#books[index].toggleRead();
    }

    getBook(index) {
        return this.#books[index];
    }

    createBook(title, author, pages, read) {
        this.addBook(new Book(title, author, pages, read));
    }

    addBook(book) {
        this.#books.push(book);
    }

    removeBook(index) {
        this.#books.splice(index, 1);
    }
}

class Renderer {
    sync(library) {
        this.removeBooks();
        this.addLibrary(library);
    }

    addLibrary(library) {
        for (let i = 0; i < library.count; i++) {
            this.addBook(i, library.getBook(i));
        }
    }

    addBook(index, book) {
        const elemControls = document.createElement("div");
        elemControls.classList.add("controls");
        elemControls.innerHTML = `
            <button title="Remove book" class="delete"${index >= 0 ? ` data-index="${index}"` : ""}>
                ${svgDelete}
            </button>
            <button title="${book.read ? "Mark as unread" : "Mark as read"}" class="read-status"${index >= 0 ? ` data-index="${index}"` : ""}>
                ${book.read ? svgNotRead : svgRead}
            </button>
        `;
    
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

    removeBooks() {
        document.querySelector("#library").replaceChildren();
    }

    clearBookForm() {
        const form = document.querySelector("#add-book-form");
        form.classList.remove("submitted");
        form.reset();
    }
}

class App {
    library = new Library();

    renderer = null;

    constructor (renderer = null) {
        this.renderer = renderer;
        if (this.renderer === null) {
            this.renderer = new Renderer();
        }

        this.#setupAddBookForm();
        this.#setupBookDelete();
        this.#setupBookReadStatus();
    }

    addTestBooks() {
        this.library.createBook("The Hobbit", "J. R. R. Tolkien", 121, false);
        this.library.createBook("The Lord of the Ring", "J. R. R. Tolkien", 410, false);
        this.library.createBook("Gateway", "Frederik Pohl", 234, true);
        this.library.createBook("Rendezvous With Rama", "Arthur C. Clarke", 342, true);
        this.library.createBook("Ringworld", "Larry Niven", 212, true);
        this.renderer.sync(this.library);
    }

    #setupAddBookForm() {
        // Button to open the form to add a new book.
        const buttonAdd = document.querySelector("#add-book-open");
        buttonAdd.addEventListener("click", event => {
            document.querySelector("#add-book-dialog").showModal();
        });
        // Button to cancel and close the form.
        const buttonCancel = document.querySelector("#add-book-cancel");
        buttonCancel.addEventListener("click", event => {
            document.querySelector("#add-book-dialog").close();
            renderer.clearBookForm();
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

            this.library.createBook(title, author, pages, read === "yes" ? true : false);
            this.renderer.sync(this.library);
            
            document.querySelector("#add-book-dialog").close();
        });
    }

    #setupBookDelete() {
        const elem = document.querySelector("#library");
        elem.addEventListener("click", event => {
            const button = event.target.closest("button.delete");
            if (!button) {
                return;
            }
    
            const index  = button.dataset.index;
            const result = confirm(`Are you sure you want to delete the book "${this.library.getBook(index).title}"`);
    
            if (result) {
                this.library.removeBook(index);
                this.renderer.sync(this.library);
            }
        });
    }

    #setupBookReadStatus() {
        const elem = document.querySelector("#library");
        elem.addEventListener("click", event => {
            const button = event.target.closest("button.read-status");
            if (!button) {
                return;
            }
    
            const index = button.dataset.index;
            console.dir(this);
            this.library.toggleRead(index);
            this.renderer.sync(this.library);
        });
    }
}

new App(new Renderer()).addTestBooks();