import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
// CSV is imported as raw string via Rsbuild config
import starDataCsv from "@/assets/SampleData/star-history-202618.csv";

interface DataPoint {
  date: Date;
  stars: number;
}

// Parse CSV at build time
const parseCSV = (csv: string): DataPoint[] => {
  const lines = csv.trim().split("\n");
  // Skip header row
  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(",");
      // Format: Repository,Date,Stars
      // Date is like: "Mon Sep 04 2023 08:30:04 GMT+0200 (Central Africa Time)"
      const dateStr = parts[1].trim();
      const stars = Number.parseInt(parts[2].trim(), 10);

      // Parse the date string - extract the main date parts
      const dateMatch = dateStr.match(/\w+ (\w+ \d+ \d+)/);
      const date = dateMatch ? new Date(dateMatch[1]) : new Date(dateStr);

      return { date, stars };
    });
};

const rawData = parseCSV(starDataCsv);

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

export const StarHistoryChart = () => {
  const width = 800;
  const height = 400;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 50;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minTime = rawData[0]?.date.getTime() || 0;
  const maxTime = rawData[rawData.length - 1]?.date.getTime() || 1;
  const timeRange = maxTime - minTime || 1;
  const maxStars = Math.max(...rawData.map((d) => d.stars), 1);

  const points = useMemo(() => {
    return rawData.map((d) => {
      const xRatio = (d.date.getTime() - minTime) / timeRange;
      const x = paddingLeft + xRatio * chartWidth;
      const y = paddingTop + chartHeight - (d.stars / maxStars) * chartHeight;
      return { x, y, date: d.date, stars: d.stars };
    });
  }, [chartWidth, chartHeight, maxStars, minTime, timeRange]);

  const polylinePath = points.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPath =
    points.length > 0
      ? `M ${points[0].x},${paddingTop + chartHeight} ` +
        points.map((p) => `L ${p.x},${p.y}`).join(" ") +
        ` L ${points[points.length - 1].x},${paddingTop + chartHeight} Z`
      : "";

  // Generate Y-axis tick values
  const yTicks = [0, 5, 10, 15, 20, maxStars].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );

  // Generate time-based X-axis labels
  const xLabels =
    rawData.length > 0
      ? [
          { label: formatDate(rawData[0].date), x: paddingLeft },
          {
            label: formatDate(rawData[Math.floor(rawData.length / 2)].date),
            x: width / 2,
          },
          {
            label: formatDate(rawData[rawData.length - 1].date),
            x: width - paddingRight,
          },
        ]
      : [];

  return (
    <Box borderRadius="xl" p="2" position="relative" w="full">
      <svg
        style={{ width: "100%", height: "auto" }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id="starGradient" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--chakra-colors-brand-500)"
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor="var(--chakra-colors-brand-500)"
              stopOpacity="0.05"
            />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {yTicks.map((tick) => {
          const y = paddingTop + chartHeight - (tick / maxStars) * chartHeight;
          return (
            <line
              key={tick}
              stroke="var(--chakra-colors-whiteAlpha-200)"
              strokeWidth="1"
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y}
              y2={y}
            />
          );
        })}

        {/* Y-Axis */}
        <line
          stroke=""
          strokeWidth="2"
          x1={paddingLeft}
          x2={paddingLeft}
          y1={paddingTop}
          y2={paddingTop + chartHeight}
        />

        {/* X-Axis */}
        <line
          stroke=""
          strokeWidth="2"
          x1={paddingLeft}
          x2={width - paddingRight}
          y1={paddingTop + chartHeight}
          y2={paddingTop + chartHeight}
        />

        {/* Y-Axis Label */}
        <text
          fill="var(--chakra-colors-fg)"
          fontFamily="mono"
          fontSize="11"
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          x={15}
          y={height / 2}
        >
          Stars
        </text>

        {/* Y-Axis Ticks */}
        {yTicks.map((tick) => {
          const y = paddingTop + chartHeight - (tick / maxStars) * chartHeight;
          return (
            <text
              fill="var(--chakra-colors-fg)"
              fontFamily="mono"
              fontSize="10"
              key={tick}
              textAnchor="end"
              x={paddingLeft - 8}
              y={y + 4}
            >
              {tick}
            </text>
          );
        })}

        {/* X-Axis Label */}
        <text
          fill="var(--chakra-colors-fg)"
          fontFamily="mono"
          fontSize="11"
          textAnchor="middle"
          x={width / 2}
          y={height - 5}
        >
          Date
        </text>

        {/* X-Axis Ticks */}
        {xLabels.map((item, i) => (
          <text
            fill="var(--chakra-colors-fg)"
            fontFamily="mono"
            fontSize="10"
            key={i}
            textAnchor={
              i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"
            }
            x={item.x}
            y={paddingTop + chartHeight + 18}
          >
            {item.label}
          </text>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#starGradient)" />

        {/* Line */}
        <polyline
          fill="none"
          points={polylinePath}
          stroke="var(--chakra-colors-brand-500)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            cx={p.x}
            cy={p.y}
            fill="var(--chakra-colors-brand-500)"
            key={i}
            r="5"
            stroke="var(--chakra-colors-bg)"
            strokeWidth="2"
          />
        ))}
      </svg>

      <Flex justify="center" mt="4">
        <Text color="fg.subtle" fontFamily="mono" fontSize="xs">
          Genrescope Star Growth ({rawData.length} stars)
        </Text>
      </Flex>
    </Box>
  );
};
