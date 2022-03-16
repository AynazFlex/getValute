"use strict";

const url1 = "https://www.cbr-xml-daily.ru/daily_json.js";
const table1 = document.getElementById("table1");
const tooltip = document.querySelector(".tooltip");
const list = document.querySelector(".prevdays");
let prevDays = new Map();

const getData = async (url) => {
  let response = await fetch(url);
  let result = await response.json();
  createTable(result.Valute);
  //console.log(result.Valute);
  return result.PreviousURL;
};

const createTable = (obj) => {
  let tbody = document.createElement("tbody");
  table1.append(tbody);
  for (let key in obj) {
    let { NumCode, Value, Previous, Name, CharCode } = obj[key];
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr data-id=${key} data-tooltip="${Name} ${CharCode}">
            <td>${NumCode}</td>
            <td>${Value}</td>
            <td>${(Value / Previous) * 100 - 100}</td>
        </tr>`
    );
  }
};

const getPrevData = async (prevUrl) => {
  let url = prevUrl;
  for (let i = 0; i < 10; i++) {
    let response = await fetch(url);
    let result = await response.json();
    prevDays.set(result.Date.slice(0, 10), result.Valute);
    url = result.PreviousURL;
  }
};

getData(url1).then((revUrl) => getPrevData(revUrl));

table1.onmouseover = (e) => {
  if (!e.target.closest("tbody")) return;
  let elem = e.target.closest("tr");
  tooltip.classList.remove("close");
  tooltip.textContent = elem.dataset.tooltip;
  table1.onmousemove = (event) => {
    tooltip.style.left = event.clientX + 20 + "px";
    tooltip.style.top = event.clientY + 20 + "px";
  };
};

table1.onmouseout = () => tooltip.classList.add("close");

document.body.onclick = (e) => {
  list.innerHTML = '';
  if (!e.target.closest("tbody")) return;
  let elem = e.target.closest("tr");
  prevDays.forEach((value, key) => {
    console.log(key, value[elem.dataset.id].Value);
    list.insertAdjacentHTML(
        "beforeend", 
        `<div class='item'>
            ${key}: ${value[elem.dataset.id].Value}
        </div>`);
  });
};
