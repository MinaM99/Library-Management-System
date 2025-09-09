const validateISBN = (isbn) => {
    // Basic ISBN validation (supports both ISBN-10 and ISBN-13)
    const isbnRegex = /^(?:\d[- ]?){9}[\dX]$|^(?:\d[- ]?){13}$/;
    return isbnRegex.test(isbn.replace(/[- ]/g, ''));
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    validateISBN,
    validateEmail
};
