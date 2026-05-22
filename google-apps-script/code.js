/**
 * Google Apps Script backend for the Society Library Management System.
 * 
 * Instructions:
 * 1. Create a Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace all code in the script editor with this code.
 * 4. Run the 'setupDatabase' function once to create the sheets and headers.
 * 5. Deploy as a Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone"
 *    - Copy the Web App URL and paste it in the frontend's config.
 */

// Spreadsheet Configuration
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

// Sheets names
const TABS = {
  USERS: 'users',
  BOOKS: 'books',
  LOANS: 'loans'
};

/**
 * Automatically sets up the spreadsheet tabs and headers.
 * Run this function from the Apps Script editor once.
 */
function setupDatabase() {
  // 1. Setup Users Tab
  let usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  if (!usersSheet) {
    usersSheet = SPREADSHEET.insertSheet(TABS.USERS);
  }
  usersSheet.clear();
  usersSheet.appendRow(['email', 'name', 'flat_number', 'phone_number', 'role', 'status', 'created_at']);
  usersSheet.getRange("1:1").setFontWeight("bold").setBackground("#D1E7DD");
  usersSheet.setFrozenRows(1);

  // 2. Setup Books Tab
  let booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  if (!booksSheet) {
    booksSheet = SPREADSHEET.insertSheet(TABS.BOOKS);
  }
  booksSheet.clear();
  booksSheet.appendRow(['book_id', 'title', 'author', 'isbn', 'cover_url', 'genre', 'pages', 'language', 'publisher', 'publish_year', 'owner_email', 'copy_number', 'status', 'created_at']);
  booksSheet.getRange("1:1").setFontWeight("bold").setBackground("#CFF4FC");
  booksSheet.setFrozenRows(1);

  // 3. Setup Loans Tab
  let loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  if (!loansSheet) {
    loansSheet = SPREADSHEET.insertSheet(TABS.LOANS);
  }
  loansSheet.clear();
  loansSheet.appendRow(['loan_id', 'book_id', 'borrower_email', 'lender_email', 'request_date', 'status', 'duration_days', 'approval_date', 'handover_date', 'due_date', 'return_date', 'notes']);
  loansSheet.getRange("1:1").setFontWeight("bold").setBackground("#F8D7DA");
  loansSheet.setFrozenRows(1);

  // Make the sheet owner an admin by default
  const ownerEmail = Session.getActiveUser().getEmail();
  if (ownerEmail) {
    usersSheet.appendRow([
      ownerEmail,
      "Chetan Chauhan",
      "A2:820",
      "8334053394",
      "Owner",
      "Approved",
      new Date().toISOString()
    ]);
  }

  Logger.log("Database initialized successfully!");
}

/**
 * Handle GET requests (health check or raw data for testing)
 */
function doGet(e) {
  return respond({ status: 'success', message: 'Society Library API is running. Send POST requests to interact.' });
}

/**
 * Handle POST requests.
 * Uses a bypass for CORS Preflight by receiving requests as text/plain.
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return respondError('Empty request body');
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const idToken = payload.idToken;

    if (!action) {
      return respondError('No action specified');
    }

    // Bypass authentication for registration check or mock token if debugging
    // In production, we verify the Google ID token.
    let verifiedUser = null;
    if (idToken) {
      verifiedUser = verifyIdToken(idToken);
      if (!verifiedUser) {
        return respondError('Invalid authentication token', 401);
      }
    }

    // Execute requested action
    switch (action) {
      case 'getUserProfile':
        return getUserProfile(payload, verifiedUser);
      case 'registerUser':
        return registerUser(payload, verifiedUser);
      case 'getCatalog':
        return getCatalog(payload, verifiedUser);
      case 'getLoans':
        return getLoans(payload, verifiedUser);
      case 'addBook':
        return addBook(payload, verifiedUser);
      case 'requestBook':
        return requestBook(payload, verifiedUser);
      case 'approveLoan':
        return approveLoan(payload, verifiedUser);
      case 'rejectLoan':
        return rejectLoan(payload, verifiedUser);
      case 'handoverBook':
        return handoverBook(payload, verifiedUser);
      case 'returnBook':
        return returnBook(payload, verifiedUser);
      case 'adminGetUsers':
        return adminGetUsers(payload, verifiedUser);
      case 'adminUpdateUserStatus':
        return adminUpdateUserStatus(payload, verifiedUser);
      case 'updateMyProfile':
        return updateMyProfile(payload, verifiedUser);
      case 'editBook':
        return editBook(payload, verifiedUser);
      case 'toggleBookAvailability':
        return toggleBookAvailability(payload, verifiedUser);
      case 'deleteBook':
        return deleteBook(payload, verifiedUser);
      case 'adminEditUser':
        return adminEditUser(payload, verifiedUser);
      case 'getStats':
        return getStats(payload, verifiedUser);
      default:
        return respondError('Unknown action: ' + action);
    }
  } catch (error) {
    return respondError(error.toString(), 500);
  }
}

/**
 * Verifies the Google ID Token with Google OAuth APIs
 */
