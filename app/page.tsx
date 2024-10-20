'use client'
import { sheetlink } from "@/sheetlink";
// import zoomPlugin from 'chartjs-plugin-zoom';
// Import dynamically and cast to the proper type expected for plugins
// const zoomPlugin = dynamic(() => import('chartjs-plugin-zoom').then(mod => mod.default as unknown as Plugin), {
//   ssr: false,
// });


import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'

import { Bar, getElementsAtEvent, Line } from "react-chartjs-2";
if (typeof window !== 'undefined') {
  import('chartjs-plugin-zoom').then((zoomPlugin) => {
    ChartJS.register(zoomPlugin.default); // Register the plugin
  });
}

ChartJS.register({
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
})

export default function Home() {

  // const [dateRange, setDateRange] = useState("");
  // const [gender, setGender] = useState("");
  // const [age, setAge] = useState("");

  // const p:number[] = [];
 

  const [sample, setSample] = useState([{
    "id": 1,
    "Day": "2022-10-03T18:30:00.000Z",
    "Age": "15-25",
    "Gender": "Male",
    "A": 790,
    "B": 694,
    "C": 974,
    "D": 904,
    "E": 80,
    "F": 325
},
{
    "id": 2,
    "Day": "2022-10-03T18:30:00.000Z",
    "Age": ">25",
    "Gender": "Male",
    "A": 46,
    "B": 76,
    "C": 930,
    "D": 986,
    "E": 591,
    "F": 601
},
{
    "id": 3,
    "Day": "2022-10-03T18:30:00.000Z",
    "Age": "15-25",
    "Gender": "Female",
    "A": 752,
    "B": 526,
    "C": 250,
    "D": 478,
    "E": 600,
    "F": 325
},])

let filterd = sample


useEffect(() => {
  fetch(sheetlink).then(data => data.json()).then(data => setSample(data) ).catch(err => console.log(err))
}, [])


const available: (keyof typeof sample[0])[] = ["A", "B", "C", "D", "E", "F"];

const totals = available.map((feature) => {
  return filterd.reduce((acc, current) => {
    const value = current[feature] as number; 
    return acc + value;
  }, 0);
});

console.log(totals)


  const data = {
    labels: ["A", "B", "C", "D", "E", "F"],
    datasets: [{
      label: 'Sales Numbers',
      data: totals,
      borderColor: 'black',
      backgroundColor: ["blue"],
      borderWidth: 1
    }]
  };

  const options = {
    indexAxis: 'y' as const,
    
  };


  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: "Sales of the week",
        data: [3, 6, 9, 2, 5],
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: 'aqua'
      }
    ]
  }

  const lineOption = {
    scales: {
      y: {
        // min: 3,
        // max: 12
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as const, 
        },
        zoom: {
          wheel: {
            enabled: true, 
          },
          pinch: {
            enabled: true, 
          },
          mode: 'xy' as const, 
        },
      },
    },
  }

  const chartRef = useRef<ChartJS<'bar'> | null>(null)
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(chartRef.current && getElementsAtEvent(chartRef.current, e).length > 0) {
      console.log(getElementsAtEvent(chartRef.current, e))
    }
  }

  return (
    <div className="w-[40rem] p-7">
      <Bar
        data={data}
        options={options}
        onClick={handleClick}
        ref = {chartRef}
      ></Bar>
      <Line
        data={lineData}
        options={lineOption}
      ></Line>
    </div>
  );
}
