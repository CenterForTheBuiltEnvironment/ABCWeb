import {
  colorComfort,
  colorEnv,
  colorHflux,
  colorSensation,
  colorTcore,
  colorTskin,
  environmentMinimax,
  formatComfDescriptor,
  formatSensDescriptor,
  hfluxMinimax,
  miniMax,
} from "@/constants/helperFunctions";

export function comfBuilder(data) {
  // Schema data:
  // {
  //   title: string
  //   legends: array
  //   data: array
  // }
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Comfort vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<span id="inlineColor">${
          params[0].dataIndex
        }</span> min from start<br />${
          params[0].seriesName
        }: <span id="inlineColor">${params[0].data.value.toFixed(3)}</span>`;
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 30 },
      min: -4,
      max: 4,
      axisLabel: {
        formatter: function (val) {
          return val + ": " + formatComfDescriptor(val);
        },
      },
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
    ],
  };

  return options;
}
export function sensBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Sensation vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<span id="inlineColor">${
          params[0].dataIndex
        }</span> min from start<br />${
          params[0].seriesName
        }: <span id="inlineColor">${params[0].data.value.toFixed(3)}</span>`;
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: -4,
      max: 4,
      axisLabel: {
        formatter: function (val) {
          return val + ": " + formatSensDescriptor(val);
        },
      },
      splitNumber: 10,
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

export function tskinBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Skin Temperature vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<span id="inlineColor">${
          params[0].dataIndex
        }</span> min from start<br />${
          params[0].seriesName
        }: <span id="inlineColor">${params[0].data.value.toFixed(3)} C</span>`;
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: parseInt(Math.floor(miniMax(0, data.data, "tskin"))),
      max: parseInt(Math.ceil(miniMax(1, data.data, "tskin"))),
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
            value: item.tskin,
            itemStyle: {
              normal: {
                color: colorTskin(
                  item.tskin,
                  parseInt(Math.floor(miniMax(0, data.data, "tskin"))),
                  parseInt(Math.ceil(miniMax(1, data.data, "tskin")))
                ),
              },
            },
          };
        }),
      },
    ],
  };

  return options;
}

export function tcoreBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Core Temperature vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `<span id="inlineColor">${
          params[0].dataIndex
        }</span> min from start<br />${
          params[0].seriesName
        }: <span id="inlineColor">${params[0].data.value.toFixed(3)} C</span>`;
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: miniMax(0, data.data, "tcore").toFixed(5),
      max: miniMax(1, data.data, "tcore").toFixed(5),
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
            value: item.tcore,
            itemStyle: {
              normal: {
                color: colorTcore(
                  item.tcore,
                  miniMax(0, data.data, "tcore").toFixed(5),
                  miniMax(1, data.data, "tcore").toFixed(5)
                ),
              },
            },
          };
        }),
      },
    ],
  };

  return options;
}

export function hfluxBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Heat Flux Variables vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => value.toFixed(5),
    },
    legend: {
      selectedMode: true,
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
    },
    dataZoom: [
      {
        type: "inside",
      },
    ],
    series: data.legends.map((elem, idx) => {
      return {
        name: elem,
        type: "line",
        data: data.data.map(function (item) {
          return {
            value: item[elem],
            itemStyle: {
              normal: {
                color: colorHflux(
                  item[elem],
                  hfluxMinimax(0, data.data, [elem]).toFixed(5),
                  hfluxMinimax(1, data.data, [elem]).toFixed(5)
                ),
              },
            },
          };
        }),
      };
    }),
  };

  return options;
}

export function environmentBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "IBM Plex Sans",
    },
    title: {
      text: "Environment Variables vs. Time",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => value.toFixed(5),
    },
    legend: {
      selectedMode: true,
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
      data: data.data.map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: [
      {
        type: "value",
        name: "Value",
        nameLocation: "center",
        nameTextStyle: { padding: 10 },
      },
      {
        type: "value",
        name: "Value - rh and v",
        nameTextStyle: {
          padding: 10,
          color: "red",
          fontWeight: "600",
        },
        nameLocation: "center",
        axisLabel: {
          textStyle: {
            color: "red",
            fontWeight: "600",
          },
        },
        min: 0,
        max: 2,
      },
    ],
    dataZoom: [
      {
        type: "inside",
      },
    ],
    series: data.legends.map((elem, idx) => {
      if (elem == "rh" || elem == "v") {
        return {
          name: elem,
          type: "line",
          yAxisIndex: 1,
          data: data.data.map(function (item) {
            return {
              value: item[elem],
              itemStyle: {
                normal: {
                  color: colorEnv(item[elem], 0, 2),
                },
              },
            };
          }),
        };
      } else {
        return {
          name: elem,
          type: "line",
          data: data.data.map(function (item) {
            return {
              value: item[elem],
              itemStyle: {
                normal: {
                  color: colorEnv(
                    item[elem],
                    environmentMinimax(0, data.data, [elem]).toFixed(5),
                    environmentMinimax(1, data.data, [elem]).toFixed(5)
                  ),
                },
              },
            };
          }),
        };
      }
    }),
  };

  return options;
}
