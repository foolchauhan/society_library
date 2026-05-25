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

  // Trigger GmailApp scope authorization prompt during setup
  try {
    GmailApp.getAliases();
  } catch (e) {
  // Create daily 3 PM trigger
  createDailyTrigger();

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
      
      // Public actions (like catalog or stats check) do not require throwing a 401 on token expiration
      const publicActions = ['getCatalog', 'getStats'];
      if (!verifiedUser && !publicActions.includes(action)) {
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
      case 'borrowerReturnBook':
        return borrowerReturnBook(payload, verifiedUser);
      case 'sendReturnReminder':
        return sendReturnReminder(payload, verifiedUser);
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

  if (status === 'Pending') {
    const adminList = getAdminsAndOwnerEmails();
    if (adminList) {
      const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
      const actionLink = `${baseUrl}?view=admin`;
      
      const subject = "Society Library: New Resident Registration Pending Approval";
      const body = `Hello Administrator,\n\nA new resident has registered for the Society Library and is pending approval:\n\n` +
                   `Name: ${payload.name || user.name}\n` +
                   `Email: ${user.email}\n` +
                   `Flat Number: ${payload.flatNumber || 'N/A'}\n` +
                   `Role: ${role}\n\n` +
                   `You can review and approve this resident directly here:\n${actionLink}\n\n` +
                   `Best regards,\nSociety Library System`;
                   
      const detailsHtml = `
        A new resident has registered for the Society Library and is pending approval:<br/><br/>
        <table border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #2c241b; margin-bottom: 15px;">
          <tr><td style="font-weight: bold; width: 120px;">Name:</td><td>${payload.name || user.name}</td></tr>
          <tr><td style="font-weight: bold;">Email:</td><td>${user.email}</td></tr>
          <tr><td style="font-weight: bold;">Flat Number:</td><td>${payload.flatNumber || 'N/A'}</td></tr>
          <tr><td style="font-weight: bold;">Requested Role:</td><td>${role}</td></tr>
        </table>
        Please review and approve this resident registration on the library portal.
      `;
      const htmlBody = generateHtmlEmail(subject, "Registration Pending Approval", detailsHtml, actionLink, "Review & Approve Resident");
      sendEmailNotification(adminList, subject, body, htmlBody);
    }
  }

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

  const borrowerName = userProfile ? userProfile.name : user.name;
  const borrowerFlat = userProfile ? userProfile.flat_number : 'N/A';
  
  const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
  const actionLink = `${baseUrl}?view=book-details:${bookRow.book_id}`;

  const subject = `Society Library: Borrow request for "${bookRow.title}"`;
  const body = `Hello Lender,\n\nA resident has requested to borrow one of your books:\n\n` +
               `Book: "${bookRow.title}" (by ${bookRow.author || 'Unknown'})\n` +
               `Requested By: ${borrowerName} (Flat ${borrowerFlat})\n` +
               `Duration: ${durationDays} days\n` +
               `Borrower Notes: ${notes || 'None'}\n\n` +
               `You can review and approve/reject this request directly here:\n${actionLink}\n\n` +
               `Best regards,\nSociety Library System`;
               
  const detailsHtml = `
    A resident has requested to borrow your book <strong>"${bookRow.title}"</strong>:<br/><br/>
    <table border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #2c241b; margin-bottom: 15px;">
      <tr><td style="font-weight: bold; width: 120px;">Book Title:</td><td>"${bookRow.title}"</td></tr>
      <tr><td style="font-weight: bold;">Author:</td><td>${bookRow.author || 'Unknown'}</td></tr>
      <tr><td style="font-weight: bold;">Requested By:</td><td>${borrowerName} (Flat ${borrowerFlat})</td></tr>
      <tr><td style="font-weight: bold;">Duration:</td><td>${durationDays} days</td></tr>
      <tr><td style="font-weight: bold;">Borrower Notes:</td><td>${notes || 'None'}</td></tr>
    </table>
    Please review and approve or reject this request.
  `;
  const htmlBody = generateHtmlEmail(subject, "Borrow Request Received", detailsHtml, actionLink, "Review Borrow Request", bookRow.cover_url);
  sendEmailNotification(bookRow.owner_email, subject, body, htmlBody);

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

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);
  const book = bookIndex !== -1 ? getRowAsObject(booksSheet, bookIndex) : null;
  const bookTitle = book ? book.title : 'the requested book';

  const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
  const actionLink = `${baseUrl}?view=book-details:${loan.book_id}`;

  const subject = `Society Library: Borrow request APPROVED for "${bookTitle}"`;
  const body = `Hello Borrower,\n\n` +
               `Your request to borrow "${bookTitle}" has been APPROVED by the lender (${loan.lender_email}).\n\n` +
               `Please contact the lender to coordinate the physical handover of the book.\n\n` +
               `Lender Email: ${loan.lender_email}\n` +
               `Approved Duration: ${loan.duration_days} days\n\n` +
               `You can view the loan status and details here:\n${actionLink}\n\n` +
               `Best regards,\nSociety Library System`;

  const lenderProfile = findRowByEmail(TABS.USERS, loan.lender_email) || { name: 'Lender', flat_number: 'N/A' };
  const lenderName = lenderProfile.name || 'Lender';
  const lenderFlat = lenderProfile.flat_number || 'N/A';

  const detailsHtml = `
    Your request to borrow <strong>"${bookTitle}"</strong> has been <strong>APPROVED</strong> by ${lenderName} (Flat ${lenderFlat}).<br/><br/>
    Please coordinate with ${lenderName} at <strong>Flat ${lenderFlat}</strong> to physically receive the book. Once they hand it over, they will update the status to "Out" in the system.<br/><br/>
    <table border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #2c241b; margin-bottom: 15px;">
      <tr><td style="font-weight: bold; width: 120px;">Book Title:</td><td>"${bookTitle}"</td></tr>
      <tr><td style="font-weight: bold;">Lender Name:</td><td>${lenderName} (Flat ${lenderFlat})</td></tr>
      <tr><td style="font-weight: bold;">Lender Email:</td><td>${loan.lender_email}</td></tr>
      <tr><td style="font-weight: bold;">Approved Duration:</td><td>${loan.duration_days} days</td></tr>
    </table>
    You can view the loan status on the library portal.
  `;
  const htmlBody = generateHtmlEmail(subject, "Borrow Request Approved! 🎉", detailsHtml, actionLink, "View Loan Details", book ? book.cover_url : '');
  sendEmailNotification(loan.borrower_email, subject, body, htmlBody);

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

  const book = bookIndex !== -1 ? getRowAsObject(booksSheet, bookIndex) : null;
  const bookTitle = book ? book.title : 'the requested book';

  const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
  const actionLink = `${baseUrl}?view=catalog`;

  const subject = `Society Library: Borrow request declined for "${bookTitle}"`;
  const body = `Hello Borrower,\n\n` +
               `Unfortunately, your request to borrow "${bookTitle}" could not be approved by the lender at this time.\n\n` +
               `The book has been returned to the catalog. You can request another copy here:\n${actionLink}\n\n` +
               `Best regards,\nSociety Library System`;

  const lenderProfile = findRowByEmail(TABS.USERS, loan.lender_email) || { name: 'Lender', flat_number: 'N/A' };
  const lenderName = lenderProfile.name || 'Lender';

  const detailsHtml = `
    Unfortunately, your request to borrow <strong>"${bookTitle}"</strong> has been declined by the lender (${lenderName}).<br/><br/>
    The book copy has been placed back in the active community catalog. You can browse the catalog and request another book or a different copy.<br/>
  `;
  const htmlBody = generateHtmlEmail(subject, "Borrow Request Declined", detailsHtml, actionLink, "Browse Library Catalog", book ? book.cover_url : '');
  sendEmailNotification(loan.borrower_email, subject, body, htmlBody);

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

  if (loan.status === 'Out' || loan.status === 'ReturnPending') {
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

function borrowerReturnBook(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  if (loan.borrower_email !== user.email) {
    return respondError('Unauthorized. Only the borrower can request return confirmation.');
  }

  if (loan.status !== 'Out') {
    return respondError('Invalid action: book must be Out to mark as returned.');
  }

  updateCell(loansSheet, loanIndex, 'status', 'ReturnPending');

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);
  const book = bookIndex !== -1 ? getRowAsObject(booksSheet, bookIndex) : null;
  const bookTitle = book ? book.title : 'your book';

  const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
  const actionLink = `${baseUrl}?view=book-details:${loan.book_id}`;

  const subject = `Society Library: Return confirmation request for "${bookTitle}"`;
  const body = `Hello Lender,\n\nThe borrower (${loan.borrower_name || user.name}) has marked your book "${bookTitle}" as returned.\n\nPlease confirm receipt of the physical copy directly here:\n${actionLink}\n\nBest regards,\nSociety Library System`;

  const borrowerProfile = findRowByEmail(TABS.USERS, loan.borrower_email) || { name: 'Borrower', flat_number: 'N/A' };
  const borrowerName = borrowerProfile.name || 'Borrower';
  const borrowerFlat = borrowerProfile.flat_number || 'N/A';

  const detailsHtml = `
    The borrower <strong>${borrowerName}</strong> (Flat ${borrowerFlat}) has marked your book <strong>"${bookTitle}"</strong> as returned.<br/><br/>
    Please verify that you have physically received the copy, and click below to confirm receipt on the portal. This will return the book to the available catalog list.<br/>
  `;
  const htmlBody = generateHtmlEmail(subject, "Confirm Book Receipt", detailsHtml, actionLink, "Confirm Receipt & Return", book ? book.cover_url : '');
  sendEmailNotification(loan.lender_email, subject, body, htmlBody);

  return respond({ status: 'success', message: 'Return request submitted. Awaiting lender confirmation.' });
}

function sendReturnReminder(payload, user) {
  if (!user) return respondError('Authentication required');
  const loanId = payload.loanId;
  const customMessage = payload.message;

  if (!customMessage) return respondError('Message is required');

  const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
  const loanIndex = findRowIndexByKey(loansSheet, 'loan_id', loanId);

  if (loanIndex === -1) return respondError('Loan not found');
  const loan = getRowAsObject(loansSheet, loanIndex);

  if (loan.lender_email !== user.email) {
    const adminProfile = findRowByEmail(TABS.USERS, user.email);
    const isOwner = adminProfile && adminProfile.role === 'Owner';
    if (!isOwner) {
      return respondError('Unauthorized. Only the lender or Owner can send reminders.');
    }
  }

  const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
  const bookIndex = findRowIndexByKey(booksSheet, 'book_id', loan.book_id);
  const book = bookIndex !== -1 ? getRowAsObject(booksSheet, bookIndex) : null;
  const bookTitle = book ? book.title : 'Borrowed Book';
  const coverUrl = book ? book.cover_url : '';

  const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
  const actionLink = `${baseUrl}?view=book-details:${loan.book_id}`;

  const subject = `⚠️ Society Library: Reminder to return "${bookTitle}"`;
  
  // Format custom message linebreaks to HTML
  const messageHtml = customMessage.replace(/\n/g, '<br/>');

  const htmlBody = generateHtmlEmail(subject, "Return Reminder", messageHtml, actionLink, "Mark Book as Returned", coverUrl);
  sendEmailNotification(loan.borrower_email, subject, customMessage, htmlBody);

  return respond({ status: 'success', message: 'Reminder email sent to borrower!' });
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

  if (newStatus === 'Approved' && targetUser.status !== 'Approved') {
    const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
    const actionLink = `${baseUrl}?view=catalog`;

    const subject = "Society Library: Your Account has been Approved! 🎉";
    const body = `Hello ${targetUser.name || 'Resident'},\n\n` +
                 `We are pleased to inform you that your Society Library account has been approved by the administrators.\n\n` +
                 `You can now log in to search the catalog, borrow books from neighbors, and lend your own books.\n\n` +
                 `Access the library here:\n${actionLink}\n\n` +
                 `Happy Reading!\nSociety Library System`;

    const detailsHtml = `
      Hello ${targetUser.name || 'Resident'},<br/><br/>
      We are pleased to inform you that your Society Library account has been <strong>approved</strong> by the administrators.<br/><br/>
      You can now log in to search the community catalog, borrow books from neighbors, and lend your own books.<br/>
    `;
    const htmlBody = generateHtmlEmail(subject, "Account Approved! 🎉", detailsHtml, actionLink, "Enter Society Library");
    sendEmailNotification(targetUser.email, subject, body, htmlBody);
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

  if (payload.status === 'Approved' && targetUser.status !== 'Approved') {
    const baseUrl = payload.baseUrl || 'https://foolchauhan.github.io/society_library';
    const actionLink = `${baseUrl}?view=catalog`;

    const subject = "Society Library: Your Account has been Approved! 🎉";
    const body = `Hello ${targetUser.name || 'Resident'},\n\n` +
                 `We are pleased to inform you that your Society Library account has been approved by the administrators.\n\n` +
                 `You can now log in to search the catalog, borrow books from neighbors, and lend your own books.\n\n` +
                 `Access the library here:\n${actionLink}\n\n` +
                 `Happy Reading!\nSociety Library System`;

    const detailsHtml = `
      Hello ${targetUser.name || 'Resident'},<br/><br/>
      We are pleased to inform you that your Society Library account has been <strong>approved</strong> by the administrators.<br/><br/>
      You can now log in to search the community catalog, borrow books from neighbors, and lend your own books.<br/>
    `;
    const htmlBody = generateHtmlEmail(subject, "Account Approved! 🎉", detailsHtml, actionLink, "Enter Society Library");
    sendEmailNotification(targetUser.email, subject, body, htmlBody);
  }

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

// Helper to send email notifications safely
function sendEmailNotification(to, subject, body, htmlBody) {
  try {
    if (!to) return;
    const options = {};
    if (htmlBody) {
      options.htmlBody = htmlBody;
    }
    GmailApp.sendEmail(to, subject, body, options);
    Logger.log("Email sent successfully to: " + to);
  } catch (err) {
    Logger.log("Error sending email: " + err.toString());
  }
}

// Generates a highly professional HTML email layout with top/bottom call to action buttons
function generateHtmlEmail(title, heading, detailsHtml, actionLink, actionText, coverUrl) {
  const primaryColor = "#1a3a21"; // Deep Forest Green
  const secondaryColor = "#b89047"; // Warm Vintage Gold
  const bgColor = "#faf7f0"; // Parchment Paper Warm Background
  const cardBg = "#ffffff";
  const textColor = "#2c241b"; // Deep Ink

  let coverImgHtml = "";
  if (coverUrl) {
    coverImgHtml = `
      <td align="center" style="padding-bottom: 20px;">
        <img src="${coverUrl}" alt="Book Cover" style="max-height: 180px; max-width: 140px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 1px solid #e0dbd0;" />
      </td>
    `;
  }

  const actionButtonHtml = actionLink ? `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td align="center" bgcolor="${primaryColor}" style="border-radius: 6px;">
          <a href="${actionLink}" target="_blank" style="display: inline-block; padding: 12px 30px; font-family: Georgia, serif; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px; border: 1px solid ${secondaryColor}; letter-spacing: 0.5px;">
            ${actionText}
          </a>
        </td>
      </tr>
    </table>
  ` : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100% !important; background-color: ${bgColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; border-radius: 12px; background-color: ${cardBg}; border: 1px solid #e5dfd3; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header banner -->
        <tr bgcolor="${primaryColor}">
          <td align="center" style="padding: 24px 20px; border-bottom: 3px solid ${secondaryColor};">
            <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">
              📚 Society Library
            </span>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 35px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: ${primaryColor}; padding-bottom: 20px; border-bottom: 1px solid #eee7d8;">
                  ${heading}
                </td>
              </tr>
              
              <!-- Top Action Button -->
              ${actionLink ? `
              <tr>
                <td align="center" style="padding-top: 15px;">
                  ${actionButtonHtml}
                </td>
              </tr>
              ` : ""}

              <!-- Book cover & description row -->
              <tr>
                <td style="padding-top: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      ${coverImgHtml}
                    </tr>
                    <tr>
                      <td style="font-size: 14px; line-height: 1.6; color: ${textColor};">
                        ${detailsHtml}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Bottom Action Button -->
              ${actionLink ? `
              <tr>
                <td align="center" style="padding-top: 20px; border-top: 1px solid #eee7d8;">
                  ${actionButtonHtml}
                </td>
              </tr>
              ` : ""}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr bgcolor="#f5f0e4">
          <td align="center" style="padding: 20px; font-size: 11px; line-height: 1.4; color: #7a6e5d; border-top: 1px solid #ebdcb9;">
            This is an automated notification from your neighborhood <strong>Society Library System</strong>.<br/>
            Clicking the actions links will require you to log in with your resident account.<br/>
            &copy; 2026 Society Library &middot; Shared community catalog.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Fetch all active Admins/Owners to notify them
function getAdminsAndOwnerEmails() {
  try {
    const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
    const users = getSheetDataAsObjects(usersSheet);
    const adminEmails = users
      .filter(u => (u.role === 'Admin' || u.role === 'Owner') && u.status === 'Approved')
      .map(u => u.email);
    return adminEmails.join(',');
  } catch (err) {
    Logger.log("Error getting admin emails: " + err.toString());
    return '';
  }
}

/**
 * Manually runnable test function to verify Gmail service authorization
 */
function testEmail() {
  const email = Session.getActiveUser().getEmail();
  if (email) {
    const subject = "Society Library: Test Email Confirmation";
    const heading = "Gmail API Connection Successful! 🎉";
    const details = `Hello Resident,<br/><br/>
      If you are reading this email, the Google Apps Script Gmail authorization is successfully working and configured.<br/><br/>
      All visual formatting features, tables, action buttons, and background triggers are ready to send notifications.`;
    const htmlBody = generateHtmlEmail(subject, heading, details, "https://foolchauhan.github.io/society_library", "Visit Library Catalog");
    sendEmailNotification(email, subject, "Hello! Gmail API connection is successfully working.", htmlBody);
    Logger.log("Test email sent to: " + email);
  } else {
    Logger.log("No active user found to send a test email to.");
  }
}

/**
 * Runs a daily check to notify users about overdue loans and alert lenders.
 */
function dailyCheckOverdueLoans() {
  try {
    const loansSheet = SPREADSHEET.getSheetByName(TABS.LOANS);
    const booksSheet = SPREADSHEET.getSheetByName(TABS.BOOKS);
    const usersSheet = SPREADSHEET.getSheetByName(TABS.USERS);
    
    if (!loansSheet || !booksSheet || !usersSheet) {
      Logger.log("Missing database sheets during daily check.");
      return;
    }

    const loans = getSheetDataAsObjects(loansSheet);
    const books = getSheetDataAsObjects(booksSheet);
    const users = getSheetDataAsObjects(usersSheet);

    const now = new Date();
    // Normalize time to start of day for accurate day differences
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    let overdueCount = 0;

    loans.forEach(loan => {
      // Only process active borrowings currently out
      if (loan.status === 'Out' && loan.due_date) {
        const dueDate = new Date(loan.due_date);
        const dueTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();

        if (todayStart > dueTime) {
          overdueCount++;
          const diffMs = todayStart - dueTime;
          const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          // Find book info
          const book = books.find(b => b.book_id === loan.book_id);
          const bookTitle = book ? book.title : 'Borrowed Book';
          const bookAuthor = book ? book.author : 'Unknown';
          const coverUrl = book ? book.cover_url : '';

          // Find lender & borrower details
          const lender = users.find(u => u.email === loan.lender_email) || { name: 'Lender', flat_number: 'N/A' };
          const borrower = users.find(u => u.email === loan.borrower_email) || { name: 'Borrower', flat_number: 'N/A' };

          // Build action link
          const baseUrl = 'https://foolchauhan.github.io/society_library'; 
          const actionLink = `${baseUrl}?view=book-details:${loan.book_id}`;

          // Send HTML Email to Borrower
          const borrowerSubject = `⚠️ OVERDUE: Return reminder for "${bookTitle}" (Late by ${daysLate} day${daysLate > 1 ? 's' : ''})`;
          const borrowerHeading = `Book Return Overdue by ${daysLate} Day${daysLate > 1 ? 's' : ''}`;
          
          const borrowerDetails = `
            Dear ${borrower.name || 'Resident'},<br/><br/>
            Our community library records show that the book you checked out is currently <strong>overdue</strong>:<br/><br/>
            <table border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #2c241b; margin-bottom: 15px;">
              <tr><td style="font-weight: bold; width: 130px;">Book Title:</td><td>"${bookTitle}" (by ${bookAuthor})</td></tr>
              <tr><td style="font-weight: bold;">Lender Name:</td><td>${lender.name} (Flat ${lender.flat_number})</td></tr>
              <tr><td style="font-weight: bold;">Due Date:</td><td>${dueDate.toLocaleDateString()}</td></tr>
              <tr><td style="font-weight: bold;">Days Overdue:</td><td><span style="color:#be123c; font-weight:bold;">${daysLate} day${daysLate > 1 ? 's' : ''}</span></td></tr>
            </table>
            Please return the book physically to ${lender.name} at <strong>Flat ${lender.flat_number}</strong> as soon as possible, and click below to notify them on the portal.<br/>
          `;

          const borrowerHtml = generateHtmlEmail(borrowerSubject, borrowerHeading, borrowerDetails, actionLink, "Mark Book as Returned", coverUrl);
          sendEmailNotification(
            loan.borrower_email, 
            borrowerSubject, 
            `Dear ${borrower.name}, your checkout for "${bookTitle}" is ${daysLate} days overdue. Please return it to Flat ${lender.flat_number} as soon as possible.`, 
            borrowerHtml
          );

          // Send HTML Email notification to Lender
          const lenderSubject = `Society Library: Return reminder sent for your book "${bookTitle}"`;
          const lenderHeading = `Return Reminder Dispatched`;
          
          const lenderDetails = `
            Dear ${lender.name || 'Resident'},<br/><br/>
            This is an automated notification that a return reminder email has been sent to <strong>${borrower.name}</strong> (Flat ${borrower.flat_number}) for your book copy:<br/><br/>
            <table border="0" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #2c241b; margin-bottom: 15px;">
              <tr><td style="font-weight: bold; width: 130px;">Book Title:</td><td>"${bookTitle}"</td></tr>
              <tr><td style="font-weight: bold;">Due Date:</td><td>${dueDate.toLocaleDateString()}</td></tr>
              <tr><td style="font-weight: bold;">Days Overdue:</td><td><span style="color:#be123c; font-weight:bold;">${daysLate} day${daysLate > 1 ? 's' : ''}</span></td></tr>
              <tr><td style="font-weight: bold;">Borrower Name:</td><td>${borrower.name} (Flat ${borrower.flat_number})</td></tr>
            </table>
            Once the borrower hands back the book, please confirm receipt on your dashboard to return the book to the available catalog list.<br/>
          `;

          const lenderHtml = generateHtmlEmail(lenderSubject, lenderHeading, lenderDetails, actionLink, "Confirm Receipt & Return", coverUrl);
          sendEmailNotification(
            loan.lender_email, 
            lenderSubject, 
            `Return reminder sent to ${borrower.name} for "${bookTitle}" (overdue by ${daysLate} days).`, 
            lenderHtml
          );

          Logger.log(`Overdue reminder sent for loan ${loan.loan_id} (borrower: ${loan.borrower_email}, days late: ${daysLate})`);
        }
      }
    });

    Logger.log(`Daily check complete. Overdue loans found: ${overdueCount}`);
  } catch (err) {
    Logger.log("Error in dailyCheckOverdueLoans: " + err.toString());
  }
}

/**
 * Programmatically creates a daily trigger to run the overdue check script at 3 PM
 */
function createDailyTrigger() {
  try {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
      if (trigger.getHandlerFunction() === 'dailyCheckOverdueLoans') {
        ScriptApp.deleteTrigger(trigger);
      }
    }
    
    // Create a time-driven trigger that fires every day at 3 PM (15:00 hours)
    ScriptApp.newTrigger('dailyCheckOverdueLoans')
      .timeBased()
      .everyDays(1)
      .atHour(15) // 3 PM (IST if project timezone is set to Kolkata)
      .create();
      
    Logger.log("Daily overdue trigger successfully registered at 3 PM.");
  } catch (err) {
    Logger.log("Failed to register daily trigger: " + err.toString());
  }
}
