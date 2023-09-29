/* eslint-disable */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const SecondPieChart = () => {
  const [secondChartData, setSecondChartData] = useState([]);
  const [selectData, setSelectData] = React.useState("");
 
  const stageData = secondChartData?.map((x) => x?.stage);
  const uniqueData = [...new Set(stageData)];

  const convertApiDataToChartData = (data) => {
    const runningCount = data.filter(
      (item) => item.department === "SUNRISE"
    ).length;
    const overDueCount = data.filter(
      (item) => item.department === "BRAINWAVES"
    ).length;
    const chartdataConvert = [
      ["Task", "OVERDUE","ON TIME"],
      ["SUNRISE", runningCount, 10],
      ["BRAINWAVES", overDueCount,2],
    ];
    return chartdataConvert;
  };

  const chartDataConvert = convertApiDataToChartData(secondChartData);

  useEffect(() => {
    axios
      .get(`http://193.194.195.101:8010/api/report/gettaskstatus`)
      .then((res) => {
        setSecondChartData(res?.data?.data);
      });
  }, []);

  // api/report/gettaskstatus?category&stage&task&task_Status
  // useEffect(() => {
  //   axios
  //     .get(
  //       `http://192.168.1.186:8010/api/report/gettaskstatus?stage=${uniqueData}`
  //     )
  //     .then((res) => {
  //       console.log("res00", res);
  //       // setSecondChartData(res?.data?.data);
  //     });
  // }, [selectData]);

  const options = {
    chart: {
      title: "Company Departments",
      subtitle: "",
    },
  };
  return (
    <div>
      <Chart
        chartType="Bar"
        width="80%"
        height="400px"
        data={chartDataConvert}
        options={options}
      />
    </div>
  );
};

export default SecondPieChart;
