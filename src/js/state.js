/**
 * Society Library Management System - Central State Management
 */
export const STATE = {
  currentUser: null,
  activeView: 'catalog', // catalog, borrower, lender, admin
  previousView: 'catalog',
  books: [],
  loans: [],
  users: [],
  stats: {},
  automation: null
};
