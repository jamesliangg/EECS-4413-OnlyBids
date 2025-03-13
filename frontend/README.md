# Frontend Demo
This is a **React-based** frontend client demo for the OnlyBids. Also implemented with the help of Socket.IO, Shadcn/ui and Tailwind.

## Components 
1. Home (/)
- Homepage, of course.
- Navigation bar on top.

2. Sign In (/signin)
- Normal username/password.

3. Sign Up (/signup)
- Creates a new user.
- Collect all the information needed.
  
4. Forgot Password (/forgot-password)
- Requests user’s email, fetches a security question if it exists, and resets password.
  
5. Catalogue (/catalogue)
- Lets users search for auction items with a search bar.
- Real-time or normal fetch calls from the server.

6. Forward Bidding (/forward-bidding)
- Connects to Socket.IO to show the highest bid in real time.
- Expects the user to offer an AuctionID, or you might pass it via query params.

7. Dutch Bidding (/dutch-bidding)
- Connects to Socket.IO to see the current Dutch auction price in real time.
- Calls a route to accept the price.

8. Update Dutch (/update-dutch)
- Allows sellers to lower the Dutch price in real time.
- Listens to "dutchPriceUpdate" events so the current price is always displayed.

9. Auction Ended (/auction-ended?={$auctionId})
- Get final bid, winning bidder from the server.
- If user is not the winner, shows “failure notice.
- If user is the winner, user can select shipping type (regular/expedited) before submitting.

10. Payment (/payment)
- Card number, MM/YY, CVV, and phone number only allow digits.
- Automatically jump from MM to YY after user input 2 digits.

11. Receipt (/receipt)
- Final page showing amount and estimated shipping days from the database.
  
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
4. Paste the URL printed in the console, and open it in your browser.

## Demonstration Steps
1. Run the front end (npm run dev), Open the front end in your browser, typically http://localhost:5173.
2. Click **Sign Up/Sign In** button shown on the homepage.
3. Click the **"catalogue"** in the navigation bar to visit **/catalogue**.
4. Visit **/forward-bidding**, **/dutch-bidding** to browse the pages of foward bidding and dutch bidding correspondingly.
5. Input **/auction-ended?=12233** to see the successful page. (you are the winning bidder).
6. Input **/auction-ended?=65535** or any other numbers to see the fail page. (you lost the auction)
7. Choose shipping method if you’re the winner.
8. Proceed to **/payment** to enter all the information, try to input non-digit characters in every input area.
9. Enter all the information correctly, then click the button.
10. Check the final receipt at **/receipt**.

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