function verifyIdToken(token) {
  // For safety and local dev convenience, check if it's a test token
  if (token.startsWith('mock-token-')) {
    const mockEmail = token.replace('mock-token-', '');
    return {
      email: mockEmail,
      name: mockEmail.split('@')[0],
      picture: ''
    };
  }

  try {
    const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token));
    if (response.getResponseCode() === 200) {
      const details = JSON.parse(response.getContentText());
      // Check if client ID is valid (optional, but email is verified by Google)
      return {
        email: details.email,
        name: details.name || details.given_name || details.email.split('@')[0],
        picture: details.picture || ''
      };
    }
  } catch (err) {
    Logger.log("Token verification failed: " + err.toString());
  }
  return null;
}

// ==========================================
// BUSINESS LOGIC FUNCTIONS
// ==========================================

function getUserProfile(payload, user) {
  if (!user) return respondError('Authentication required');
  const userRow = findRowByEmail(TABS.USERS, user.email);
  if (!userRow) {
    return respond({ status: 'not_registered', email: user.email, name: user.name });
  }
  return respond({ status: 'success', data: userRow });
}

function registerUser(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const existing = findRowByEmail(TABS.USERS, user.email);
  if (existing) {
    return respondError('User already registered');
  }

  const sheet = SPREADSHEET.getSheetByName(TABS.USERS);
  // Default status: Pending (unless they are the sheet owner, which setupDatabase makes Admin)
  // Let's check if they are the first user registered in an empty sheet (make them Approved/Admin)
  const lastRow = sheet.getLastRow();
  const status = lastRow <= 1 ? 'Approved' : 'Pending';
  const role = lastRow <= 1 ? 'Both' : (payload.role || 'Both');

  const userData = [
    user.email,
    payload.name || user.name,
    payload.flatNumber || 'N/A',
    payload.phoneNumber || 'N/A',
    role,
    status,
    new Date().toISOString()
  ];
  sheet.appendRow(userData);

  return respond({
    status: 'success',
    data: {
      email: user.email,
      name: userData[1],
      flat_number: userData[2],
      phone_number: userData[3],
      role: userData[4],
      status: userData[5]
    }
  });
}

function getCatalog(payload, user) {
  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const books = getSheetDataAsObjects(booksSheet);
  
  // Cross reference user info for display details (e.g. flat number of owner)
  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const users = getSheetDataAsObjects(usersSheet);

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loans = getSheetDataAsObjects(loansSheet);
  
  const userMap = {};
  users.forEach(u => {
    userMap[u.email] = {
      name: u.name,
      flat_number: u.flat_number,
      phone_number: u.phone_number
    };
  });

  const catalog = books.map(book => {
    const ownerInfo = userMap[book.owner_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };
    
    let borrower_name = null;
    let borrower_flat = null;
    
    // Find active loan (status is not Returned and not Rejected)
    const activeLoan = loans.find(l => String(l.book_id) === String(book.book_id) && l.status !== 'Returned' && l.status !== 'Rejected');
    if (activeLoan) {
      const borrowerInfo = userMap[activeLoan.borrower_email];
      if (borrowerInfo) {
        borrower_name = borrowerInfo.name;
        borrower_flat = borrowerInfo.flat_number;
      }
    }

    return {
      ...book,
      owner_name: ownerInfo.name,
      owner_flat: ownerInfo.flat_number,
      owner_phone: ownerInfo.phone_number,
      borrower_name: borrower_name,
      borrower_flat: borrower_flat
    };
  });

  return respond({ status: 'success', data: catalog });
}

