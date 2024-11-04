
## Stock Dashboard

## Introduction

This Stock Dashboard is a web application that provides real-time market data and insights on the user's individual stocks. Built with React with Typescript and Material UI, it allows users to search for a specific stock ticker and view detailed company information, including current stock prices, financial news, and market recommendations. Users can also customize the display settings, such as enabling dark mode and reversing gain/loss colors for better accessibility. 


## Tech Stack

#### Client:
React, Typescript, React Router, Local Storage

#### Styling:
Material UI, SCSS

#### Testing:
React Testing Library, Jest

#### Tools:
Prettier, ESLint

#### DevOps:
Github (Actions, Projects), Netlify


## API Reference

Finnhub offer realtime API for stocks, forex and cryptocurrency. With this API, you can access realtime market data from stock exchanges, 10 forex brokers, and 15+ crypto exchanges.

[Finnhub's Documentation](https://finnhub.io/docs/api)

The .env file provided has the required variables in order for the API to function.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `REACT_APP_API_URL` | `string` | **Required**. Finnhub's API URL |
| `REACT_APP_API_KEY` | `string` | **Required**. Finnhub's API KEY |

Each API required within the application is within the api folder, with the interface and getter for the API response.


## Code Explanation

#### Dashboard
The dashboard consists of multiple calculations based on the stocks the user has added through the search function. If no stocks are available, the user is prompted to go to the search page. Within the dashboard, it displays the market status, top news, the user's stock score, portfolio value, percentages of the industries the user has within their portfolio, and the list of stocks the user holds.

The user's stock score is based on the recommendations API and retrieves the latest month of the user's stock data. It then calculates how much the user has invested in each stock and correctly maps each stock based on the consensus of top analysts, categorised as strong buy, buy, hold, sell, and strong sell. Each category is numerically assigned a point system, which then creates the user's portfolio score.

#### Search
The search page allows the user to search for any stock based on its ticker and outputs information about the stock, such as its profile, the current price, the price changes and percentages, the stock recommendations (which also contribute to the portfolio score), and the latest news related to the stock.

#### My Stocks
The "My Stocks" page allows the user to view their entire stock portfolio in a table format. It also enables the user to edit their current stock positions or delete their holdings. If no stocks are available, the user is prompted to visit the search page.

#### News & Media
The News and Media page displays all the current trending news online as an initial search. The user can also search for news related to their stock based on the stock ticker and the desired date. If no date is selected, it defaults to news from the last week for the chosen stock.

#### Settings
The Settings page allows users to switch to dark mode and enables them to change the colours of profit from green to red and loss from red to green, as some countries have colour conventions that align with this.


## Tests
The tests are made using React Testing Library (RTL) with Jest. There are test suites with comprising of E2E testing and unit testing to test components within the application and integration tests which maps out specific functionalities within the applicaiton. 


## CI/CD Pipeline
#### Continuous Integration: 
Whenever code is pushed into the main branch, it first runs the ESLint to check for linting, then it runs all the tests using GitHub workflow.

If both the linting & tests pass, it provides an update within the branch that ticks off the git commit.

#### Continuous Delivery/Deployment:
Netlify is used to deploy the application, and whenever a commit is pushed into the main branch, Netlify deploys the changes to the site. Ensuring manual QA is done, automatic deployment is locked and each deployment has a preview. 

Once the tests are all completed and is given the tick, and manual QA is done on the feature built, deployment is published to Netlify's site.

## Run Locally

Clone the project

```bash
  git clone https://github.com/wksung/stock-dashboard.git
```

Go to the project directory

```bash
  cd stock-dashboard
```

Install dependencies

```bash
  npm install
```

Update .env file with the API URL and KEY

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `REACT_APP_API_URL` | `string` | **Required**. Finnhub's API URL |
| `REACT_APP_API_KEY` | `string` | **Required**. Finnhub's API KEY |

Start the server

```bash
  npm run start
```


## Live Site

Live Site: https://stock-db.netlify.app/