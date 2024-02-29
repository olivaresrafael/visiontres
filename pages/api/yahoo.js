const API_KEY = process.env.RAPID_API_KEY
const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers?region=US'
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
  },
}

export const fetchFinance = async () => {
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    return result.finance.result[0].quotes
  } catch (error) {
    console.error(error)
  }
}
