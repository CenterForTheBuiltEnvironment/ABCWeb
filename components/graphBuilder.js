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
      fontFamily: "Arial",
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
          params[0].dataIndex + 1
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
      data: data.data[0].map((e) => {
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
        data: data.data[0].map(function (item) {
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

  if (data.data.length > 1) {
    options.series.push({
      name: data.legends[1],
      type: "line",
      data: data.data[1].map(function (item) {
        return {
          value: item.comfort,
          itemStyle: {
            normal: {
              color: colorComfort(item.comfort, true),
            },
          },
        };
      }),
    });
  }

  return options;
}
export function sensBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "Arial",
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
          params[0].dataIndex + 1
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
      data: data.data[0].map((e) => {
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
        data: data.data[0].map(function (item) {
          return {
            value: item.sensation,
            itemStyle: {
              normal: {
                color: colorSensation(item.sensation, false),
              },
            },
          };
        }),
      },
    ],
  };

  if (data.data.length > 1) {
    options.series.push({
      name: data.legends[1],
      type: "line",
      data: data.data[1].map(function (item) {
        return {
          value: item.sensation,
          itemStyle: {
            normal: {
              color: colorSensation(item.sensation, true),
            },
          },
        };
      }),
    });
  }

  return options;
}

export function tskinBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "Arial",
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
          params[0].dataIndex + 1
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
      data: data.data[0].map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: 20,
      max: 38,
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
        data: data.data[0].map(function (item) {
          return {
            value: item.tskin,
            itemStyle: {
              normal: {
                color: colorTskin(
                  item.tskin
                  // parseInt(Math.floor(miniMax(0, data.data[0], "tskin"))),
                  // parseInt(Math.ceil(miniMax(1, data.data[0], "tskin")))
                ),
              },
            },
          };
        }),
      },
    ],
  };

  if (data.data.length > 1) {
    options.series.push({
      name: data.legends[1],
      type: "line",
      data: data.data[1].map(function (item) {
        return {
          value: item.tskin,
          itemStyle: {
            normal: {
              color: colorTskin(
                item.tskin
                // parseInt(Math.floor(miniMax(0, data.data[1], "tskin"))),
                // parseInt(Math.ceil(miniMax(1, data.data[1], "tskin")))
              ),
            },
          },
        };
      }),
    });
  }

  return options;
}

export function tcoreBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "Arial",
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
          params[0].dataIndex + 1
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
      data: data.data[0].map((e) => {
        return e.index + 1;
      }),
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
      min: 25,
      max: 40,
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
        data: data.data[0].map(function (item) {
          return {
            value: item.tcore,
            itemStyle: {
              normal: {
                color: colorTcore(
                  item.tcore
                  // miniMax(0, data.data[0], "tcore").toFixed(5),
                  // miniMax(1, data.data[0], "tcore").toFixed(5)
                ),
              },
            },
          };
        }),
      },
    ],
  };

  if (data.data.length > 1) {
    options.series.push({
      name: data.legends[1],
      type: "line",
      data: data.data[1].map(function (item) {
        return {
          value: item.tcore,
          itemStyle: {
            normal: {
              color: colorTcore(
                item.tcore
                // miniMax(0, data.data[1], "tcore").toFixed(5),
                // miniMax(1, data.data[1], "tcore").toFixed(5)
              ),
            },
          },
        };
      }),
    });
  }

  return options;
}

export function hfluxBuilder(data) {
  const options = {
    textStyle: {
      fontFamily: "Arial",
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
                color: colorHflux(elem),
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
      fontFamily: "Arial",
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
                  color: colorEnv(elem),
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
                  color: colorEnv(elem),
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