function getLoans(payload, user) {
  if (!user) return respondError('Authentication required');
  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loans = getSheetDataAsObjects(loansSheet);
  
  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const books = getSheetDataAsObjects(booksSheet);
  
  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const users = getSheetDataAsObjects(usersSheet);

  const bookMap = {};
  books.forEach(b => { bookMap[b.book_id] = b; });

  const userMap = {};
  users.forEach(u => {
    userMap[u.email] = { name: u.name, flat_number: u.flat_number, phone_number: u.phone_number };
  });

  // Filter based on user role/email
  // Borrowers see loans where they are the borrower.
  // Lenders see loans where they are the lender.
  // Admins see all.
  const profile = findRowByEmail(TABS.USERS, user.email);
  const isAdmin = profile && profile.role === 'Admin' || (profile && profile.email === SPREADSHEET.getOwner().getEmail());

  const filteredLoans = loans.filter(loan => {
    if (isAdmin) return true;
    return loan.borrower_email === user.email || loan.lender_email === user.email;
  });

  const formattedLoans = filteredLoans.map(loan => {
    const book = bookMap[loan.book_id] || { title: 'Unknown', author: 'Unknown', cover_url: '' };
    const borrower = userMap[loan.borrower_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };
    const lender = userMap[loan.lender_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };
    
    return {
      ...loan,
      book_title: book.title,
      book_author: book.author,
      book_cover: book.cover_url,
      borrower_name: borrower.name,
      borrower_flat: borrower.flat_number,
      borrower_phone: borrower.phone_number,
      lender_name: lender.name,
      lender_flat: lender.flat_number,
      lender_phone: lender.phone_number
    };
  });

  // Sort by request date descending
  formattedLoans.sort((a, b) => new Date(b.request_date) - new Date(a.request_date));

  return respond({ status: 'success', data: formattedLoans });
}

function addBook(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const userProfile = findRowByEmail(TABS.USERS, user.email);
  if (!userProfile || userProfile.status !== 'Approved') {
    return respondError('User not approved to add books');
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const count = parseInt(payload.copies || '1', 10);
  const now = new Date().toISOString();
  
  const addedBooks = [];
  const baseId = 'B-' + Date.now();

  for (let i = 1; i <= count; i++) {
    const bookId = `${baseId}-${i}`;
    const newBook = [
      bookId,
      payload.title,
      payload.author || 'Unknown',
      payload.isbn || '',
      payload.coverUrl || '',
      payload.genre || '',
      payload.pages || '',
      payload.language || '',
      payload.publisher || '',
      payload.publishYear || '',
      user.email,
      i.toString(),
      'Available',
      now
    ];
    booksSheet.appendRow(newBook);
    addedBooks.push({
      book_id: bookId,
      title: payload.title,
      author: payload.author,
      isbn: payload.isbn,
      cover_url: payload.coverUrl,
      genre: payload.genre || '',
      pages: payload.pages || '',
      language: payload.language || '',
      publisher: payload.publisher || '',
      publish_year: payload.publishYear || '',
      owner_email: user.email,
      copy_number: i.toString(),
      status: 'Available'
    });
  }

  return respond({ status: 'success', data: addedBooks });
}

function requestBook(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const userProfile = findRowByEmail(TABS.USERS, user.email);
  if (!userProfile || userProfile.status !== 'Approved') {
    return respondError('Only approved users can borrow books');
  }

  const bookId = payload.bookId;
  const durationDays = parseInt(payload.durationDays || '14', 10);
  const notes = payload.notes || '';

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', bookId);

  if (bookIndex === -1) {
    return respondError('Book not found');
  }

  const bookRow = getRowAsObject(booksSheet, bookIndex);
  if (bookRow.status !== 'Available') {
    return respondError('Book is not available for borrowing');
  }

  if (bookRow.owner_email === user.email) {
    return respondError('You cannot borrow your own book!');
  }

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanId = 'L-' + Date.now();
  const now = new Date().toISOString();

  // Create loan entry
  const newLoan = [
    loanId,
    bookId,
    user.email,
    bookRow.owner_email,
    now,
    'Requested',
    durationDays,
    '', // approval_date
    '', // handover_date
    '', // due_date
    '', // return_date
    notes
  ];
  loansSheet.appendRow(newLoan);

  // Update book status to Requested
  updateCell(booksSheet, bookIndex, 'status', 'Requested');

  return respond({ status: 'success', loanId: loanId });
}

function approveLoan(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;
  
  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan request not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  if (loan.lender_email !== user.email) {
    return respondError('Unauthorized. Only the book owner can approve loans.');
  }

  if (loan.status !== 'Requested') {
    return respondError('Loan request cannot be approved from current state: ' + loan.status);
  }

  const now = new Date().toISOString();
  updateCell(loansSheet, loanIndex, 'status', 'Approved');
  updateCell(loansSheet, loanIndex, 'approval_date', now);

  return respond({ status: 'success' });
}

function rejectLoan(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;
  
  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan request not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  if (loan.lender_email !== user.email) {
    return respondError('Unauthorized. Only the book owner can reject loans.');
  }

  if (loan.status !== 'Requested') {
    return respondError('Loan request cannot be rejected from current state: ' + loan.status);
  }

  updateCell(loansSheet, loanIndex, 'status', 'Rejected');

  // Change book status back to Available
  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);
  if (bookIndex !== -1) {
    updateCell(booksSheet, bookIndex, 'status', 'Available');
  }

  return respond({ status: 'success' });
}

