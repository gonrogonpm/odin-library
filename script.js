const library = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    library.push(new Book(title, author, pages, read));
}

function addBooksToPage() {
    library.forEach(book => {
        addBookToPage(book);
    });
}

function addBookToPage(book) {
    if (!(book instanceof Book)) {
        throw Error("Argument must be a book object");
    }
  
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

    document.querySelector("#library").appendChild(elemBook);
}

addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 121, false);
addBookToLibrary("The Lord of the Ring", "J. R. R. Tolkien", 410, false);
addBookToLibrary("Gateway", "Frederik Pohl", 234, true);
addBookToLibrary("Rendezvous With Rama", "Arthur C. Clarke", 342, true);
addBookToLibrary("Ringworld", "Larry Niven", 212, true);
addBooksToPage();