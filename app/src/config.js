const hostname = window && window.location && window.location.hostname;

let apiUrl;
let plaid;

if (hostname === 'app.poplar.co') {
  apiUrl = 'https://api.poplar.co';
  plaid = {
    clientName: 'Poplar',
    env: 'sandbox',
    key: '36da3c134f021f74f4be5171a1d6a9'
  };
} else {
  apiUrl = 'http://localhost:4000';
  plaid = {
    clientName: 'Poplar',
    env: 'sandbox',
    key: '36da3c134f021f74f4be5171a1d6a9'
  };
}

export const API_ROOT = apiUrl;
export const PLAID_CREDENTIALS = plaid;
