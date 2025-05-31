const convertButton = document.querySelector(".convert-button")
const selectCurrencyToConvert = document.querySelector("#select-currency-to-convert")
const selectCurrency = document.querySelector("#select-currency")

function getAwesomeApi(callback) {
    const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            callback(this.responseText)
        }
    }
    if (selectCurrencyToConvert.value == 'BTC') {
        xhttp.open("GET", `https://economia.awesomeapi.com.br/json/last/${selectCurrencyToConvert.value}-${selectCurrency.value}`)
    } else {
        xhttp.open("GET", `https://economia.awesomeapi.com.br/json/last/${selectCurrency.value}-${selectCurrencyToConvert.value}`)        
    }
    xhttp.send()
}

const currencyCountryFlag = {
    "BRL": "assets/real.png",
    "USD": "assets/dollar.png",
    "EUR": "assets/euro.png",
    "BTC": "assets/bitcoin.png"
}

const currencyNames = {
    "BRL": "Real",
    "USD": "Dólar",
    "EUR": "Euro",
    "BTC": "Bitcoin"
}

function convertValues(data) {
    const inputCurrency = document.querySelector(".input-currency").value
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    currencyValueToConvert.innerHTML = formatCurrency(selectCurrencyToConvert, inputCurrency)
    
    const dataObject = JSON.parse(data)
    for (key in dataObject) {
        
        if (selectCurrencyToConvert.value == "BTC") {
            result = dataObject[key].bid * inputCurrency
        } else {
            result = inputCurrency / dataObject[key].bid
        }

        document.querySelector(".currency-flag-to-convert").src = currencyCountryFlag[selectCurrencyToConvert.value]
        document.querySelector(".currency-flag").src = currencyCountryFlag[selectCurrency.value]

        document.querySelector(".currency-name-to-convert").innerHTML = currencyNames[selectCurrencyToConvert.value]
        document.querySelector(".currency-name").innerHTML = currencyNames[selectCurrency.value]

        const currencyValue = document.querySelector(".currency-value")
        currencyValue.innerHTML = formatCurrency(selectCurrency, result)
    }
}
getAwesomeApi(convertValues)

convertButton.addEventListener("click", () => {
    getAwesomeApi(convertValues)
})

function displayCurrencyValue() {
    const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            document.querySelector(".table-quotes").innerHTML = ""
            const currencyData = JSON.parse(this.responseText)
            for (key in currencyData) {
                document.querySelector(".table-quotes").innerHTML += `
                    <tr>
                        <td>${formatNameCurrency(currencyData[key].name)}</td>
                        <td>${currencyData[key].code}</td>
                        <td>${Intl.NumberFormat('pt-BR', {style: "currency", currency: "BRL"}).format(currencyData[key].bid)}</td>
                        <td>${formatLocalDate(currencyData[key].create_date)}</td>
                    </tr>
                `
            }
        }
    }
    xhttp.open("GET", "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL")
    xhttp.send()
}
displayCurrencyValue()

function formatNameCurrency(currency) {
    const index = currency.indexOf("/")
    return currency.slice(0, index)
}

function formatCurrency(select, currency) {
    const currencyCodeCountry = {"BRL": "pt-BR", "USD": "en-US", "EUR": "de-DE", "BTC": "en-US"}
    return Intl.NumberFormat(currencyCodeCountry[select.value], {style: "currency", currency: select.value}).format(currency)
}

function formatLocalDate(date) {
    const data = new Date(date)
    return data.toLocaleString()
}