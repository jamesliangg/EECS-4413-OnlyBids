# Frontend Demo
This is a **React-based** frontend client demo for the OnlyBids. Also implemented with the help of Socket.IO, Shadcn/ui and Tailwind.

## Components 
1. Home (/)
- Simple page with minimal text.
- Navigation bar on top (Home on left, Catalogue/Sell Item on right).

2. Sign In (/signin)
- Digit-only inputs not required here, just normal username/password.
- After sign-in, typically navigate to /catalogue.

3. Sign Up (/signup)
- Creates a new user.
- Doesn’t ask for AuctionID or BuyerID (the server identifies the user post-sign-up).
  
4. Forgot Password (/forgot-password)
- Requests user’s email, fetches a security question if it exists, and resets password.
  
5. Catalogue (/catalogue)
- Lets users search for auction items with a search bar.
- Real-time or normal fetch calls from the server.

6. Forward Bidding (/forward-bidding)
- Connects to Socket.IO to show the highest bid in real time.
- Typically expects the user to specify an AuctionID, or you might pass it via query params.

7. Dutch Bidding (/dutch-bidding)
- Connects to Socket.IO to see the current Dutch auction price in real time.
- “Buy Now” logic calls a route to accept the price.

8. Update Dutch (/update-dutch)
- For sellers. Allows them to lower the Dutch price in real time.
- Listens for "dutchPriceUpdate" events so the current price is always displayed.

9. Auction Ended (/auction-ended/:auctionId or a variant)
- Fetches final bid, winning bidder from the server.
- If user is not the winner, shows “Failure Notice.”
- If user is the winner, user can select shipping type (regular/expedited) and confirm, typically navigating to Payment.

10. Payment (/payment)
- Doesn’t ask for AuctionID or BuyerID; gets them from query params or session.
- Default shipping address is 4700 Keele St, North York, ON M3J 1P3.
- Card number, MM/YY, CVV, and phone number only allow digits.
- Auto-jump from MM to YY after 2 digits.
- On submission, calls /api/payment/pay.

11. Receipt (/receipt)
- Final page showing amount and estimated shipping days from the database.
- Usually fetched from the server once payment is successful.
- Demonstration Steps
  
## Prerequisites
1. Node.js (v16+)
2. npm

## Configuration Steps
1. Clone the repository to local.
  ```shell
  git clone https://github.com/YourUsername/onlybids-frontend.git
  cd onlybids-frontend
  ```
2. Install dependencies.
  ```shell
   npm install
  ```
3. Start the development server.
  ```shell
   npm run dev
  ```
4. Past the URL printed in the console, and open it in your browser.

## Demonstration Steps
1. Run the front end (npm run dev), Open the front end in your browser, typically http://localhost:5173.
2. Click Sign Up/Sign In button shown on the homepage.
3. Click the "catalogue" to visit (/catalogue).
4. Visit /forward-bidding, /dutch-bidding to browse the pages of foward bidding and dutch bidding correspondingly.
5. Input /auction-ended?=12233 to see the successful page. (you are the winning bidder).
6. Input /auction-ended?=65535 or any other numbers to see the fail page. (you lost the auction)
7. Choose shipping method if you’re the winner.
8. Proceed to /payment to enter all the information, try to input non-digit characters in every input area.
9. Enter all the information correctly, then click the button.
10. Check the final receipt at /receipt.

# Directory Structure
```
├── public/                          # Public assets (favicon, static files) served at the root
├── src/                             # Main source code
│   ├── assets/                      # Additional assets (icons, fonts...)
│   ├── components/ui/               # Reusable UI components (shadcn or custom React components)
│   ├── images/                      # Image files
│   ├── lib/                         # Utilities
│   ├── pages/                       # React "pages" or "screens" (SignIn, Catalogue, Payment...)
│   ├── App.jsx                      # Root React component, defines main routes/navigation
│   ├── index.css                    # Global CSS file
│   ├── main.jsx                     # Entry point
├── components.json                  # shadcn UI configuration
├── eslint.config.js                 # ESLint configuration for code linting
├── index.html                       # The main HTML template for Vite
├── jsconfig.json                    # JS project config
├── package-lock.json                # Auto-generated stuff
├── package.json                     # Dependencies, scripts, metadata...
├── postcss.config.js                # PostCSS configuration used by Tailwind
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite configuration          
```
