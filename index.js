document.addEventListener('DOMContentLoaded', () => {
    let ticker_symbol
    let form = document.querySelector('#search-form')
    let input = document.querySelector('#ticker-symbol')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        ticker_symbol = input.value.toUpperCase()
        input.value = ''
        shrink_search_bar()
        load_stock_chart(ticker_symbol, 'TIME_SERIES_WEEKLY')
    })
})

/* const API_KEY = YOUR_API_KEY */
var table, mapping, chart, background
let displayedChart

function load_stock_chart(ticker_symbol, time_period) {
    let API_URL = `https://www.alphavantage.co/query?function=${time_period}&symbol=${ticker_symbol}&apikey=${API_KEY}`
    const time_series = 'Weekly Time Series'
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        let ticker_symbol = data['Meta Data']['2. Symbol']
        let stock_price_data = []
        for (let date in data[time_series]) {
            let stock_data = []
            stock_data.push(date)
            stock_data.push(data[time_series][date]['1. open'])
            stock_data.push(data[time_series][date]['2. high'])
            stock_data.push(data[time_series][date]['3. low'])
            stock_data.push(data[time_series][date]['4. close'])
            stock_price_data.push(stock_data)
        }

        if (displayedChart) {
            displayedChart.dispose()
        }

        table = anychart.data.table()
        table.addData(stock_price_data)

        mapping = table.mapAs()
        mapping.addField('open', 1, 'first');
        mapping.addField('high', 2, 'max');
        mapping.addField('low', 3, 'min');
        mapping.addField('close', 4, 'last');
        mapping.addField('value', 4, 'last');

        chart = anychart.stock()
        background = chart.background();
        background.cornerType("round");
        background.corners(10);
        chart.plot(0).ohlc(mapping).name(ticker_symbol)
        chart.title('Stock Name')
        chart.container('stock-chart')
        chart.draw()
        displayedChart = chart
    });
}

function shrink_search_bar() {
    const search_bar = document.querySelector('#search-bar-view')
    search_bar.style.display = 'block'
    document.querySelector('#stock-chart-view').style.display = 'block'
    search_bar.classList.remove('h-100')
    search_bar.classList.add('py-3')
}
