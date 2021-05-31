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

  export let data;
  import { onMount } from "svelte";
  let chart;
  let ctx;
  onMount(() => {
    console.log(data);
    const chartElement = document.getElementById(
      "myChart"
    ) as HTMLCanvasElement;
    ctx = chartElement.getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data
          .map((r) => r.date)
          .map((date) =>
            new Intl.DateTimeFormat("en-GB", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }).format(new Date(date))
          ),
        datasets: [
          {
            data: data.map((r) => r.score),
            label: "Early Warning Score",
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgb(255, 99, 132)",
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

<canvas id="myChart" width="400" height="400" />