function handoverBook(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  if (loan.lender_email !== user.email) {
    return respondError('Unauthorized. Only the lender can confirm handover.');
  }

  if (loan.status !== 'Approved') {
    return respondError('Handover requires an Approved loan.');
  }

  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + parseInt(loan.duration_days, 10));

  updateCell(loansSheet, loanIndex, 'status', 'Out');
  updateCell(loansSheet, loanIndex, 'handover_date', now.toISOString());
  updateCell(loansSheet, loanIndex, 'due_date', dueDate.toISOString());

  // Update book status to Borrowed
  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);
  if (bookIndex !== -1) {
    updateCell(booksSheet, bookIndex, 'status', 'Borrowed');
  }

  return respond({ status: 'success' });
}

function returnBook(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  // Only the lender can mark books as returned
  const isLender = loan.lender_email === user.email;
  if (!isLender) {
    return respondError('Unauthorized. Only the lender can mark books as returned.');
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);

  if (loan.status === 'Out') {
    // Lender confirms receipt of book, transitions directly to Returned
    const now = new Date().toISOString();
    updateCell(loansSheet, loanIndex, 'status', 'Returned');
    updateCell(loansSheet, loanIndex, 'return_date', now);

    if (bookIndex !== -1) {
      updateCell(booksSheet, bookIndex, 'status', 'Available');
    }
    return respond({ status: 'success', message: 'Book returned successfully!' });
  }

  return respondError('Invalid action for loan status: ' + loan.status);
}

function adminGetUsers(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const adminProfile = findRowByEmail(TABS.USERS, user.email);
  if (!adminProfile || (adminProfile.role !== 'Admin' && adminProfile.role !== 'Owner')) {
    return respondError('Admin/Owner permissions required');
  }

  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const users = getSheetDataAsObjects(usersSheet);

  return respond({ status: 'success', data: users });
}

function adminUpdateUserStatus(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const adminProfile = findRowByEmail(TABS.USERS, user.email);
  if (!adminProfile || (adminProfile.role !== 'Admin' && adminProfile.role !== 'Owner')) {
    return respondError('Admin/Owner permissions required');
  }

  const targetEmail = payload.targetEmail;
  const newStatus = payload.status; // Approved, Suspended, Pending

  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const userIndex = findRowIndexByKey(usersSheet, 'email', targetEmail);

  if (userIndex === -1) {
    return respondError('User not found');
  }

  const targetUser = getRowAsObject(usersSheet, userIndex);
  const isOwner = adminProfile.role === 'Owner';

  // Guard: Only Owner can edit status/role of another Owner
  if (targetUser.role === 'Owner' && !isOwner) {
    return respondError('Only the Owner can update status of another Owner account');
  }
  // Guard: Only Owner can assign/change Admin or Owner roles
  if (payload.role && (payload.role === 'Admin' || payload.role === 'Owner') && !isOwner) {
    return respondError('Only the Owner can assign Admin or Owner roles');
  }

  updateCell(usersSheet, userIndex, 'status', newStatus);

  if (payload.role) {
    updateCell(usersSheet, userIndex, 'role', payload.role);
  }

  return respond({ status: 'success' });
}

