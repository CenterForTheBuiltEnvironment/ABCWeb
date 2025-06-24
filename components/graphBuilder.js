// import {
//   colorComfort,
//   colorEnv,
//   colorHflux,
//   colorSensation,
//   colorTcore,
//   colorTcoreNotMetric,
//   colorTskin,
//   colorTskinNotMetric,
//   environmentMinimax,
//   formatComfDescriptor,
//   formatSensDescriptor,
//   hfluxMinimax,
//   miniMax,
// } from "@/constants/helperFunctions";

// const globalTextStyle = {
//   fontFamily: "Arial",
//   color: "gray.700",
// };

// export function calculateInterval(len) {
//   if (len <= 20) return 1;     // ≤ 20 min: every 1 min
//   if (len <= 60) return 5;      // ≤ 1 hour: every 5 min
//   if (len <= 120) return 10;    // ≤ 2 hours: every 10 min
//   if (len <= 240) return 15;    // ≤ 4 hours: every 15 min
//   if (len <= 360) return 30;    // ≤ 6 hours: every 30 min
//   return 60;                    // > 6 hours: every 60 min
// }

// export function shouldShowLabel(index, value, dataLen) {
//   const step = calculateInterval(dataLen);   // 1, 5, 20 ...
//   if (index === 0 || index === dataLen - 1) return true; // First and last points always shown
//   return value % step === 0; // Show label if value is a multiple of step
// }

// export function comfBuilder(data) {
//   const dataLength = data.data[0].length;
//   const interval = calculateInterval(dataLength);

//   const tooltipFormatter = (params) => {
//     let time, comfort;

//     // Safely handle value as [x, y] array or fallback
    
//     if (Array.isArray(params[0].data.value)) {
//       [time, comfort] = params[0].data.value;
//     } else {
//       time = params[0].dataIndex + 1 + data.offset;
//       comfort = params[0].data.value;
//     }

//     return `<span id="inlineColor">${time + data.offset}</span> min from start<br />
//             ${params[0].seriesName}: <span id="inlineColor">${comfort.toFixed(3)}</span>`;
//   };

//   const buildSeries = (items, legendIdx) => ({
//     name: data.legends[legendIdx],
//     type: "line",
//     showSymbol: true,           // Hide markers by default
//     emphasis: { showSymbol: true }, // Show on hover
//     data: items.map((item) => ({
//       value: [item.index + 1, item.comfort],
//       itemStyle: {
//         normal: {
//           color: colorComfort(item.comfort, legendIdx === 1),
//         },
//       },
//     })),
//   });

//   const options = {
//     textStyle: globalTextStyle,
//     title: {
//       text: "Comfort vs. Time",
//       left: "5%",
//       top: "5%",
//     },
//     tooltip: {
//       trigger: "axis",
//       formatter: tooltipFormatter,
//     },
//     legend: {
//       data: data.legends,
//     },
//     grid: {
//       left: "5%",
//       right: "5%",
//       bottom: "5%",
//       containLabel: true,
//     },
//     toolbox: {
//       right: 5,
//       feature: {
//         saveAsImage: {},
//         restore: {},
//       },
//     },
//     xAxis: {
//       type: "value",
//       min: 0,
//       max: dataLength,
//       interval: interval,
//       name: "Minutes since start",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       axisPointer: { type: "shadow" },
//       axisLabel: {
//         formatter: (v) => `${v}`,
//         showMinLabel: true,
//         showMaxLabel: true,
//       },
//     },
//     yAxis: {
//       type: "value",
//       name: "Value",
//       nameLocation: "center",
//       nameTextStyle: { padding: 30 },
//       min: -4,
//       max: 4,
//       axisLabel: {
//         formatter: (v) => `${v}: ${formatComfDescriptor(v)}`,
//       },
//     },
//     dataZoom: [
//       {
//         type: "inside",
//       },
//     ],
//     series: [
//       buildSeries(data.data[0], 0),
//       ...(data.data.length > 1 ? [buildSeries(data.data[1], 1)] : []),
//     ],
//   };

