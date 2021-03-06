const regions = {
  world: {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  },
  africa: {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  },
  americas: {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  },
  europe: {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  },
  asia: {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
  },
};

const btnWorld = document.querySelector(".btnWorld");
const btnAsia = document.querySelector(".btnAsia");
const btnAfrica = document.querySelector(".btnAfrica");
const btnAmerica = document.querySelector(".btnAmerica");
const btnEurope = document.querySelector(".btnEurope");
const ctx = document.querySelector("#myChart");
const search = document.querySelector(".visibility");

let myChart = "";

const generateChart = (resData) => {
  myLabels = [];
  if (
    resData.newConfirmed === 0 &&
    resData.newDeaths === 0 &&
    resData.newRecovered === 0
  ) {
    myLabels = ["Deaths", "Confirmed", "Recovered", "Critical"];
  } else{
    myLabels= [
      "Deaths",
      "Confirmed",
      "Recovered",
      "Critical",
      "New Confirmed",
      "New Deaths",
      "New Recovered",
    ]
  }
  const data = [
    resData.deaths,
    resData.confirmed,
    resData.recovered,
    resData.critical,
    resData.newConfirmed,
    resData.newDeaths,
    resData.newRecovered,
  ];
  if (myChart !== "") myChart.destroy();
  myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels:myLabels,
      datasets: [
        {
          label: "Covid",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
          datalabels: {
            color: "black",
            anchor: "end",
            align: "top",
          },
        },
      ],
    },
    // plugins: [ChartDataLabels],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

let asia = [];
let africa = [];
let america = [];
let europe = [];
const getRegionData = async (data, region) => {
  const baseURLCovid = "https://corona-api.com/countries";
  if (region !== "world") {
    data.data.forEach((country) => {
      if (country.cca2 === "XK") {
        console.log("Skipped it XD");
      } else {
        axios.get(`${baseURLCovid}/${country.cca2}`).then((response) => {
          regions[region].deaths += response.data.data.latest_data.deaths;
          regions[region].confirmed += response.data.data.latest_data.confirmed;
          regions[region].recovered += response.data.data.latest_data.recovered;
          regions[region].critical += response.data.data.latest_data.critical;
          if (response.data.data.timeline[0] !== undefined) {
            regions[region].newConfirmed +=
              response.data.data.timeline[0].new_confirmed;
            regions[region].newDeaths +=
              response.data.data.timeline[0].new_deaths;
            regions[region].newRecovered +=
              response.data.data.timeline[0].new_recovered;
          }
            switch (region) {
            case "asia":
              asia.push(response.data.data);
              break;
            case "africa":
              africa.push(response.data.data);
              break;
            case "americas":
              america.push(response.data.data);
              break;
            case "europe":
              europe.push(response.data.data);
              break;
          }
        });
      }
    });
  } else {
    countries = await axios.get(baseURLCovid, [
      {
        headers: "application/json",
      },
    ]);
    countries.data.data.forEach((country) => {
      regions.world.deaths += country.latest_data.deaths;
      regions.world.confirmed += country.latest_data.confirmed;
      regions.world.recovered += country.latest_data.recovered;
      regions.world.critical += country.latest_data.critical;
    });
    generateChart(regions.world);
  }
};
const getCountries = async (region) => {
  let countries;
  if (region !== "world") {
    countries = await axios.get(
      `https://intense-mesa-62220.herokuapp.com/restcountries.herokuapp.com/api/v1/region/${region}`,
      [
        {
          headers: "Access-Control-Allow-Origin *",
        },
      ]
    );
    getRegionData(countries, region);
  } else {
    getRegionData([], region);
  }
  document.querySelector(".loading-container").classList.add("visibility");
};

btnWorld.addEventListener("click", () => {
  generateChart(regions.world);
  search.classList.add("visibility");
});
btnAfrica.addEventListener("click", () => {
  generateChart(regions.africa);
  generateBtn(africa);
  search.classList.remove("visibility");
});
btnAsia.addEventListener("click", () => {
  generateChart(regions.asia);
  generateBtn(asia);
  search.classList.remove("visibility");
});
btnAmerica.addEventListener("click", () => {
  generateChart(regions.americas);
  generateBtn(america);
  search.classList.remove("visibility");
});
btnEurope.addEventListener("click", () => {
  generateChart(regions.europe);
  generateBtn(europe);
  search.classList.remove("visibility");
});

window.addEventListener("load", () => {
  getCountries("world").catch((error) => {
    console.error(error);
  });
  getCountries("asia").catch((error) => {
    console.error(error);
  });
  getCountries("africa").catch((error) => {
    console.error(error);
  });
  getCountries("europe").catch((error) => {
    console.error(error);
  });
  getCountries("americas").catch((error) => {
    console.error(error);
  });
});
