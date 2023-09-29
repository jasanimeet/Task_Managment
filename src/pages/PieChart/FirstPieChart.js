import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-google-charts";
import { API_BASE_URL } from "../../config/API/api.config";
import { Box, CircularProgress } from "@mui/material";

const FirstPieChart = React.memo(({
  setChartTable, setItemData, activeChartDefault, setActiveChartDefault
}) => {
  const [chartDataCount, setChartDataCount] = useState([]);
  const [chartDataDepartment, setChartDataDepartment] = useState([]);
  const [selectData, setSelectData] = React.useState("");
  const [loaderFirst, setLoaderFirst] = React.useState(false);
  
  // https://localhost:44301/api/report/getcurrenttaskstatus
  const getChartDataCount = () => {
    setLoaderFirst(true)
    axios.get(API_BASE_URL + `/report/getcurrenttaskstatus`).then((res) => {
      setChartDataCount(res?.data?.data);
      setLoaderFirst(false)
    });
  };
  useEffect(()=>{
    getChartDataCount()
  },[])

  const getChartDataDepart = () => {
    axios
      .get(API_BASE_URL + `/report/getcurrenttaskstatus?department=${selectData}`)
      .then((res) => {
        setChartDataDepartment(res?.data?.data);
      });
  };
 
  useEffect(() => {
    getChartDataDepart();
  }, [selectData]);


  const options = {
    title: "Running Status",
    colors: ["#ffc299", "#99ffbb"],
    titleTextStyle: {
      fontSize: 15, 
      color: '#6f6f6f'
    },
  };

  const convertApiDataToChartData = (data) => {

    const closeCount = data.filter(item => item.Hold_Status === 'OverDue').length;
    const counterCount = data.filter(item => item.Hold_Status === 'ON TIME').length;

    const chartdataConvert = [["Task", "Count"],['OverDue', closeCount], ['ON TIME', counterCount]];
    // const chartdataConvert = [["Task", "Count"]];

    // const taskStatuses = [];
    // data.forEach((item) => {
    //   if (!taskStatuses.includes(item.Hold_Status)) {
    //     taskStatuses.push(item.Hold_Status);
    //   }
    // });
    // taskStatuses.forEach((status) => {
    //   // const countTask = data.filter((item) => item.original_due_days > 0);
     
    //   // const countTask = data.filter((item) => item.status === "ACTIVE");
    //   // const count = data.filter((item) => item.Hold_Status === status).length;
    //   const count = data.filter((item) => item.Hold_Status !== null && item.Hold_Status === status).length;
    //   chartdataConvert.push([status, count]);
    // });
    return chartdataConvert;
  };

  const chartDataConvert = convertApiDataToChartData(chartDataDepartment);
  const [selectedChartDatas, setSelectedChartData] = useState(null);
  const [activChart, setActivChart] = useState('');

  const handleChartSelect = ({ chartWrapper }) => {
    const chart = chartWrapper?.getChart?.();
    if (chart && chart.getSelection().length === 1) {
      const selection = chart.getSelection()[0];
      const category = chartDataConvert[selection.row + 1]?.[0];
      const value = chartDataConvert[selection.row + 1]?.[1];
      
      const isSelected = chartDataConvert[selection.row + 1]?.[3] === 1 ? 0 : 1;
      chartDataConvert[selection.row + 1][3] = isSelected;
      setActivChart([...chartDataConvert]);
      setActiveChartDefault();
      setSelectedChartData({ category, value });
      setItemData({ category, value })
    }
  };

  useEffect(() => {
    axios
      .get(
        API_BASE_URL +
          `/report/getcurrenttaskstatus?hold_Status=${selectedChartDatas?.category}`
      )
      .then((res) => {
        setChartTable(res?.data?.data)
      });
  }, [selectedChartDatas]);

  return (
    <div>
      {/* {!loaderFirst ? 
      <Box sx={{
        display: 'flex',
        // width: '100vw',
        // height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
    <CircularProgress  color="secondary" /> </Box> :  */}
    
      <div style={{ display: "flex" }}>
      {/* <div style={{ width: "29%" }}> */}
          <Chart
            chartType="PieChart"
            data={(activeChartDefault === 3  && activChart) ? activChart : chartDataConvert}
            options={options}
            width={"100%"}
            height={"250px"}
            chartEvents={[
              {
                eventName: "select",
                callback: handleChartSelect,
              },
            ]}
          />
        {/* </div> */}
        </div>
{/* } */}
    </div>
  );
});

export default FirstPieChart;