//   return options;
// }

// export function sensBuilder(data) {
//   const options = {
//     textStyle: globalTextStyle,
//     title: {
//       text: "Sensation vs. Time",
//       left: "5%",
//       top: "5%",
//     },
//     tooltip: {
//       trigger: "axis",
//       formatter: function (params) {
//         return `<span id="inlineColor">${
//           params[0].dataIndex + 1 + data.offset
//         }</span> min from start<br />${
//           params[0].seriesName
//         }: <span id="inlineColor">${params[0].data.value.toFixed(
//           3
//         )}</span><br />${
//           data.data.length > 1 && params.length > 1
//             ? `${
//                 params[0].seriesName
//               }-compared: <span id="inlineColor">${params[1].data.value.toFixed(
//                 3
//               )}</span>`
//             : ""
//         }`;
//       },
//     },
//     legend: {
//       data: data.legends,
//     },
//     grid: {
//       left: "5%",
//       right: "5%",
//       bottom: "5%",
//       containLabel: true,
//     },
//     toolbox: {
//       right: 5,
//       feature: {
//         saveAsImage: {},
//         restore: {},
//       },
//     },
//     xAxis: {
//       name: "Minutes since start",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       axisPointer: {
//         type: "shadow",
//       },
//       data: data.data[0].map((e) => {
//         return e.index + 1;
//       }),
//     },
//     yAxis: {
//       type: "value",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       min: -4,
//       max: 4,
//       axisLabel: {
//         formatter: function (val) {
//           return val + ": " + formatSensDescriptor(val);
//         },
//       },
//       splitNumber: 10,
//     },
//     dataZoom: [
//       {
//         type: "inside",
//       },
//     ],
//     series: [
//       {
//         name: data.legends[0],
//         type: "line",
//         data: data.data[0].map(function (item) {
//           return {
//             value: item.sensation,
//             itemStyle: {
//               normal: {
//                 color: colorSensation(item.sensation, false),
//               },
//             },
//           };
//         }),
//       },
//     ],
//   };

//   if (data.data.length > 1) {
//     options.series.push({
//       name: data.legends[1],
//       type: "line",
//       data: data.data[1].map(function (item) {
//         return {
//           value: item.sensation,
//           itemStyle: {
//             normal: {
//               color: colorSensation(item.sensation, true),
//             },
//           },
//         };
//       }),
//     });
//   }

//   return options;
// }

// export function tskinBuilder(data) {
//   const options = {
//     textStyle: globalTextStyle,
//     title: {
//       text: "Skin Temperature vs. Time",
//       left: "5%",
//       top: "5%",
//     },
//     tooltip: {
//       trigger: "axis",
//       formatter: function (params) {
//         return `<span id="inlineColor">${
//           params[0].dataIndex + 1 + data.offset
//         }</span> min from start<br />${
//           params[0].seriesName
//         }: <span id="inlineColor">${params[0].data.value.toFixed(3)} ${
//           data.metric ? "C" : "F"
//         }</span><br />${
//           data.data.length > 1 && params.length > 1
//             ? `${
//                 params[0].seriesName
//               }-compared: <span id="inlineColor">${params[1].data.value.toFixed(
//                 3
//               )} ${data.metric ? "C" : "F"}</span>`
//             : ""
//         }`;
//       },
//     },
//     legend: {
//       data: data.legends,
//     },
//     grid: {
//       left: "5%",
//       right: "5%",
//       bottom: "5%",
//       containLabel: true,
//     },
//     toolbox: {
//       right: 5,
//       feature: {
//         saveAsImage: {},
//         restore: {},
//       },
//     },
//     xAxis: {
//       name: "Minutes since start",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       axisPointer: {
//         type: "shadow",
//       },
//       data: data.data[0].map((e) => {
//         return e.index + 1;
//       }),
//     },
//     yAxis: {
//       type: "value",
//       name: "Value",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       min: data.metric ? 20 : 68,
//       max: data.metric ? 38 : 101,
//     },
//     dataZoom: [
//       {
//         type: "inside",
//       },
//     ],
//     series: [
//       {
//         name: data.legends[0],
//         type: "line",
//         data: data.data[0].map(function (item) {
//           return {
//             value: item.tskin,
//             itemStyle: {
//               normal: {
//                 color: data.metric
//                   ? colorTskin(item.tskin)
//                   : colorTskinNotMetric(item.tskin),
//               },
//             },
//           };
//         }),
//       },
//     ],
//   };

