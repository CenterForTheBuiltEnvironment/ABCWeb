import {
  colorComfort,
  colorSensation,
  miniMax,
} from "@/constants/helperFunctions";

export default function graphBuilderOptions(data) {
  // Schema data:
  // {
  //   title: string
  //   legends: array
  //   data: array
  //   isBasic: boolean (determining whether the graph is either comfort or sensation)
  // }
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: data.title,
      left: "5%",
      top: "8%",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<span id="inlineColor">${
          params[0].dataIndex
        }</span> min from start<br />${
          params[0].seriesName
        }: <span id="inlineColor">${params[0].data.value.toFixed(
          3
        )}</span><br />${
          params[1].seriesName
        }: <span id="inlineColor">${params[1].data.value.toFixed(3)}</span>`;
      },
    },
    legend: {
      data: data.legends,
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
    },
    toolbox: {
      right: 5,
      feature: {
        saveAsImage: {},
        restore: {},
      },
    },
    xAxis: {
      name: "Minutes since start",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      axisPointer: {
        type: "shadow",
      },
      data: data.data.map((e, index) => {
        return index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: data.isBasic ? -4 : parseInt(Math.floor(miniMax(0, data.data))),
      max: data.isBasic ? 4 : parseInt(Math.ceil(miniMax(1, data.data))),
    },
    dataZoom: [
      {
        type: "inside",
      },
    ],
    series: [
      {
        name: data.legends[0],
        type: "line",
        data: data.data.map(function (item) {
          return {
            value: item.comfort,
            itemStyle: {
              normal: {
                color: colorComfort(item.comfort),
              },
            },
          };
        }),
      },
      {
        name: data.legends[1],
        type: "line",
        data: data.data.map(function (item) {
          return {
            value: item.sensation,
            itemStyle: {
              normal: {
                color: colorSensation(item.sensation),
              },
            },
          };
        }),
      },
    ],
  };

  return options;
}