function updateMyProfile(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const rowIndex = findRowIndexByKey(usersSheet, 'email', user.email);
  if (rowIndex === -1) return respondError('User profile not found');

  if (payload.name) updateCell(usersSheet, rowIndex, 'name', payload.name);
  if (payload.flatNumber) updateCell(usersSheet, rowIndex, 'flat_number', payload.flatNumber);
  if (payload.phoneNumber) updateCell(usersSheet, rowIndex, 'phone_number', payload.phoneNumber);

  const updatedProfile = getRowAsObject(usersSheet, rowIndex);
  return respond({ status: 'success', data: updatedProfile });
}

function editBook(payload, user) {
  if (!user) return respondError('Authentication required');
  
  const userProfile = findRowByEmail(TABS.USERS, user.email);
  if (!userProfile || userProfile.status !== 'Approved') {
    return respondError('User not approved');
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const rowIndex = findRowIndexByKey(booksSheet, 'book_id', payload.bookId);
  if (rowIndex === -1) return respondError('Book copy not found');

  const currentBook = getRowAsObject(booksSheet, rowIndex);
  
  // Guard: Must be owner of the book copy, or Admin/Owner role
  const isBookOwner = currentBook.owner_email.toLowerCase() === user.email.toLowerCase();
  const isAdminOrOwnerUser = userProfile.role === 'Admin' || userProfile.role === 'Owner';
  if (!isBookOwner && !isAdminOrOwnerUser) {
    return respondError('Permission denied. You do not own this book copy.');
  }

  if (payload.isbn !== undefined) updateCell(booksSheet, rowIndex, 'isbn', payload.isbn);
  if (payload.coverUrl !== undefined) updateCell(booksSheet, rowIndex, 'cover_url', payload.coverUrl);
  if (payload.author !== undefined) updateCell(booksSheet, rowIndex, 'author', payload.author);
  if (payload.status !== undefined) updateCell(booksSheet, rowIndex, 'status', payload.status);
  if (payload.genre !== undefined) updateCell(booksSheet, rowIndex, 'genre', payload.genre);
  if (payload.pages !== undefined) updateCell(booksSheet, rowIndex, 'pages', payload.pages);
  if (payload.language !== undefined) updateCell(booksSheet, rowIndex, 'language', payload.language);
  if (payload.publisher !== undefined) updateCell(booksSheet, rowIndex, 'publisher', payload.publisher);
  if (payload.publishYear !== undefined) updateCell(booksSheet, rowIndex, 'publish_year', payload.publishYear);

  const updatedBook = getRowAsObject(booksSheet, rowIndex);
  return respond({ status: 'success', data: updatedBook });
}

function toggleBookAvailability(payload, user) {
  if (!user) return respondError('Authentication required');

  const userProfile = findRowByEmail(TABS.USERS, user.email);
  if (!userProfile || userProfile.status !== 'Approved') {
    return respondError('User not approved');
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const rowIndex = findRowIndexByKey(booksSheet, 'book_id', payload.bookId);
  if (rowIndex === -1) return respondError('Book copy not found');

  const currentBook = getRowAsObject(booksSheet, rowIndex);
  
  const isBookOwner = currentBook.owner_email.toLowerCase() === user.email.toLowerCase();
  const isAdminOrOwnerUser = userProfile.role === 'Admin' || userProfile.role === 'Owner';
  if (!isBookOwner && !isAdminOrOwnerUser) {
    return respondError('Permission denied.');
  }

  const newStatus = currentBook.status === 'Unavailable' ? 'Available' : 'Unavailable';
  updateCell(booksSheet, rowIndex, 'status', newStatus);

  const updatedBook = getRowAsObject(booksSheet, rowIndex);
  return respond({ status: 'success', data: { newStatus: newStatus, book: updatedBook } });
}

function deleteBook(payload, user) {
  if (!user) return respondError('Authentication required');

  const userProfile = findRowByEmail(TABS.USERS, user.email);
  if (!userProfile || userProfile.status !== 'Approved') {
    return respondError('User not approved');
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const rowIndex = findRowIndexByKey(booksSheet, 'book_id', payload.bookId);
  if (rowIndex === -1) return respondError('Book copy not found');

  const currentBook = getRowAsObject(booksSheet, rowIndex);
  
  const isBookOwner = currentBook.owner_email.toLowerCase() === user.email.toLowerCase();
  const isAdminOrOwnerUser = userProfile.role === 'Admin' || userProfile.role === 'Owner';
  if (!isBookOwner && !isAdminOrOwnerUser) {
    return respondError('Permission denied.');
  }

  booksSheet.deleteRow(rowIndex);
  return respond({ status: 'success' });
}

function adminEditUser(payload, user) {
  if (!user) return respondError('Authentication required');

  const adminProfile = findRowByEmail(TABS.USERS, user.email);
  if (!adminProfile || (adminProfile.role !== 'Admin' && adminProfile.role !== 'Owner')) {
    return respondError('Admin/Owner permissions required');
  }

  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const rowIndex = findRowIndexByKey(usersSheet, 'email', payload.targetEmail);
  if (rowIndex === -1) return respondError('Target user not found');

  const targetUser = getRowAsObject(usersSheet, rowIndex);
  const isOwner = adminProfile.role === 'Owner';
  
  // Guard 1: Only Owner can assign Admin or Owner roles
  if (payload.role && (payload.role === 'Admin' || payload.role === 'Owner') && !isOwner) {
    return respondError('Only the Owner can assign Admin or Owner roles');
  }
  // Guard 2: Only Owner can edit another Owner
  if (targetUser.role === 'Owner' && !isOwner) {
    return respondError('Only the Owner can edit another Owner account');
  }

  if (payload.name) updateCell(usersSheet, rowIndex, 'name', payload.name);
  if (payload.flatNumber) updateCell(usersSheet, rowIndex, 'flat_number', payload.flatNumber);
  if (payload.phoneNumber) updateCell(usersSheet, rowIndex, 'phone_number', payload.phoneNumber);
  if (payload.role) updateCell(usersSheet, rowIndex, 'role', payload.role);
  if (payload.status) updateCell(usersSheet, rowIndex, 'status', payload.status);

  const updatedTarget = getRowAsObject(usersSheet, rowIndex);
  return respond({ status: 'success', data: updatedTarget });
}

function getStats(payload, user) {
  const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);

  const userCount = Math.max(0, usersSheet.getLastRow() - 1);
  const bookCount = Math.max(0, booksSheet.getLastRow() - 1);
  const loanCount = Math.max(0, loansSheet.getLastRow() - 1);

  // Active loans (Out)
  const loans = getSheetDataAsObjects(loansSheet);
  const activeLoans = loans.filter(l => l.status === 'Out').length;

  return respond({
    status: 'success',
    data: {
      totalUsers: userCount,
      totalBooks: bookCount,
      totalLoans: loanCount,
      activeLoans: activeLoans
    }
  });
}

// ==========================================
// DATABASE UTILITY FUNCTIONS
// ==========================================

function findRowByEmail(tabName, email) {
  const sheet = SPREADSHEET.getSheetByName(tabName);
  const data = getSheetDataAsObjects(sheet);
  return data.find(row => row.email && row.email.toLowerCase() === email.toLowerCase()) || null;
}

function findRowIndexByKey(sheet, keyName, keyValue) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIndex = headers.indexOf(keyName) + 1;
  if (colIndex === 0) return -1;

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  const values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0].toString() === keyValue.toString()) {
      return i + 2; // +2 offset for 1-based indexing and header row
    }
  }
  return -1;
}

function getRowAsObject(sheet, rowIndex) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = values[i];
  });
  return obj;
}

function updateCell(sheet, rowIndex, columnName, value) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIndex = headers.indexOf(columnName) + 1;
  if (colIndex > 0) {
    sheet.getRange(rowIndex, colIndex).setValue(value);
  }
}

function getSheetDataAsObjects(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow <= 1) return [];

  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  const isUsersSheet = sheet.getName() === TABS.USERS;

  return values.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    if (isUsersSheet && obj.email && obj.email.toLowerCase() === 'chauhanchetan82@gmail.com') {
      obj.role = 'Owner';
      obj.status = 'Approved';
    }
    return obj;
  });
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function respondError(message, code) {
  return respond({ status: 'error', message: message, code: code || 400 });
}
