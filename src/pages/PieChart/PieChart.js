// import { useTheme } from "@emotion/react";
// import {
//   Autocomplete,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useMemo, useState } from "react";
// import { Chart } from "react-google-charts";
// import SecondPieChart from "./SecondPieChart";
// import { AgGridReact } from "ag-grid-react";
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// const taskStatus = [
//   { label: "Running", value: "Running" },
//   { label: "Close", value: "Close" },
//   { label: "Over Due", value: "Over Due" },
//   { label: "Hold", value: "Hold" },
// ];

// export const data = [
//   ["Task", "Hours per Day"],
//   ["Running", 11],
//   ["OverDue", 2],
//   ["Close", 2],
// ];

// const options = {
//   title: "My Daily Activities",
// };

// const PieChart = () => {
//   const [chartTable, setChartTable] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [categoryItem, setCategoryItem] = React.useState("");
//   const [stageItem, setStageItem] = React.useState("");

//   const categoryData = chartData.map((x) => x.category);
//   const uniqueData = [];
//   const uniqueSet = new Set();
//   for (const item of categoryData) {
//     if (!uniqueSet.has(item)) {
//       uniqueSet.add(item);
//       uniqueData.push(item);
//     }
//   }
//   const resultArray = Object.entries(uniqueData).map(([key, value]) => ({
//     label: value,
//     value: value,
//   }));
//   const taskStatusData = chartData.map((x) => x.task);
//   const uniqueDataTask = [];
//   const uniqueSetTask = new Set();
//   for (const item of taskStatusData) {
//     if (!uniqueSetTask.has(item)) {
//       uniqueSetTask.add(item);
//       uniqueDataTask.push(item);
//     }
//   }

//   const [selectedTasks, setSelectedTasks] = useState([]); // State to hold the selected tasks
//   console.log("selectedTasks",selectedTasks);
//     const handleTaskChange = (event, newValue) => {
//       setSelectedTasks(newValue); // Update the state with the new selected tasks
//     };
//   const stageStatusData = chartData.map((x) => x.stage);
//   const uniqueDataStage = [];
//   const uniqueSetStage = new Set();
//   for (const item of stageStatusData) {
//     if (!uniqueSetStage.has(item)) {
//       uniqueSetStage.add(item);
//       uniqueDataStage.push(item);
//     }
//   }
//   const handleChange = (event) => {
//     setCategoryItem(event.target.value);
//     setStageItem(event.target.value);
//   };

//   const convertApiDataToChartData = (data) => {
//     const runningCount = data.filter(
//       (item) => item.task_status === "Running"
//     ).length;
//     const overDueCount = data.filter(
//       (item) => item.task_status === "Over Due"
//     ).length;
//     const closeCount = data.filter(
//       (item) => item.task_status === "Close"
//     ).length;
//     const chartdataConvert = [
//       ["Task", "Hours per Day"],
//       ["Running", runningCount],
//       ["OverDue", overDueCount],
//       ["Close", closeCount],
//     ];

//     return chartdataConvert;
//   };
//   const chartDataConvert = convertApiDataToChartData(chartData);

//   useEffect(()=>{
//     axios
//     .get(`http://193.194.195.101:8010/api/report/gettaskstatus`)
//     .then((res) => {
//       const ress = res?.data?.data
//       console.log("resss",ress);
//       const secondres = ress?.filter((x=>(x.task)))
//       console.log("secondres",secondres);
//       setChartData(res?.data?.data);

//     });
//   },[selectedTasks])

//   // const getChartData = () => {
//   //   axios
//   //     .get(`http://193.194.195.101:8010/api/report/gettaskstatus?task=${selectedTasks}`)
//   //     .then((res) => {
//   //       setChartData(res?.data?.data);
//   //     });
//   // };

//   // useEffect(() => {
//   //   getChartData();
//   // }, [selectedTasks]);

//   const handleChartClick = (event, chart) => {
//     // This function will be called when the chart is clicked
//     // You can perform any action you want here
//   };

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "category", //access nested data with dot notation
//         header: "Category",
//         size: 150,
//       },
//       {
//         accessorKey: "task",
//         header: "Task",
//         size: 150,
//       },
//       {
//         accessorKey: "taskstart", //normal accessorKey
//         header: "Task Start Date",
//         size: 200,
//         accessorFn: (row) => (
//             <div>{row.taskstart.split('T')[0]}</div>
//         ),
//       },
//       {
//         accessorKey: "stage",
//         header: "Current Stage",
//         size: 150,
//       },
//       {
//         accessorKey: "startdate",
//         header: "Stask Start date",
//         size: 150,
//         accessorFn: (row) => (
//           <div>{row.taskstart.split('T')[0]}</div>
//       ),
//       },
//       {
//         accessorKey: "dueDate",
//         header: "Exp Date",
//         size: 150,
//         accessorFn: (row) => (
//           <div>{row.taskstart.split('T')[0]}</div>
//       ),
//       },
//       {
//         accessorKey: "over_due",
//         header: "Over Due",
//         size: 150,
//       },
//       {
//         accessorKey: "enddate",
//         header: "End Date",
//         size: 150,
//         accessorFn: (row) => (
//           <div>{row.taskstart.split('T')[0]}</div>
//       ),
//       },
//     ],
//     []
//   );

 
//   return (
//     <>
//     <div style={{display:'flex'}}>
//       <div>
//       <Chart
//         chartType="PieChart"
//         data={chartDataConvert}
//         options={options}
//         width={"100%"}
//         height={"400px"}
//         chartEvents = {[
//           {
//             eventName: "select",
//             callback({ chartWrapper }) {
//               console.log("Selected ", chartWrapper.getChart().getSelection());
//             }
//           }
//         ]}
//       />
//       </div>
//       <div>
//        <SecondPieChart/>
//       </div>
//     </div>
//       {/* dropDown */}
//       <AgGridReact
//           rowData={chartData}
//           columnDefs={columns}
//           // defaultColDef={defaultColDef}
//           // onGridReady={onGridReady}
//         />
//     </>
//   );
// };
// export default PieChart;
