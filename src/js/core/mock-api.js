/**
 * Society Library Management System - Local Mock Database (LocalStorage fallback)
 */

function getToken() {
  return localStorage.getItem('lib_token') || null;
}

export function initMockDatabase() {
  let users = localStorage.getItem('lib_users');
  let books = localStorage.getItem('lib_books');
  let loans = localStorage.getItem('lib_loans');

  // Automatically migrate/reset if old flat formats (containing no ':') are detected
  if (users) {
    try {
      const usersList = JSON.parse(users);
      const hasOldFlats = usersList.some(u => u.flat_number && !u.flat_number.includes(':'));
      if (hasOldFlats) {
        console.log("[SocietyLibrary] Old flat format detected, resetting mock database for migration...");
        localStorage.removeItem('lib_users');
        localStorage.removeItem('lib_books');
        localStorage.removeItem('lib_loans');
        users = null;
        books = null;
        loans = null;
      }
    } catch (e) {
      console.error("Failed to parse users for migration", e);
    }
  }

  // Seed mock data if database is empty
  if (!users || JSON.parse(users).length === 0) {
    const seedUsers = [
      { email: 'chauhanchetan82@gmail.com', name: 'Chetan Chauhan', flat_number: 'A2:820', phone_number: '8334053394', role: 'Owner', status: 'Approved', created_at: new Date().toISOString() },
      { email: 'admin@society.org', name: 'Society Library Admin', flat_number: 'A1:000', phone_number: '9999999999', role: 'Admin', status: 'Approved', created_at: new Date().toISOString() },
      { email: 'lender1@society.org', name: 'Amit Sharma', flat_number: 'A1:405', phone_number: '9876543210', role: 'Both', status: 'Approved', created_at: new Date().toISOString() },
      { email: 'lender2@society.org', name: 'Sarah D\'souza', flat_number: 'A2:715', phone_number: '9812345678', role: 'Lender', status: 'Approved', created_at: new Date().toISOString() },
      { email: 'borrower1@society.org', name: 'Rajesh Patel', flat_number: 'B1:126', phone_number: '9012345678', role: 'Borrower', status: 'Approved', created_at: new Date().toISOString() },
      { email: 'newguy@society.org', name: 'Vikram Singh', flat_number: 'B2:335', phone_number: '9234567890', role: 'Borrower', status: 'Pending', created_at: new Date().toISOString() }
    ];
    localStorage.setItem('lib_users', JSON.stringify(seedUsers));
  }

  if (!books || JSON.parse(books).length === 0) {
    const seedBooks = [
      { book_id: 'B-seed-1', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780261102217', cover_url: 'https://covers.openlibrary.org/b/id/8405742-L.jpg', genre: 'Fantasy, Adventure', pages: '310', language: 'English', publisher: 'George Allen & Unwin', publish_year: '1937', owner_email: 'lender1@society.org', copy_number: '1', status: 'Available', created_at: new Date().toISOString() },
      { book_id: 'B-seed-2', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780261102217', cover_url: 'https://covers.openlibrary.org/b/id/8405742-L.jpg', genre: 'Fantasy, Adventure', pages: '310', language: 'English', publisher: 'George Allen & Unwin', publish_year: '1937', owner_email: 'lender1@society.org', copy_number: '2', status: 'Borrowed', created_at: new Date().toISOString() },
      { book_id: 'B-seed-3', title: '1984', author: 'George Orwell', isbn: '9780451524935', cover_url: 'https://covers.openlibrary.org/b/id/12836245-L.jpg', genre: 'Dystopian, Political Fiction', pages: '328', language: 'English', publisher: 'Secker & Warburg', publish_year: '1949', owner_email: 'lender1@society.org', copy_number: '1', status: 'Requested', created_at: new Date().toISOString() },
      
      { book_id: 'B-seed-4', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780261102217', cover_url: 'https://covers.openlibrary.org/b/id/8405742-L.jpg', genre: 'Fantasy, Adventure', pages: '310', language: 'English', publisher: 'George Allen & Unwin', publish_year: '1937', owner_email: 'lender2@society.org', copy_number: '1', status: 'Available', created_at: new Date().toISOString() },
      { book_id: 'B-seed-5', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780446310789', cover_url: 'https://covers.openlibrary.org/b/id/8225266-L.jpg', genre: 'Fiction, Historical', pages: '281', language: 'English', publisher: 'J.B. Lippincott & Co.', publish_year: '1960', owner_email: 'lender2@society.org', copy_number: '1', status: 'Available', created_at: new Date().toISOString() },
      { book_id: 'B-seed-6', title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', cover_url: 'https://covers.openlibrary.org/b/id/10237775-L.jpg', genre: 'Science Fiction, Epic', pages: '688', language: 'English', publisher: 'Chilton Books', publish_year: '1965', owner_email: 'lender2@society.org', copy_number: '1', status: 'Available', created_at: new Date().toISOString() }
    ];
    localStorage.setItem('lib_books', JSON.stringify(seedBooks));
  }

  if (!loans || JSON.parse(loans).length === 0) {
    const now = new Date();
    
    const requestedDate = new Date();
    requestedDate.setDate(now.getDate() - 2);

    const approvedDate = new Date();
    approvedDate.setDate(now.getDate() - 1);

    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 13); // 14 days duration

    const returnedDate = new Date();
    returnedDate.setDate(now.getDate() - 10);

    const seedLoans = [
      {
        loan_id: 'L-seed-1',
        book_id: 'B-seed-1',
        borrower_email: 'borrower1@society.org',
        lender_email: 'lender1@society.org',
        request_date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Returned',
        duration_days: 14,
        approval_date: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        handover_date: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: returnedDate.toISOString(),
        notes: 'Thanks for lending!'
      },
      {
        loan_id: 'L-seed-2',
        book_id: 'B-seed-2',
        borrower_email: 'borrower1@society.org',
        lender_email: 'lender1@society.org',
        request_date: requestedDate.toISOString(),
        status: 'Out',
        duration_days: 14,
        approval_date: approvedDate.toISOString(),
        handover_date: approvedDate.toISOString(),
        due_date: dueDate.toISOString(),
        return_date: '',
        notes: 'Doing a Tolkien marathon'
      },
      {
        loan_id: 'L-seed-3',
        book_id: 'B-seed-3',
        borrower_email: 'borrower1@society.org',
        lender_email: 'lender1@society.org',
        request_date: now.toISOString(),
        status: 'Requested',
        duration_days: 10,
        approval_date: '',
        handover_date: '',
        due_date: '',
        return_date: '',
        notes: 'Need this for school book report.'
      }
    ];
    localStorage.setItem('lib_loans', JSON.stringify(seedLoans));
  }
}

export function getMockCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const email = token.replace('mock-token-', '');
  
  const users = JSON.parse(localStorage.getItem('lib_users') || '[]');
  let user = users.find(u => u.email === email);
  
  if (email === 'chauhanchetan82@gmail.com') {
    if (!user) {
      user = {
        email: 'chauhanchetan82@gmail.com',
        name: 'Chetan Chauhan',
        flat_number: 'A2:820',
        phone_number: '8334053394',
        role: 'Owner',
        status: 'Approved',
        created_at: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem('lib_users', JSON.stringify(users));
    } else {
      let updated = false;
      if (user.role !== 'Owner') {
        user.role = 'Owner';
        updated = true;
      }
      if (user.status !== 'Approved') {
        user.status = 'Approved';
        updated = true;
      }
      if (updated) {
        localStorage.setItem('lib_users', JSON.stringify(users));
      }
    }
  }
  
  if (user) return user;
  
  return {
    email: email,
    name: email.split('@')[0],
    role: 'Both',
    status: 'Pending'
  };
}

export function executeMockAction(action, payload) {
  const users = JSON.parse(localStorage.getItem('lib_users') || '[]');
  const books = JSON.parse(localStorage.getItem('lib_books') || '[]');
  const loans = JSON.parse(localStorage.getItem('lib_loans') || '[]');

  const currentMockUser = getMockCurrentUser();
  const currentProfile = currentMockUser ? users.find(u => u.role && u.email === currentMockUser.email) : null;
  const isAdminOrOwner = (p) => p && (p.role === 'Admin' || p.role === 'Owner');
  const isOwnerRole    = (p) => p && p.role === 'Owner';

  switch (action) {
    case 'getUserProfile': {
      if (!currentMockUser) {
        return { status: 'error', message: 'Not authenticated', code: 401 };
      }
      
      let user = users.find(u => u.email === currentMockUser.email);
      
      if (currentMockUser.email === 'chauhanchetan82@gmail.com') {
        if (!user) {
          user = {
            email: 'chauhanchetan82@gmail.com',
            name: 'Chetan Chauhan',
            flat_number: 'A2:820',
            phone_number: '8334053394',
            role: 'Owner',
            status: 'Approved',
            created_at: new Date().toISOString()
          };
          users.push(user);
          localStorage.setItem('lib_users', JSON.stringify(users));
        } else {
          let updated = false;
          if (user.role !== 'Owner') {
            user.role = 'Owner';
            updated = true;
          }
          if (user.status !== 'Approved') {
            user.status = 'Approved';
            updated = true;
          }
          if (updated) {
            localStorage.setItem('lib_users', JSON.stringify(users));
          }
        }
      }

      if (!user) {
        return { status: 'not_registered', email: currentMockUser.email, name: currentMockUser.name };
      }
      return { status: 'success', data: user };
    }

    case 'registerUser': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      
      const existing = users.find(u => u.email === currentMockUser.email);
      if (existing) return { status: 'error', message: 'Already registered' };

      const isOwnerEmail = currentMockUser.email === 'chauhanchetan82@gmail.com';

      const newUser = {
        email: currentMockUser.email,
        name: isOwnerEmail ? 'Chetan Chauhan' : (payload.name || currentMockUser.name),
        flat_number: isOwnerEmail ? 'A2:820' : (payload.flatNumber || 'N/A'),
        phone_number: isOwnerEmail ? '8334053394' : (payload.phoneNumber || 'N/A'),
        role: isOwnerEmail ? 'Owner' : (payload.role || 'Both'),
        status: isOwnerEmail ? 'Approved' : 'Pending',
        created_at: new Date().toISOString()
      };

      if (users.length === 0 && !isOwnerEmail) {
        newUser.status = 'Approved';
        newUser.role = 'Admin';
      }

      users.push(newUser);
      localStorage.setItem('lib_users', JSON.stringify(users));

      return { status: 'success', data: newUser };
    }

    case 'getCatalog': {
      const userMap = {};
      users.forEach(u => {
        userMap[u.email] = { name: u.name, flat_number: u.flat_number, phone_number: u.phone_number };
      });

      const catalog = books.map(book => {
        const ownerInfo = userMap[book.owner_email] || { name: 'Unknown Owner', flat_number: 'N/A', phone_number: 'N/A' };
        
        let borrower_name = null;
        let borrower_flat = null;
        
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

      return { status: 'success', data: catalog };
    }

    case 'getLoans': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      
      const profile = users.find(u => u.email === currentMockUser.email);
      const isAdmin = profile && profile.role === 'Admin';

      const bookMap = {};
      books.forEach(b => { bookMap[b.book_id] = b; });

      const userMap = {};
      users.forEach(u => {
        userMap[u.email] = { name: u.name, flat_number: u.flat_number, phone_number: u.phone_number };
      });

      const filteredLoans = loans.filter(loan => {
        if (isAdmin) return true;
        return loan.borrower_email === currentMockUser.email || loan.lender_email === currentMockUser.email;
      });

      const formattedLoans = filteredLoans.map(loan => {
        const book = bookMap[loan.book_id] || { title: 'Unknown', author: 'Unknown', cover_url: '', owner_email: '' };
        const borrower = userMap[loan.borrower_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };
        const lender = userMap[loan.lender_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };
        const owner = userMap[book.owner_email] || { name: 'Unknown', flat_number: 'N/A', phone_number: 'N/A' };

        return {
          ...loan,
          book_title: book.title,
          book_author: book.author,
          book_cover: book.cover_url,
          book_owner_email: book.owner_email || '',
          book_owner_name: owner.name,
          book_owner_flat: owner.flat_number,
          book_owner_phone: owner.phone_number,
          borrower_name: borrower.name,
          borrower_flat: borrower.flat_number,
          borrower_phone: borrower.phone_number,
          lender_name: lender.name,
          lender_flat: lender.flat_number,
          lender_phone: lender.phone_number
        };
      });

      formattedLoans.sort((a, b) => new Date(b.request_date) - new Date(a.request_date));

      return { status: 'success', data: formattedLoans };
    }

    case 'addBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      
      const count = parseInt(payload.copies || '1', 10);
      const now = new Date().toISOString();
      const baseId = 'B-' + Date.now();
      const added = [];

      for (let i = 1; i <= count; i++) {
        const bookId = `${baseId}-${i}`;
        const newBook = {
          book_id: bookId,
          title: payload.title,
          author: payload.author || 'Unknown',
          isbn: payload.isbn || '',
          cover_url: payload.coverUrl || '',
          genre: payload.genre || '',
          pages: payload.pages || '',
          language: payload.language || '',
          publisher: payload.publisher || '',
          publish_year: payload.publishYear || '',
          owner_email: currentMockUser.email,
          copy_number: i.toString(),
          status: 'Available',
          created_at: now
        };
        books.push(newBook);
        added.push(newBook);
      }

      localStorage.setItem('lib_books', JSON.stringify(books));
      return { status: 'success', data: added };
    }

    case 'editBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const editBook = books.find(b => b.book_id === payload.bookId);
      if (!editBook) return { status: 'error', message: 'Book not found' };
      if (editBook.owner_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized: you do not own this book' };

      if (payload.author !== undefined) editBook.author = payload.author;
      if (payload.isbn !== undefined) editBook.isbn = payload.isbn;
      if (payload.coverUrl !== undefined) editBook.cover_url = payload.coverUrl;
      if (payload.genre !== undefined) editBook.genre = payload.genre;
      if (payload.pages !== undefined) editBook.pages = payload.pages;
      if (payload.language !== undefined) editBook.language = payload.language;
      if (payload.publisher !== undefined) editBook.publisher = payload.publisher;
      if (payload.publishYear !== undefined) editBook.publish_year = payload.publishYear;

      localStorage.setItem('lib_books', JSON.stringify(books));
      return { status: 'success', data: editBook };
    }

    case 'toggleBookAvailability': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const toggleBook = books.find(b => b.book_id === payload.bookId);
      if (!toggleBook) return { status: 'error', message: 'Book not found' };
      if (toggleBook.owner_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized: you do not own this book' };

      const hasActiveLoan = loans.some(l => l.book_id === payload.bookId && ['Requested','Approved','Out'].includes(l.status));
      if (hasActiveLoan) return { status: 'error', message: 'Cannot change availability while book has an active loan' };

      toggleBook.status = toggleBook.status === 'Unavailable' ? 'Available' : 'Unavailable';
      localStorage.setItem('lib_books', JSON.stringify(books));
      return { status: 'success', data: { newStatus: toggleBook.status } };
    }

    case 'deleteBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const delIdx = books.findIndex(b => b.book_id === payload.bookId);
      if (delIdx === -1) return { status: 'error', message: 'Book not found' };
      const delBook = books[delIdx];
      if (delBook.owner_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized: you do not own this book' };

      const hasActiveLoan = loans.some(l => l.book_id === payload.bookId && ['Requested','Approved','Out'].includes(l.status));
      if (hasActiveLoan) return { status: 'error', message: 'Cannot delete a book that has an active loan. Wait for it to be returned first.' };

      books.splice(delIdx, 1);
      localStorage.setItem('lib_books', JSON.stringify(books));
      return { status: 'success' };
    }

    case 'requestBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      
      const bookId = payload.bookId;
      const durationDays = parseInt(payload.durationDays || '14', 10);
      
      const book = books.find(b => b.book_id === bookId);
      if (!book) return { status: 'error', message: 'Book copy not found' };
      if (book.status !== 'Available') return { status: 'error', message: 'Book copy is not available' };
      if (book.owner_email === currentMockUser.email) return { status: 'error', message: 'Cannot borrow your own book!' };

      const loanId = 'L-' + Date.now();
      const now = new Date().toISOString();

      const newLoan = {
        loan_id: loanId,
        book_id: bookId,
        borrower_email: currentMockUser.email,
        lender_email: book.owner_email,
        request_date: now,
        status: 'Requested',
        duration_days: durationDays,
        approval_date: '',
        handover_date: '',
        due_date: '',
        return_date: '',
        notes: payload.notes || ''
      };

      loans.push(newLoan);
      localStorage.setItem('lib_loans', JSON.stringify(loans));

      book.status = 'Requested';
      localStorage.setItem('lib_books', JSON.stringify(books));

      return { status: 'success', loanId: loanId };
    }

    case 'approveLoan': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };
      if (loan.lender_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized' };

      loan.status = 'Approved';
      loan.approval_date = new Date().toISOString();
      localStorage.setItem('lib_loans', JSON.stringify(loans));

      return { status: 'success' };
    }

    case 'rejectLoan': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };
      if (loan.lender_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized' };

      loan.status = 'Rejected';
      
      const book = books.find(b => b.book_id === loan.book_id);
      if (book) book.status = 'Available';

      localStorage.setItem('lib_loans', JSON.stringify(loans));
      localStorage.setItem('lib_books', JSON.stringify(books));

      return { status: 'success' };
    }

    case 'handoverBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };
      if (loan.lender_email !== currentMockUser.email && loan.borrower_email !== currentMockUser.email && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized' };

      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + parseInt(loan.duration_days, 10));

      loan.status = 'Out';
      loan.handover_date = now.toISOString();
      loan.due_date = dueDate.toISOString();

      const book = books.find(b => b.book_id === loan.book_id);
      if (book) book.status = 'Borrowed';

      localStorage.setItem('lib_loans', JSON.stringify(loans));
      localStorage.setItem('lib_books', JSON.stringify(books));

      return { status: 'success' };
    }

    case 'returnBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };
      
      const isLender = loan.lender_email === currentMockUser.email;
      if (!isLender && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Unauthorized. Only the lender or Owner can mark books as returned.' };

      const book = books.find(b => b.book_id === loan.book_id);

      if (loan.status === 'Out' || loan.status === 'ReturnPending') {
        loan.status = 'Returned';
        loan.return_date = new Date().toISOString();
        
        if (book) book.status = 'Available';

        localStorage.setItem('lib_loans', JSON.stringify(loans));
        localStorage.setItem('lib_books', JSON.stringify(books));
        return { status: 'success', message: 'Book returned successfully!' };
      }

      return { status: 'error', message: 'Invalid action for loan status' };
    }

    case 'borrowerReturnBook': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };

      if (loan.borrower_email !== currentMockUser.email) {
        return { status: 'error', message: 'Unauthorized. Only the borrower can mark book as returned.' };
      }

      if (loan.status !== 'Out') {
        return { status: 'error', message: 'Invalid action for loan status' };
      }

      loan.status = 'ReturnPending';
      localStorage.setItem('lib_loans', JSON.stringify(loans));
      return { status: 'success', message: 'Return confirmation request sent to lender!' };
    }

    case 'sendReturnReminder': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const loan = loans.find(l => l.loan_id === payload.loanId);
      if (!loan) return { status: 'error', message: 'Loan not found' };

      if (loan.lender_email !== currentMockUser.email && !isOwnerRole(currentProfile)) {
        return { status: 'error', message: 'Unauthorized.' };
      }

      console.log(`[MOCK EMAIL] Sending return reminder to ${loan.borrower_email}:\n${payload.message}`);
      return { status: 'success', message: `Reminder email successfully simulated to ${loan.borrower_name}!` };
    }

    case 'adminGetUsers': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isAdminOrOwner(currentProfile)) return { status: 'error', message: 'Admin/Owner permissions required' };
      return { status: 'success', data: users };
    }

    case 'adminUpdateUserStatus': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isAdminOrOwner(currentProfile)) return { status: 'error', message: 'Admin/Owner permissions required' };

      const targetUser = users.find(u => u.email === payload.targetEmail);
      if (!targetUser) return { status: 'error', message: 'User not found' };

      if (['Admin','Owner'].includes(payload.role) && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Only the Owner can assign Admin or Owner roles' };
      if (targetUser.role === 'Owner' && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Only the Owner can modify another Owner account' };

      targetUser.status = payload.status;
      if (payload.role) targetUser.role = payload.role;

      localStorage.setItem('lib_users', JSON.stringify(users));
      return { status: 'success' };
    }

    case 'adminEditUser': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isAdminOrOwner(currentProfile)) return { status: 'error', message: 'Admin/Owner permissions required' };

      const editTarget = users.find(u => u.email === payload.targetEmail);
      if (!editTarget) return { status: 'error', message: 'User not found' };

      if (['Admin','Owner'].includes(payload.role) && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Only the Owner can assign Admin or Owner roles' };
      if (editTarget.role === 'Owner' && !isOwnerRole(currentProfile))
        return { status: 'error', message: 'Only the Owner can edit another Owner account' };

      if (payload.name) editTarget.name = payload.name;
      if (payload.flatNumber) editTarget.flat_number = payload.flatNumber;
      if (payload.phoneNumber) editTarget.phone_number = payload.phoneNumber;
      if (payload.role) editTarget.role = payload.role;
      if (payload.status) editTarget.status = payload.status;

      localStorage.setItem('lib_users', JSON.stringify(users));
      return { status: 'success', data: editTarget };
    }

    case 'updateMyProfile': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      const selfUser = users.find(u => u.email === currentMockUser.email);
      if (!selfUser) return { status: 'error', message: 'User not found' };

      if (payload.name) selfUser.name = payload.name;
      if (payload.flatNumber) selfUser.flat_number = payload.flatNumber;
      if (payload.phoneNumber) selfUser.phone_number = payload.phoneNumber;

      localStorage.setItem('lib_users', JSON.stringify(users));
      return { status: 'success', data: selfUser };
    }

    case 'getStats': {
      const activeCount = loans.filter(l => l.status === 'Out').length;
      return {
        status: 'success',
        data: {
          totalUsers: users.length,
          totalBooks: books.length,
          totalLoans: loans.length,
          activeLoans: activeCount
        }
      };
    }

    case 'adminGetAutomationSettings': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isOwnerRole(currentProfile)) return { status: 'error', message: 'Owner permissions required' };
      
      const defaultTriggers = {
        'dailyCheckOverdueLoans': { 'enabled': true, 'hour': 15 },
        'dailyCheckLenderActions': { 'enabled': true, 'hour': 15 },
        'dailyCheckPendingUserApprovals': { 'enabled': true, 'hour': 15 }
      };
      const defaultNotifications = {
        'borrow_requests': true,
        'return_actions': true,
        'user_registrations': true,
        'overdue_reminders': true
      };

      const triggers = JSON.parse(localStorage.getItem('lib_triggers') || JSON.stringify(defaultTriggers));
      const notifications = JSON.parse(localStorage.getItem('lib_notifications') || JSON.stringify(defaultNotifications));
      return { status: 'success', data: { triggers, notifications } };
    }

    case 'adminUpdateAutomationSettings': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isOwnerRole(currentProfile)) return { status: 'error', message: 'Owner permissions required' };

      const defaultTriggers = {
        'dailyCheckOverdueLoans': { 'enabled': true, 'hour': 15 },
        'dailyCheckLenderActions': { 'enabled': true, 'hour': 15 },
        'dailyCheckPendingUserApprovals': { 'enabled': true, 'hour': 15 }
      };
      const defaultNotifications = {
        'borrow_requests': true,
        'return_actions': true,
        'user_registrations': true,
        'overdue_reminders': true
      };

      const triggers = JSON.parse(localStorage.getItem('lib_triggers') || JSON.stringify(defaultTriggers));
      const notifications = JSON.parse(localStorage.getItem('lib_notifications') || JSON.stringify(defaultNotifications));
      
      if (payload.triggers) {
        Object.keys(payload.triggers).forEach(key => {
          if (triggers[key]) {
            if (payload.triggers[key].enabled !== undefined) triggers[key].enabled = !!payload.triggers[key].enabled;
            if (payload.triggers[key].hour !== undefined) triggers[key].hour = parseInt(payload.triggers[key].hour, 10);
          }
        });
        localStorage.setItem('lib_triggers', JSON.stringify(triggers));
      }

      if (payload.notifications) {
        Object.keys(payload.notifications).forEach(key => {
          if (notifications[key] !== undefined) {
            notifications[key] = !!payload.notifications[key];
          }
        });
        localStorage.setItem('lib_notifications', JSON.stringify(notifications));
      }

      return { status: 'success', data: { triggers, notifications } };
    }

    case 'adminTriggerNotification': {
      if (!currentMockUser) return { status: 'error', message: 'Not authenticated', code: 401 };
      if (!isOwnerRole(currentProfile)) return { status: 'error', message: 'Owner permissions required' };
      console.log(`[MOCK NOTIFICATION TRIGGERED] Manually triggered checker: ${payload.notificationType}`);
      return { status: 'success', message: `Trigger executed successfully inside mock system!` };
    }

    default:
      return { status: 'error', message: 'Unknown mock action: ' + action };
  }
}
