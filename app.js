document.addEventListener("DOMContentLoaded", function () {
    const yearsSelect = document.getElementById("yearSelect");
    const categorySelect = document.getElementById("categorySelect");
    const winnersList = document.getElementById("winnersList");
  
    let years = [];
    let categories = [];
    let selectedYear = "";
    let selectedCategory = "";
    let prizes = [];
  
    async function fetchPrizeData() {
      try {
        const response = await fetch("https://api.nobelprize.org/v1/prize.json");
        const data = await response.json();
        const prizeData = data.prizes || [];
        prizes = prizeData;
  
        years = Array.from({ length: 2019 - 1900 }, (_, index) => 1900 + index);
        setSelectOptions(yearsSelect, years);
  
        categories = [...new Set(prizeData.map(prize => prize.category))];
        setSelectOptions(categorySelect, categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    function displayWinners() {
      const filteredPrizes = prizes.filter(prize => prize.year == selectedYear && prize.category == selectedCategory);
      winnersList.innerHTML = filteredPrizes.map(createWinnerListItem).join('');
    }
  
    function createWinnerListItem(prize) {
      return `
        <li key="${prize.year + prize.category}">
          <strong id="YearName" class="text-white" >
            Year: ${prize.year}, Category: ${prize.category.toUpperCase()}
          </strong>
          <ul>
            ${prize.laureates.map(laureate => `
              <li key="${laureate.id}"id="unique" class="text-blue">
                ${laureate.firstname} ${laureate.surname}
              </li>`).join('')}
          </ul>
        </li>`;
    }
  
    function handleSelectChange(event, property) {
      const selectedValue = event.target.value;
      if (property === 'year') {
        selectedYear = selectedValue;
      } else if (property === 'category') {
        selectedCategory = selectedValue;
      }
      displayWinners();
    }
  
    function setSelectOptions(selectElement, options) {
      options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        selectElement.add(optionElement);
      });
    }
  
    yearsSelect.addEventListener("change", event => handleSelectChange(event, 'year'));
    categorySelect.addEventListener("change", event => handleSelectChange(event, 'category'));
  
    fetchPrizeData();
  });
