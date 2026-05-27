/**
 * Society Library Management System - API Client
 * Interfaces with Google Apps Script Web App or handles LocalStorage Mock fallback.
 */

import { initMockDatabase, executeMockAction } from './mock-api.js';

class ApiClient {
  constructor() {
    this.apiUrl = '';
    this.idToken = null;
    this.mockMode = false;
    this.googleClientId = '';
    this.onAuthErrorCallback = null;
  }

  init(apiUrl, googleClientId, mockMode = false) {
    this.apiUrl = apiUrl;
    this.googleClientId = googleClientId;
    this.mockMode = mockMode;

    if (this.mockMode) {
      console.log("[LibraryAPI] Running in MOCK MODE. Data stored in LocalStorage.");
      initMockDatabase();
    }
  }

  setToken(token) {
    this.idToken = token;
    localStorage.setItem('lib_token', token);
  }

  getToken() {
    if (!this.idToken) {
      this.idToken = localStorage.getItem('lib_token') || null;
    }
    return this.idToken;
  }

  clearToken() {
    this.idToken = null;
    localStorage.removeItem('lib_token');
  }

  /**
   * Primary method to interact with the backend API
   */
  async request(action, payload = {}) {
    if (this.mockMode) {
      // Artificial latency to mimic network connection for a premium feel
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const result = executeMockAction(action, payload);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, 400);
      });
    }

    if (!this.apiUrl) {
      throw new Error("API URL is not configured. Set API_URL in CONFIG or enable MOCK_MODE.");
    }

    const token = this.getToken();
    let clientUrl = window.location.origin + window.location.pathname;
    if (clientUrl.endsWith('/')) {
      clientUrl = clientUrl.slice(0, -1);
    }

    const requestBody = {
      action: action,
      idToken: token,
      baseUrl: clientUrl,
      ...payload
    };

    try {
      // Simple POST request to bypass CORS preflight issues on Google Apps Script
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'error') {
        if (result.code === 401 || (result.message && (result.message.includes('Invalid authentication token') || result.message.includes('Not authenticated')))) {
          this.clearToken();
          this.clearCache();
          if (this.onAuthErrorCallback) {
            this.onAuthErrorCallback();
          }
        }
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error(`[LibraryAPI] API error for action ${action}:`, error);
      throw error;
    }
  }

  getCache(action) {
    const data = localStorage.getItem(`lib_cache_${action}`);
    return data ? JSON.parse(data) : null;
  }

  setCache(action, data) {
    localStorage.setItem(`lib_cache_${action}`, JSON.stringify(data));
  }

  clearCache() {
    const keys = ['lib_cache_getUserProfile', 'lib_cache_getCatalog', 'lib_cache_getLoans', 'lib_cache_getStats', 'lib_cache_adminGetUsers'];
    keys.forEach(k => localStorage.removeItem(k));
  }
}

export const LibraryAPI = new ApiClient();
