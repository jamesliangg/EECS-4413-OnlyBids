import http from 'k6/http';
import { check, sleep, rate } from 'k6';
import { Trend } from 'k6/metrics';

// Custom metrics for tracking response times by endpoint
const searchResponseTime = new Trend('search_response_time');
const auctionResponseTime = new Trend('auction_response_time');
const historyResponseTime = new Trend('history_response_time');
const bidResponseTime = new Trend('bid_response_time');
const dutchResponseTime = new Trend('dutch_response_time');

export const options = {
  stages: [
    { duration: '30s', target: 200, name: 'stage_200_users' },   // Ramp up to 200 users
    { duration: '1m', target: 200, name: 'stage_200_users' },    // Stay at 200 users for 1 minute
    { duration: '30s', target: 400, name: 'stage_400_users' },  // Ramp up to 400 users
    { duration: '1m', target: 400, name: 'stage_400_users' },   // Stay at 400 users for 1 minute
    { duration: '30s', target: 600, name: 'stage_600_users' },  // Ramp up to 600 users
    { duration: '1m', target: 600, name: 'stage_600_users' },   // Stay at 600 users for 1 minute
    { duration: '30s', target: 800, name: 'stage_800_users' },  // Ramp up to 800 users
    { duration: '1m', target: 800, name: 'stage_800_users' },   // Stay at 800 users for 1 minute
    { duration: '30s', target: 1000, name: 'stage_1000_users' },  // Ramp up to 1000 users
    { duration: '1m', target: 1000, name: 'stage_1000_users' },   // Stay at 1000 users for 1 minute
    { duration: '30s', target: 0, name: 'ramp_down' },   // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration{stage:stage_200_users}': ['p(95)<500'],
    'http_req_duration{stage:stage_400_users}': ['p(95)<500'],
    'http_req_duration{stage:stage_600_users}': ['p(95)<500'],
    'http_req_duration{stage:stage_800_users}': ['p(95)<500'],
    'http_req_duration{stage:stage_1000_users}': ['p(95)<500'],
    'http_req_failed{stage:stage_200_users}': ['rate<0.1'],
    'http_req_failed{stage:stage_400_users}': ['rate<0.1'],
    'http_req_failed{stage:stage_600_users}': ['rate<0.1'],
    'http_req_failed{stage:stage_800_users}': ['rate<0.1'],
    'http_req_failed{stage:stage_1000_users}': ['rate<0.1'],
  },
};

// Use the Docker service name when running in Docker, fallback to localhost for local testing
const BASE_URL = __ENV.BASE_URL || 'http://backend:3000/api';

// Sample users from seed.sql
const TEST_USERS = [
  { email: 'john@example.com', password: 'excellentPassword1' },
  { email: 'jane@example.com', password: 'excellentPassword2' },
  { email: 'bob@example.com', password: 'excellentPassword3' },
  { email: 'alice@example.com', password: 'excellentPassword4' },
  { email: 'charlie@example.com', password: 'excellentPassword5' }
];

// Test items from seed.sql
const TEST_ITEMS = [
  'Vintage Watch',
  'Gaming Console',
  'YorkU Lmap',
  'Rare Comic Book',
  'Antique Vase'
];

// Auction IDs from seed.sql (1-3 are forward auctions, 4-5 are Dutch auctions)
const FORWARD_AUCTION_IDS = [1, 2, 3];
const DUTCH_AUCTION_IDS = [4, 5];

export function setup() {
  // Randomly select a test user
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
  
  // Sign in and get auth token
  const signinRes = http.post(`${BASE_URL}/signin`, JSON.stringify({
    email: user.email,
    password: user.password
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(signinRes, {
    'signin successful': (r) => r.status === 200,
  });

  return {
    authToken: signinRes.json('token'),
    user: user
  };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.authToken}`,
    'Content-Type': 'application/json',
  };

  // Add stage tag based on current VU count
  const stage = `stage_${__VU}_users`;
  
  // Test search endpoint with actual items from seed.sql
  const searchTerm = TEST_ITEMS[Math.floor(Math.random() * TEST_ITEMS.length)];
  const searchStart = Date.now();
  const searchRes = http.get(`${BASE_URL}/search/fullsearch?keyword=${encodeURIComponent(searchTerm)}`, { 
    headers,
    tags: { stage }
  });
  searchResponseTime.add(Date.now() - searchStart, { stage });
  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
  });

  // Test auction listing
  const auctionStart = Date.now();
  const auctionsRes = http.get(`${BASE_URL}/auction/auctions`, { 
    headers,
    tags: { stage }
  });
  auctionResponseTime.add(Date.now() - auctionStart, { stage });
  check(auctionsRes, {
    'auctions status is 200': (r) => r.status === 200,
  });

  // Test auction history
  const historyStart = Date.now();
  const historyRes = http.get(`${BASE_URL}/auction/auctions/history`, { 
    headers,
    tags: { stage }
  });
  historyResponseTime.add(Date.now() - historyStart, { stage });
  check(historyRes, {
    'auction history status is 200': (r) => r.status === 200,
  });

  // Randomly test forward bidding or Dutch bidding endpoints
  if (Math.random() > 0.5) {
    // Test forward bidding with actual forward auction IDs
    const auctionId = FORWARD_AUCTION_IDS[Math.floor(Math.random() * FORWARD_AUCTION_IDS.length)];
    const bidStart = Date.now();
    const forwardBidRes = http.post(`${BASE_URL}/auction/bid`, JSON.stringify({
      auctionId: auctionId,
      amount: Math.floor(Math.random() * 1000) + 100
    }), { 
      headers,
      tags: { stage }
    });
    bidResponseTime.add(Date.now() - bidStart, { stage });
    
    check(forwardBidRes, {
      'forward bid status is 200': (r) => r.status === 200,
    });
  } else {
    // Test Dutch auction price update with actual Dutch auction IDs
    const auctionId = DUTCH_AUCTION_IDS[Math.floor(Math.random() * DUTCH_AUCTION_IDS.length)];
    const dutchStart = Date.now();
    const dutchPriceRes = http.put(`${BASE_URL}/auction/dutch/price`, JSON.stringify({
      auctionId: auctionId,
      newPrice: Math.floor(Math.random() * 1000) + 100
    }), { 
      headers,
      tags: { stage }
    });
    dutchResponseTime.add(Date.now() - dutchStart, { stage });
    
    check(dutchPriceRes, {
      'dutch price update status is 200': (r) => r.status === 200,
    });
  }

  sleep(1); // Wait 1 second between iterations
} 