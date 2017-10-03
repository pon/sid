const hostname = window && window.location && window.location.hostname;

let apiUrl;

if (hostname === 'app.poplar.co') {
  apiUrl = 'http://api.poplar.co';
} else {
  apiUrl = 'http://localhost:4000';
}

export const API_ROOT = apiUrl;

