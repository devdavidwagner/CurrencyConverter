import React, { useState, useEffect} from 'react';
import Cookies from 'js-cookie';



function Head(){
  return(
    <head>
    <title>Currency Converter</title>
    <link rel="stylesheet" type="text/css" href="/styles/styles.css" />
    <link id="Link1" rel="icon" href="/images/favicon.ico" type="image/png" />
  </head>
  );
}

function Header() {
  return (
    <header>
      <h1>Currency Converter</h1>
    </header>
  );
}
function ExchangeRateTable() {
  const [currenciesUsed, setCurrenciesUsed] = useState(["CAD", "USD", "GBP", "EUR", "CNY"]);
  const [cookieVals, setCookieVals] = useState([]); // Initialize as an empty array
  const promises = []; 

  const dataMatrix = Array(currenciesUsed.length).fill(null).map(() => Array(currenciesUsed.length).fill(null));
  
  function generateTableWithCookie() {
      var i = 0;
      console.log("GENERATE TABLE WITH COOKIE");      
      const tableBody = document.querySelector("#exchangeRates tbody");
        tableBody.innerHTML = ""; // Clear existing table body
        const cookieName = `CurrencyExchange`; // Use a consistent cookie name
        const updatedCookieVals = [...cookieVals]; // Copy the existing cookieVals array
        const cookieValue = getCookie(cookieName);   
        currenciesUsed.forEach((fromCurrency) => {
        
        const tableRow = document.createElement("tr");
        const tableHeader = document.createElement("th");
        tableHeader.textContent = fromCurrency;
        tableRow.appendChild(tableHeader);
        currenciesUsed.forEach((toCurrency) => {
          if (cookieValue !== null && cookieValue.split(',').length == (currenciesUsed.length * currenciesUsed.length)) {           
            const tableData = document.createElement("td");
            const values = cookieValue.split(',');
            tableData.textContent = values[i];
            console.log("Adding table data: " + values[i] + " i = " + i.toString());
            tableRow.appendChild(tableData);
          }
          i++;
        });
        tableBody.appendChild(tableRow);
      });
      // No need to wait for promises, as this is the case where there's a cookie
    
    }
    
  function generateTableWithoutCookie() {
      
      const tableBody = document.querySelector("#exchangeRates tbody");
      tableBody.innerHTML = ""; // Clear existing table body
      const cookieName = `CurrencyExchange`; // Use a consistent cookie name
      const updatedCookieVals = []; // Copy the existing cookieVals array
      const requests = [];
    
      currenciesUsed.forEach((fromCurrency, fromIndex) => {
        currenciesUsed.forEach((toCurrency, toIndex) => {
          const request = fetch(`http://localhost:5000/generateExchangeRates?from=${fromCurrency}&to=${toCurrency}`)
            .then(response => response.json())
            .then(data => {
              const result = data.result;
              dataMatrix[fromIndex][toIndex] = result;
              return result;
            })
            .catch(error => {
              console.error('Request error:', error);
              const errorResult = 'Error';
              dataMatrix[fromIndex][toIndex] = errorResult;
              return errorResult;
            });
    
          requests.push(request);
        });
      });
     

      Promise.all(requests)
      .then(() => {
          dataMatrix.forEach((rowData, fromIndex) => {
          const tableRow = document.createElement("tr");
          const tableHeader = document.createElement("th");
          tableHeader.textContent = currenciesUsed[fromIndex];
          tableRow.appendChild(tableHeader);
  
          rowData.forEach((cellData) => {
            const tableData = document.createElement("td");
            tableData.textContent = cellData;
            tableRow.appendChild(tableData);
            updatedCookieVals.push(cellData);
          });
  
          tableBody.appendChild(tableRow);
        });
  
        if (updatedCookieVals.length > 0) {
          document.cookie = `${cookieName}=${updatedCookieVals.join(',')}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;
        }
      });
       
    }

  const cookieName = `CurrencyExchange`;
  const cookieValue = getCookie(cookieName);
    
  if (cookieValue !== null && cookieValue.split(',').length === (currenciesUsed.length * currenciesUsed.length)) {
    document.addEventListener('DOMContentLoaded', function () {
      generateTableWithCookie();
    });

    } else {
      document.addEventListener('DOMContentLoaded', function () {
     generateTableWithoutCookie();
    });
  }

  function getCookie(name){
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null; // Cookie not found
  }

 
  const CURRENCY_COOKIE = "currenciesExchange"

  function loadExchangeCookie(currencyCodes){
    var currencyExchange = getCookie(CURRENCY_COOKIE);
    if(currencyExchange != null){
      var currencyCodes = currencyExchange.split(','); // Split the string into an array of codes
      // Loop through the currency codes
      currencyCodes.forEach(function(code) {
        code = code.trim(); // Trim whitespace
        if (!currenciesUsed.includes(code)) {
          currenciesUsed.push(code);
        }
      });
    }
  }


  function updateCookie(cookieName, newValue, expirationDate) {
    // Set the updated cookie with the new value and optional expiration date
    document.cookie = `${cookieName}=${newValue}${expirationDate ? `; expires=${expirationDate}` : ''}; path=/`;
  }

  
  function AddCurrencyDropdown() {

    const [newCurrency, setNewCurrency] = useState('JPY');
  
    const HandleAddClick  = () => {
      const updatedCurrencies = [...currenciesUsed, newCurrency.toUpperCase()];
      setCurrenciesUsed(updatedCurrencies);
    }
  
    return (
      <span>
        <p>Add Currency: <select id="inputCurr" className="inputs" name ="currencyAdd"
         onChange={(e) => setNewCurrency(e.target.value)}>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="BGN">BGN - Bulgarian Lev</option>
            <option value="CZK">CZK - Czech Republic Koruna</option>
            <option value="DKK">DKK - Danish Krone</option>
            <option value="HUF">HUF - Hungarian Forint</option>
            <option value="PLN">PLN - Polish Zloty</option>
            <option value="RON">RON - Romanian Leu</option>
            <option value="SEK">SEK - Swedish Krona</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="ISK">ISK - Icelandic Króna</option>
            <option value="NOK">NOK - Norwegian Krone</option> 
            <option value="HRK">HRK - Croatian Kuna</option>
            <option value="RUB">RUB - Russian Ruble</option>
            <option value="TRY">TRY - Turkish Lira</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="BRL">BRL - Brazilian Real</option>
            <option value="HKD">HKD - Hong Kong Dollar</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
            <option value="ILS">ILS - Israeli New Sheqel</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="KRW">KRW - South Korean Won</option>
            <option value="MXN">MXN - Mexican Peso</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
            <option value="PHP">PHP - Philippine Peso</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="THB">THB- Thai Baht</option>
            <option value="ZAR">ZAR - South African Rand</option>
          </select> <button onClick={HandleAddClick} >Add</button></p>
         
        </span>
    );
  }

  return (
        <span className="cardER" id="cardER">
          <AddCurrencyDropdown /> 
          <p id="latestPull">Exchange Rates as per latest pull.</p>
          <table id="exchangeRates">
            <thead>
              <tr>
                <th></th>
                <th>CAD</th>
                <th>USD</th>
                <th>GBP</th>
                <th>EUR</th>
                <th>CNY</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </span>
  );
}



function ConverterForm() {
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const cookieValue = Cookies.get('ConversionHistory');
      console.log(cookieValue);
      if (cookieValue) {
        const cookieDataArray = cookieValue.split(',');
        //setData(parsedData);

      const mappedData = [];
      for (let i = 0; i < cookieDataArray.length; i += 4) {
        const dataObject = {
          amount: cookieDataArray[i],
          from: cookieDataArray[i + 1],
          to: cookieDataArray[i + 2],
          result: cookieDataArray[i + 3]
        };
        mappedData.push(dataObject);
      }

      setFormData(mappedData);
      }
    };
  
    fetchData();
  }, []);

  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('CAD');
  const [toCurrency, setToCurrency] = useState('USD');
  const [errorMsg, setErrorMsg] = useState('');
  const [outputResult, setOutputResult] = useState('00.00');

  const handleInputChange = (e) => {
    let dec = e.target.value;

    // Remove any non-numeric characters except decimal point
    dec = dec.replace(/[^0-9.]/g, '');

    // Remove leading zeros
    dec = dec.replace(/^0+/, '');
    
    // Limit decimal places to 4
    const decimalIndex = dec.indexOf('.');
    if (decimalIndex !== -1 && dec.length > decimalIndex + 5) {
      dec = dec.slice(0, decimalIndex + 5);
    }
    setAmount(dec);
  };
  

  const saveConversionHistory = (amount, fromCurrency, toCurrency, outputResult) => {
    // Send a POST request to the controller endpoint
    fetch(`http://localhost:5000/convertHistory?amount=${amount}&from=${fromCurrency}&to=${toCurrency}&result=${outputResult}&addRow=True`)
      .then(response => response.json())
      .then(data => {
        //check if cookie has data
        var cookieName = "ConversionHistory";
        var cookie = document.cookie;

        var responseData;

        if (cookie) {
          var cookieArray = cookie.split(";");
          for (var i = 0; i < cookieArray.length; i++) {
            var cookiePair = cookieArray[i].split("=");
            if (cookiePair[0].trim() === cookieName) {
              responseData = decodeURIComponent(cookiePair[1]);
              break;
            }
          }
        }

        if (responseData) {
          responseData += "," + data.result;
        } else {
          responseData = data.result;
        }

        document.cookie = `${cookieName}=${encodeURIComponent(responseData)}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;

        console.log("Cookie:", document.cookie);
        console.log("new data added:", responseData);
        console.log('Conversion saved');

      })
      .catch(error => {
        // Error making the request
        console.error('Request error:', error);
      });
  }

  const handleConvertClick = () => {
    const parsedAmount = parseFloat(amount);
    let newErrorMsg = '';
    let newOutputResult = '';

    if (amount === null || amount === '') {
      newErrorMsg = 'No amount value entered.';
    } else if (isNaN(parsedAmount)) {
      newErrorMsg = 'Invalid amount value. Please enter a valid integer or decimal.';
    } else if (parsedAmount < 0) {
      parsedAmount *= -1;
    }
    console.log(parsedAmount);

    if (newErrorMsg !== '') {
      console.log(newErrorMsg);
      setErrorMsg(newErrorMsg);
      setOutputResult(newErrorMsg);
    } else {
      // Make an HTTP request to the server-side endpoint
      fetch(`http://localhost:5000/api/convert?amount=${parsedAmount}&from=${fromCurrency}&to=${toCurrency}`)
        .then((response) =>  response.json())
        .then((data) => {        
          newOutputResult = `${data.result}`;
          setOutputResult(newOutputResult);
          console.log(newOutputResult)     
          document.getElementById('outputResult').style.color = 'green';
          document.getElementById('outputResult').style.fontSize = 'big';
          saveConversionHistory(parsedAmount,fromCurrency,toCurrency,newOutputResult);
        })
        .catch((error) => {
          console.error(error); // Log any errors
          newOutputResult = `${error}`; // Update with appropriate error handling
          setOutputResult(newOutputResult);
          document.getElementById('outputResult').style.color = 'red';
          document.getElementById('outputResult').style.fontSize = 'small';
        });
    }
  };

  return (
      <span className="card">
        <div><h2>Conversion Widget:</h2></div>
        <label htmlFor="inputAmount">Amount:</label>
        <input type="text" id="inputAmount" name="amount" placeholder="00.00"  value={amount}
        onInput={(e) => setAmount(e.target.value)} onChange={handleInputChange} />
        <div id="inputsDiv">
          <label htmlFor="inputFrom" className="centerLabel">From:</label>
          <select  value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} id="inputFrom" name="from" className="inputs" >
            <option value="CAD" selected="selected">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CNY">CNY</option>
            {/* Add more options as needed */}
          </select>
          <label htmlFor="inputTo" className="centerLabel">To:</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} id="inputTo" className="inputs" name="to">
            <option value="CAD">CAD</option>
            <option value="USD" selected="selected">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CNY">CNY</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <button type="button" id="convertButton" onClick={handleConvertClick}>Convert:</button>
        <span id="outputResult" className="result">{outputResult} </span>
        <hr />
        <p id="convHistLabel">Conversion History</p>
        <table id="conversionHistory">
          <thead>
            <tr>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody> {formData.map((data, index) => (
            <tr key={index}>
              <td>{data.amount}</td>
              <td>{data.from}</td>
              <td>{data.to}</td>
              <td>{data.result}</td>
            </tr>))}
          </tbody>
        </table>
        <p id="smallText">(Last Five Conversions)</p>
      </span>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        Written in C# and .NET (with JavaScript) by David Wagner - 2023 <br />
        <br />
        <a href="https://github.com/devdavidwagner/CurrencyConverter">
          <img src="/images/GitHub-Mark.png" alt="GitHub" width="20" height="20" style={{ verticalAlign: 'middle' }} /> Github Repository
        </a>
        <a href="https://www.linkedin.com/in/david-karl-wagner/">
          <img src="/images/LinkedIn-Mark.PNG" alt="LinkedIn" width="20" height="20" style={{ verticalAlign: 'middle', paddingLeft: '25px' }} /> My LinkedIn
        </a>
      </p>
      <p>
        Exchange Rates pulled from <a href="https://freecurrencyapi.com/">Free Currency API</a>
      </p>
    </footer>
  );
}

function App() {
  return (
    <div id="alphaDiv">
    <Head />
    <Header />
    <ConverterForm />
      <div className="content2">
        <ExchangeRateTable />
      </div>
    <Footer />
  </div>
  );
}

export default App;
