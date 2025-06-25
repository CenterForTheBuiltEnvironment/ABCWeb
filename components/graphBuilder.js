
// ****************************************************
//  ECharts Line‑Chart Builders
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
//  Utility helpers (interval + label visibility)
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

export function pivotToSeriesArrays(data) {
  return data.legends.map((legend) =>
    data.data.map((row) => ({
      index: row.index,
      y: row[legend],
    }))
  );
}

export function constantColorFns(legends, colorFn) {
  return legends.map((name) => (_ /* unused */) => colorFn(name));
}


// ----------------------------------------------------
//  Generic series builder (single line)
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
//  Generic chart builder scaffold
// ----------------------------------------------------
function baseBuilder({
  rawData,            // Array<Array<item>>  – one array per line
  legends,            // string[]
  title,              // string for chart title
  yAxisCfg,           // { min, max, formatter }
  colorFnArr,         // Array< fn(value) => color >, one per series
  offset = 0,         // data offset when stitching multiple windows
  showAllTooltipSeries = false, // show all series in tooltip
  unit = "", // optional unit for y-axis labels (e.g. "C", "F", etc.)
  precision = 1, // optional precision for y-axis values
}) {
  const dataLength = rawData[0].length;

  const xMin = rawData[0][0]?.index + 1 || 0;
  const xMax = rawData[0].at(-1)?.index + 1 || xMin + 10;  // fallback

  const interval = calculateInterval(dataLength);

  // First label aligned to the next interval
  const labelStart = Math.ceil(xMin / interval) * interval;
  const minAligned = Math.floor(xMin / interval) * interval;

  // console.log(`xMin: ${xMin}, xMax: ${xMax}, interval: ${interval}, labelStart: ${labelStart}`);

  // Tooltip logic (switched by flag)
    const tooltipFormatter = (params) => {
      const lines = [];
      lines.push(`Time: <span id="inlineColor">${params[0].dataIndex + 1 + offset}</span> min`);

      // === Full-series mode: used in hflux/environment charts (no comparison)===
      // Show all series values at the current x-position
      // This is enabled when 'showAllTooltipSeries' is true
      if (showAllTooltipSeries || params.length > 2) {
        params.forEach((p) => {
          const val = Array.isArray(p.data.value) ? p.data.value[1] : p.data.value;
          lines.push(
        `<span style="color:${p.color}">●</span> ${p.seriesName}: <span id="inlineColor">${val.toFixed(precision)}</span> ${unit}`
          );
        });
      } 
      // === Comparison mode: used for comfort/sensation/tsk/tcore charts ===
      // Shows primary and (optional) compared series only
      else {
        lines.push(`${params[0].seriesName}: <span id="inlineColor">${params[0].data.value[1].toFixed(precision)}</span> ${unit}`);
        if (params.length > 1) {
          lines.push(`${params[1].seriesName}-compared: <span id="inlineColor">${params[1].data.value[1].toFixed(precision)}</span> ${unit}`);
        }
      }

      return lines.join("<br />");
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
      min: minAligned,
      max: xMax,
      interval : interval,
      axisTick: {
        show: true,
        interval: 0,
        alignWithLabel: true,
      },
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
        interval: 0, // Show all labels
        // Show xMin "AND" every interval mark thereafter
        formatter: (v) => (v === xMin || (v - minAligned) % interval === 0 ? v : ""),
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
//  Specific chart builders
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
      min: min,
      max: max,
      formatter: (v) => v,
      extract: (d) => d.tskin,
    },
    colorFnArr: [
      (v) => (data.metric ? colorTskin(v) : colorTskinNotMetric(v)),
      (v) => (data.metric ? colorTskin(v) : colorTskinNotMetric(v)),
    ],
    offset: data.offset || 0,
    unit: data.metric ? " °C" : " °F",
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
      min: min,
      max: max,
      formatter: (v) => v,
      extract: (d) => d.tcore,
    },
    colorFnArr: [
      (v) => (data.metric ? colorTcore(v) : colorTcoreNotMetric(v)),
      (v) => (data.metric ? colorTcore(v) : colorTcoreNotMetric(v)),
    ],
    offset: data.offset || 0,
    unit: data.metric ? " °C" : " °F",
  });
}

export function hfluxBuilder(data) {
  const rawData   = pivotToSeriesArrays(data);          // wide → tidy
  const colorFns  = constantColorFns(data.legends,      // series-wise fixed colours
                                     colorHflux);
  const values    = rawData.flat().map(d => d.y);

  return baseBuilder({
    rawData,
    legends: data.legends,
    title: "Heat-Flux Variables vs. Time",
    yAxisCfg: {
      min: Math.min(...values).toFixed(0),
      max: Math.max(...values).toFixed(0),
      formatter: v => v.toFixed(0),
      extract: d => d.y,
    },
    colorFnArr: colorFns,
    offset: data.offset || 0,
    showAllTooltipSeries: true, // this is for heat flux / environment
    unit: "W", // unit for heat flux
    precision: 0, // no decimals for heat flux values
  });
}

export function environmentBuilder(data) {
  // Transform to tidy series data
  const rawData = pivotToSeriesArrays(data);
  const legends = data.legends;

  // Assign fixed color functions per series
  const colorFns = constantColorFns(legends, colorEnv);

  // Calculate y-axis scale (left axis only: exclude rh, v)
  const leftSeriesVals = rawData
    .filter((_, idx) => !["rh", "v"].includes(legends[idx]))
    .flat()
    .map((d) => d.y);
  const minLeft = Math.min(...leftSeriesVals);
  const maxLeft = Math.max(...leftSeriesVals);

  // Build base chart
  const option = baseBuilder({
    rawData,
    legends,
    title: "Environment Variables vs. Time",
    yAxisCfg: {
      min: minLeft,
      max: maxLeft,
      formatter: (v) => v,
      extract: (d) => d.y,
    },
    colorFnArr: colorFns,
    offset: data.offset || 0,
    showAllTooltipSeries: true,
    unit: "",
    precision: 2,
  });

  // Add right y-axis for rh and v
  option.yAxis = [
    option.yAxis, // left
    {
      type: "value",
      name: "RH / Velocity",
      nameLocation: "center",
      nameTextStyle: { padding: 15, fontSize: globalTextStyle.fontSize },
      min: 0,
      max: data.metric ? 2 : 5,
    },
  ];

  // Assign yAxisIndex = 1 to rh / v
  option.series.forEach((s) => {
    if (["rh", "v"].includes(s.name)) {
      s.yAxisIndex = 1;
    }
  });

  return option;
}