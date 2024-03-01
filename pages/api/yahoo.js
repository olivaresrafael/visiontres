const url = 'https://gettickers-ewadbpdtjq-uc.a.run.app'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (response.status >= 400) {
      return res.status(500).json({ error: `There was an error getting tickers` })
    }
    const data = await response.json()
    console.log('response', response)
    console.log('data', data)
    return res.status(200).json(data.tickers)
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
