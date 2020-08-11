const API_URL = 'https://api.exchangeratesapi.io/latest'

const currencyInput = document.querySelector('input[name=currency]');
const result = document.querySelector('#res');
const selectCurrency = document.querySelector('select[name=currency]');
const calcCurrency = document.querySelector('select[name=calculated-currency]');


callForCurrencies().then(res => {
    let option = document.createElement('option');    
    option.text = res.base;
    option.value = res.base;
    selectCurrency.add(option);
    calcCurrency.add(option.cloneNode(true));

    for (let currency of Object.keys(res.rates).sort()) {
        let option = document.createElement('option');
        option.text = currency;
        option.value = currency;
        selectCurrency.add(option);
        calcCurrency.add(option.cloneNode(true));
    }

    selectCurrency.value = "EUR";
    calcCurrency.value = "USD"
})

async function callForCurrencies() {
    let response = await fetch(API_URL);
    let data = await response.json();
    return data;
}

async function calculateCurrency(base, target, amount) {
    if (isNaN(amount)) {
        return { amount: 0 }
    }
    let response = await fetch(`${API_URL}?base=${base}`);
    let data = await response.json();
    return { data, target, base, amount };
}

function displayAllCurrencies(currencies, value) {
    const allCurrenciesList = document.querySelector('#all-currencies');
    allCurrenciesList.innerHTML = '';
    for (currency in currencies) {
        let li = document.createElement('li');
        li.textContent = `${currency}: ${(currencies[currency] * value).toFixed(2)}`;
        allCurrenciesList.append(li);
    }
}

function onchangeStuff() {
    const secondSection = document.querySelector('section[name=second-part]');
    calculateCurrency(selectCurrency.value, calcCurrency.value, parseFloat(currencyInput.value))
    .then(res => {
        const { data, target, base, amount } = res;
        if (target === base) {
            result.value = amount;
        } else {
            result.value = (data.rates[target] * amount).toFixed(2);
        }
        if (secondSection.classList.contains('is-hidden')) {
            secondSection.classList.remove('is-hidden');
        }
        displayAllCurrencies(data.rates, amount);
    });
}


currencyInput.addEventListener('input', _.debounce(onchangeStuff, 500));
selectCurrency.addEventListener('change', _.debounce(onchangeStuff, 300));
calcCurrency.addEventListener('change', _.debounce(onchangeStuff, 300));