//   if (data.data.length > 1) {
//     options.series.push({
//       name: data.legends[1],
//       type: "line",
//       data: data.data[1].map(function (item) {
//         return {
//           value: item.tskin,
//           itemStyle: {
//             normal: {
//               color: data.metric
//                 ? colorTskin(item.tskin)
//                 : colorTskinNotMetric(item.tskin),
//             },
//           },
//         };
//       }),
//     });
//   }

//   return options;
// }

// export function tcoreBuilder(data) {
//   const options = {
//     textStyle: globalTextStyle,
//     title: {
//       text: "Core Temperature vs. Time",
//       left: "5%",
//       top: "5%",
//     },
//     tooltip: {
//       trigger: "axis",
//       formatter: function (params) {
//         return `<span id="inlineColor">${
//           params[0].dataIndex + 1 + data.offset
//         }</span> min from start<br />${
//           params[0].seriesName
//         }: <span id="inlineColor">${params[0].data.value.toFixed(3)} ${
//           data.metric ? "C" : "F"
//         }</span><br />${
//           data.data.length > 1 && params.length > 1
//             ? `${
//                 params[0].seriesName
//               }-compared: <span id="inlineColor">${params[1].data.value.toFixed(
//                 3
//               )} ${data.metric ? "C" : "F"}</span>`
//             : ""
//         }`;
//       },
//     },
//     legend: {
//       data: data.legends,
//     },
//     grid: {
//       left: "5%",
//       right: "5%",
//       bottom: "5%",
//       containLabel: true,
//     },
//     toolbox: {
//       right: 5,
//       feature: {
//         saveAsImage: {},
//         restore: {},
//       },
//     },
//     xAxis: {
//       name: "Minutes since start",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       axisPointer: {
//         type: "shadow",
//       },
//       data: data.data[0].map((e) => {
//         return e.index + 1;
//       }),
//     },
//     yAxis: {
//       type: "value",
//       name: "Value",
//       nameLocation: "center",
//       nameTextStyle: { padding: 10 },
//       min: data.metric ? 25 : 77,
//       max: data.metric ? 40 : 104,
//     },
//     dataZoom: [
//       {
//         type: "inside",
//       },
//     ],
//     series: [
//       {
//         name: data.legends[0],
//         type: "line",
//         data: data.data[0].map(function (item) {
//           return {
//             value: item.tcore,
//             itemStyle: {
//               normal: {
//                 color: data.metric
//                   ? colorTcore(item.tcore)
//                   : colorTcoreNotMetric(item.tcore),
//               },
//             },
//           };
//         }),
//       },
//     ],
//   };

//   if (data.data.length > 1) {
//     options.series.push({
//       name: data.legends[1],
//       type: "line",
//       data: data.data[1].map(function (item) {
//         return {
//           value: item.tcore,
//           itemStyle: {
//             normal: {
//               color: data.metric
//                 ? colorTcore(item.tcore)
//                 : colorTcoreNotMetric(item.tcore),
//             },
//           },
//         };
//       }),
//     });
//   }

//   return options;
// }

