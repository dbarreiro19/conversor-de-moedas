const convertButton = document.querySelector(".convert-button")
const selectCurrencyToConvert = document.querySelector("#select-currency-to-convert")
const selectCurrency = document.querySelector("#select-currency")
const inputCurrency = document.querySelector(".input-currency")

let conversionHistoryList = null

if (localStorage.getItem("conversionHistory")) {
    conversionHistoryList = JSON.parse(localStorage.getItem("conversionHistory"))
} else {
    conversionHistoryList = []
}

console.log(conversionHistoryList)

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

    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    currencyValueToConvert.innerHTML = formatCurrency(selectCurrencyToConvert, inputCurrency.value)
    
    const dataObject = JSON.parse(data)

    for (key in dataObject) {
        
        if (selectCurrencyToConvert.value == "BTC") {
            result = dataObject[key].bid * inputCurrency.value
        } else {
            result = inputCurrency.value / dataObject[key].bid
        }

        const currencyValue = document.querySelector(".currency-value")
        
        if (selectCurrency.value == "BTC") {
            currencyValue.innerHTML = Intl.NumberFormat('de-DE', {style: "currency", currency: "BTC", maximumFractionDigits: 8}).format(result)
        } else {
            currencyValue.innerHTML = formatCurrency(selectCurrency, result)
        }        

        document.querySelector(".currency-flag-to-convert").src = currencyCountryFlag[selectCurrencyToConvert.value]
        document.querySelector(".currency-flag").src = currencyCountryFlag[selectCurrency.value]
        
        document.querySelector(".currency-name-to-convert").innerHTML = currencyNames[selectCurrencyToConvert.value]
        document.querySelector(".currency-name").innerHTML = currencyNames[selectCurrency.value]

        if (inputCurrency.value) {
            const saveConversion = {
                "from": currencyNames[selectCurrencyToConvert.value],
                "to": currencyNames[selectCurrency.value],
                "input": inputCurrency.value,
                "result": formatCurrency(selectCurrency, result),
                "date": new Date().toLocaleString()
            }
            conversionHistoryList.push(saveConversion)
            window.localStorage.setItem("conversionHistory", JSON.stringify(conversionHistoryList))
        }
        
        if(window.localStorage.getItem("conversionHistory")) {
            const conversionHistory = JSON.parse(window.localStorage.getItem("conversionHistory"))
            document.querySelector(".table-conversion-history").innerHTML = ""
            for (let i = 0; i < conversionHistory.length; i++) {
                document.querySelector(".table-conversion-history").innerHTML += `
                    <tr>
                        <td>${conversionHistory[i].from}</td>
                        <td>${conversionHistory[i].to}</td>
                        <td>${formatCurrency(selectCurrencyToConvert, conversionHistory[i].input)}</td>
                        <td>${conversionHistory[i].result}</td>
                        <td>${conversionHistory[i].date}</td>
                    </tr>
                `
            }
        }
    }

    inputCurrency.value = ""
}
getAwesomeApi(convertValues)

convertButton.addEventListener("click", () => {
    if (validateSelect(selectCurrency, selectCurrencyToConvert) && validateInput(inputCurrency)) {
        getAwesomeApi(convertValues)
    }    
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

function validateSelect(opt1, opt2) {
    if (opt1.value == opt2.value) {
        opt1.classList.add("invalid-field")
        opt2.classList.add("invalid-field")
    } else {
        return true
    }
    opt1.addEventListener("focus", () => {
        opt1.classList.remove("invalid-field")
        opt2.classList.remove("invalid-field")
    })
}

function validateInput(input) {
    if (!input.value){
        input.classList.add("invalid-field")
        input.placeholder = "Preencha este campo!"
    } else {
        return true
    }
    input.addEventListener("focus", () => {
        input.classList.remove("invalid-field")
        input.placeholder = "ex: 10.000,00"
    })
} 

function formatNameCurrency(currency) {
    const index = currency.indexOf("/")
    return currency.slice(0, index)
}

function formatCurrency(select, currency) {
    const currencyCodeCountry = {'BRL': 'pt-BR', 'USD': 'en-US', 'EUR': 'de-DE', 'BTC': 'de-DE'}    
    return Intl.NumberFormat(currencyCodeCountry[select.value], {style: "currency", currency: select.value}).format(currency)
}

function formatLocalDate(date) {
    const data = new Date(date)
    return data.toLocaleString()
}