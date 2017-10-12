const hostname = window && window.location && window.location.hostname;

let apiUrl;

if (hostname === 'inside.poplar.co') {
  apiUrl = 'https://inside-api.poplar.co';
} else {
  apiUrl = 'http://localhost:2000';
}

export const API_ROOT = apiUrl;