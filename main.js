"use strict";

const url1 = "https://www.cbr-xml-daily.ru/daily_json.js";
const table1 = document.getElementById("table1");
const tbody1 = document.getElementById("tbody1");
const tooltip = document.querySelector(".tooltip");
const list = document.querySelector(".prevdays");
let prevDays = new Map();

const getData = async (url) => {
  let response = await fetch(url);
  let result = await response.json();
  createTable(result.Valute);
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
            <td>${((Value - Previous) / Previous) * 100}</td>
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
    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY + 20 + "px";
  };
};

table1.onmouseout = () => tooltip.classList.add("close");

document.body.onclick = (e) => {
  if (e.target.closest("tbody") && table1.contains(e.target)) {
    let elem = e.target.closest("tr");
    list.classList.remove("close");
    tbody1.innerHTML = '';
    prevDays.forEach((value, key) => {
      tbody1.insertAdjacentHTML(
        "beforeend",
        `<td>${key}</td>
        <td>${value[elem.dataset.id].Value}</td>`
      );
    });
  }

  if(e.target.closest('.prevdays_close-button')) {
    list.classList.add("close");
    tbody1.innerHTML = '';
  }
};

list.onmousedown = e => {
  let deltaX = e.clientX - list.getBoundingClientRect().left;
  let deltaY = e.clientY - list.getBoundingClientRect().top;

  console.log(deltaX, deltaY);

  document.body.onmousemove = event => {
    event.preventDefault();
    console.log(event.clientX - deltaX + 'px');
    list.style.left = event.clientX - deltaX  + 'px';
    list.style.top = event.clientY - deltaY  + 'px';
  }

  list.onmouseup = () => {
    document.body.onmousemove = null;
    list.onmouseup = null;
  }
}