export function hfluxBuilder(data) {
  const options = {
    textStyle: globalTextStyle,
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
      left: 80,
      right: 30,
      top: 60,
      bottom: 60,
      width: 600,     // 👈 プロットエリアの幅を固定（px指定）
      height: 300,    // 👈 プロットエリアの高さを固定（px指定）
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
    textStyle: globalTextStyle,
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
      data: data.data.map((e) => e.index + 1),
    },
    yAxis: [
      {
        type: "value",
        name: "Value - ta, mrt, solar, eht",
        nameLocation: "center",
        nameTextStyle: { padding: 10 },
      },
      {
        type: "value",
        name: "Value - rh and v",
        nameLocation: "center",
        min: 0,
        max: data.metric ? 2 : 5,
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

// ****************************************************
//  ECharts Line‑Chart Builders – Refactored Version
// ----------------------------------------------------
//  All builders (comfort, sensation, tskin, tcore, etc.)
//  now share a common scaffold so that axis formatting,
//  tooltip logic, symbol strategy, zoom, grid, legend
//  and toolbox options stay consistent across charts.
// ****************************************************

import {
  colorComfort,
  colorEnv,
  colorHflux,
  colorSensation,
  colorTcore,
  colorTcoreNotMetric,
  colorTskin,
  colorTskinNotMetric,
  formatComfDescriptor,
  formatSensDescriptor,
} from "@/constants/helperFunctions";

import { background, theme } from "@chakra-ui/react";
const chartTextColor = theme.colors.gray[700]; // "#4A5568"
  
// -----------------------
//  Global text style
// -----------------------
const globalTextStyle = {
  fontFamily: "Arial",
  color: chartTextColor,
  fontSize: 14
};

// ----------------------------------------------------
//  1)  Utility helpers (interval + label visibility)
// ----------------------------------------------------
export function calculateInterval(len) {
  if (len <= 20) return 1;
  if (len <= 60) return 5;
  if (len <= 120) return 10;
  if (len <= 240) return 15;
  if (len <= 360) return 30;
  return 60;
}

export function shouldShowLabel(index, value, dataLen) {
  const step = calculateInterval(dataLen);
  if (index === 0 || index === dataLen - 1) return true;
  return value % step === 0;
}

// ----------------------------------------------------
//  2)  Generic series builder (single line)
// ----------------------------------------------------
function buildSeries({ items, legendName, pointColor }) {
  return {
    name: legendName,
    type: "line",
    emphasis: { showSymbol: true }, // show marker on hover
    data: items.map((item) => ({
      value: [item.index + 1, item.y], // [x, y]
      itemStyle: {
        normal: { color: pointColor(item.y) },
      },
    })),
  };
}

// ----------------------------------------------------
//  3)  Generic chart builder scaffold
// ----------------------------------------------------
function baseBuilder({
  rawData,            // Array<Array<item>>  – one array per line
  legends,            // string[]
  title,              // string for chart title
  yAxisCfg,           // { min, max, formatter }
  colorFnArr,         // Array< fn(value) => color >, one per series
  offset = 0,         // data offset when stitching multiple windows
}) {
  const dataLength = rawData[0].length;
  const interval = calculateInterval(dataLength);

  // Tooltip shared formatter
  const tooltipFormatter = (params) => {
    const [time, val] = params[0].data.value;
    return `<span id="inlineColor">${time + offset}</span> min from start<br />` +
           `${params[0].seriesName}: <span id="inlineColor">${val.toFixed(3)}</span>`;
  };

  // Build series array
  const series = rawData.map((array, idx) =>
    buildSeries({
      items: array.map((d) => ({ ...d, y: yAxisCfg.extract(d) })),
      legendName: legends[idx] || `Series ${idx + 1}`,
      pointColor: colorFnArr[idx],
    })
  );

  return {
    textStyle: globalTextStyle,
    title: { text: title, left: "5%", top: "5%" },
    tooltip: { trigger: "axis", formatter: tooltipFormatter },
    legend: { data: legends },
    grid: { left: "20%", right: "10%", bottom: "15%", containLabel: false},
    toolbox: {
      right: 5,
      feature: { saveAsImage: {}, restore: {} },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: dataLength,
      interval : interval,
      axisLine: {
      lineStyle: {
        color: chartTextColor, // axis line color
        },
      },
      name: "Time (min)",
      nameLocation: "center",
      nameTextStyle: { padding: 15, fontSize: globalTextStyle.fontSize },
      axisPointer: { type: "shadow" },
      axisLabel: {
        formatter: (v) => `${v}`,
        fontSize: globalTextStyle.fontSize,
        showMinLabel: true,
        showMaxLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: "Value",
      nameLocation: "center",
      nameTextStyle: { padding: 15, fontSize: globalTextStyle.fontSize },
      min: yAxisCfg.min,
      max: yAxisCfg.max,
            axisLine: {
      lineStyle: {
        color: chartTextColor, // axis line color
        },
      },
      axisLabel: {
        formatter: yAxisCfg.formatter,
        fontSize: globalTextStyle.fontSize,
      },
    },
    dataZoom: [{ type: "inside" }],
    series,
  };
}

// ----------------------------------------------------
//  4)  Specific chart builders
// ----------------------------------------------------

export function comfBuilder(data) {
  return baseBuilder({
    rawData: data.data, // expecting [[items], [items?]]
    legends: data.legends,
    title: "Comfort vs. Time",
    yAxisCfg: {
      min: -4,
      max: 4,
      formatter: (v) => `${v}: ${formatComfDescriptor(v)}`,
      extract: (d) => d.comfort,
    },
    colorFnArr: [
      (v) => colorComfort(v, false),
      (v) => colorComfort(v, true),
    ],
    offset: data.offset || 0,
  });
}

export function sensBuilder(data) {
  return baseBuilder({
    rawData: data.data,
    legends: data.legends,
    title: "Sensation vs. Time",
    yAxisCfg: {
      min: -4,
      max: 4,
      formatter: (v) => `${v}: ${formatSensDescriptor(v)}`,
      extract: (d) => d.sensation,
    },
    colorFnArr: [
      (v) => colorSensation(v, false),
      (v) => colorSensation(v, true),
    ],
    offset: data.offset || 0,
  });
}

export function tskinBuilder(data) {
  const min = data.metric ? 20 : 68;
  const max = data.metric ? 38 : 101;
  return baseBuilder({
    rawData: data.data,
    legends: data.legends,
    title: "Skin Temperature vs. Time",
    yAxisCfg: {
      min,
      max,
      formatter: (v) => v,
      extract: (d) => d.tskin,
    },
    colorFnArr: [
      (v) => (data.metric ? colorTskin(v) : colorTskinNotMetric(v)),
      (v) => (data.metric ? colorTskin(v) : colorTskinNotMetric(v)),
    ],
    offset: data.offset || 0,
  });
}

export function tcoreBuilder(data) {
  const min = data.metric ? 25 : 77;
  const max = data.metric ? 40 : 104;
  return baseBuilder({
    rawData: data.data,
    legends: data.legends,
    title: "Core Temperature vs. Time",
    yAxisCfg: {
      min,
      max,
      formatter: (v) => v,
      extract: (d) => d.tcore,
    },
    colorFnArr: [
      (v) => (data.metric ? colorTcore(v) : colorTcoreNotMetric(v)),
      (v) => (data.metric ? colorTcore(v) : colorTcoreNotMetric(v)),
    ],
    offset: data.offset || 0,
  });
}

// For hflux & environment builders, which need multiple y‑axes or many legends,
// we can still call baseBuilder but pass custom configs or fall back to the
// original specialised implementations if multi‑axis logic is complex.

// ----------------------------------------------------
//  5)  Example of extending for a dual‑axis chart later
// ----------------------------------------------------
// export function environmentBuilder(data) {
//   // custom multi‑axis logic here …
// }

// ****************************************************
//  End of refactored builders
// ****************************************************
