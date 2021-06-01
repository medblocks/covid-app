<script lang="ts">
  import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
  } from "chart.js";

  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  );

  export let data: { score: number; date: string }[];
  import { onMount } from "svelte";
  import { relativeTime } from "./relativeTime";
  let chart;
  let element;
  let ctx;
  export let label: string;
  export let color: string = "rgb(255, 99, 132)";
  onMount(() => {
    const chartElement = element as HTMLCanvasElement;
    ctx = chartElement.getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((r) => r.date).map(relativeTime),
        datasets: [
          {
            data: data.map((r) => r.score),
            label,
            borderColor: color,
            backgroundColor: color,
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
            },
          },
          y: {
            suggestedMax: 20,
            suggestedMin: 0,
          },
        },
      },
    });
  });
</script>

<canvas bind:this={element} width="400" height="400" />
