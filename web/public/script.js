Papa.parse("/processed/1.csv", {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: function (payload) {
    renderCharts(payload.data);
  },
});

const canvasElement = document.getElementById("canvas");
const context = canvasElement.getContext("2d");
const canvasElement2 = document.getElementById("canvas2");
const context2 = canvasElement2.getContext("2d");
const video = document.getElementById("video");

const emotionColorMap = new Map(
  Object.entries({
    surprise: "orange",
    fear: "black",
    happiness: "yellow",
    sadness: "blue",
    anger: "red",
    disgust: "purple",
    contempt: "green",
  })
);

function toLabel(str) {
  return {
    surprise: "Meglepődés",
    fear: "Félelem",
    happiness: "Boldogság",
    sadness: "Szomorúság",
    anger: "Harag",
    disgust: "Undor",
    contempt: "Megvetés",
  }[str];
}

function mapToKeys(map) {
  const ret = [];
  for (const key of map.keys()) {
    ret.push(key);
  }
  return ret;
}

const barChart = new Chart(context, {
  type: "horizontalBar",
  options: {
    tooltips: {
      enabled: false,
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      fontSize: 20,
    },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            fontColor: "black",
            max: 2.5,
            min: 0,
            beginAtZero: true,
            fontSize: 20,
          },
        },
      ],
      xAxes: [
        {
          display: true,
          ticks: {
            fontColor: "black",
            max: 2.5,
            min: 0,
            beginAtZero: true,
            fontSize: 20,
          },
        },
      ],
    },
  },
  data: {
    labels: mapToKeys(emotionColorMap).map(toLabel),
    datasets: [
      mapToKeys(emotionColorMap).reduce(
        (acc, emotion) =>
          acc
            ? {
                data: [...acc.data, 0],
                backgroundColor: [
                  ...acc.backgroundColor,
                  emotionColorMap.get(emotion),
                ],
                borderColor: [...acc.borderColor, emotionColorMap.get(emotion)],
              }
            : {
                data: [0],
                backgroundColor: [emotionColorMap.get(emotion)],
                borderColor: [emotionColorMap.get(emotion)],
              },
        false
      ),
    ],
  },
});
const radarChart = new Chart(context2, {
  type: "radar",
  options: {
    tooltips: {
      enabled: false,
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      fontSize: 20,
    },
    scale: {
      pointLabels: {
        fontSize: 20,
      },
      angleLines: {
        display: false,
      },
      ticks: {
        display: false,
        min: 0,
        max: 2.5,
      },
    },
  },
  data: {
    labels: mapToKeys(emotionColorMap).map(toLabel),
    datasets: [
      mapToKeys(emotionColorMap).reduce(
        (acc, emotion) =>
          acc
            ? {
                data: [...acc.data, 0],
                backgroundColor: [
                  ...acc.backgroundColor,
                  emotionColorMap.get(emotion),
                ],
                borderColor: [...acc.borderColor, emotionColorMap.get(emotion)],
              }
            : {
                data: [0],
                backgroundColor: [emotionColorMap.get(emotion)],
                borderColor: [emotionColorMap.get(emotion)],
              },
        false
      ),
    ],
  },
});

function renderCharts(dataset2) {
  let dataset = dataset2.slice();

  video.onseeked = () => {
    dataset = dataset2.slice();
  };

  requestAnimationFrame(function tick() {
    const i = dataset.findIndex((row) => row[" timestamp"] > video.currentTime);

    if (i === -1 || i === 0) {
      requestAnimationFrame(tick);
      return;
    }

    dataset = dataset.slice(i - 1);

    const parsed = parseRow(dataset[0]);

    const updated = {
      labels: mapToKeys(emotionColorMap).map(toLabel),
      datasets: [
        Object.entries(parsed).reduce(
          (acc, [emotion, value]) =>
            acc
              ? {
                  data: [...acc.data, value],
                  backgroundColor: [
                    ...acc.backgroundColor,
                    emotionColorMap.get(emotion),
                  ],
                  borderColor: [
                    ...acc.borderColor,
                    emotionColorMap.get(emotion),
                  ],
                }
              : {
                  data: [value],
                  backgroundColor: [emotionColorMap.get(emotion)],
                  borderColor: [emotionColorMap.get(emotion)],
                },
          false
        ),
      ],
    };

    barChart.data = updated;
    radarChart.data = updated;

    barChart.update(0);
    radarChart.update(0);

    requestAnimationFrame(tick);
  });
}


const getItems = (row) => (...auNumbers) => {
  return auNumbers.map((num) =>
    num < 10 ? row[` AU0${num}_r`] : row[` AU${num}_r`]
  );
};

function parseRow(row) {
  const actionUnits = getItems(row);

  return {
    surprise: math.mean(actionUnits(1, 2, 5, 26)),
    fear: math.mean(actionUnits(1, 2, 4, 5, 7, 20, 26)),
    happiness: math.mean(actionUnits(6, 12)),
    sadness: math.mean(actionUnits(1, 4, 15)),
    anger: math.mean(actionUnits(4, 5, 7, 23)),
    disgust: math.mean(actionUnits(9, 15)),
    contempt: math.mean(actionUnits(1, 4)),
  };
}
