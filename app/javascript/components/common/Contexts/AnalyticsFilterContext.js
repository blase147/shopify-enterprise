import React, { useState, createContext } from "react";
import dayjs from 'dayjs'
// Create Context Object
export const FilterContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const FilterContextProvider = props => {
  const [filters, setFilters] = useState({startDate:dayjs(new Date()).subtract(30,'days').format("YYYY-MM-DD"),endDate:dayjs(new Date()).format("YYYY-MM-DD")});
  const [productCharts,setProductCharts]=useState({hasData:false})

  return (
    <FilterContext.Provider value={[filters, setFilters,productCharts,setProductCharts]}>
      {props.children}
    </FilterContext.Provider>
  );
};