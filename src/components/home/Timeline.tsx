import ReactCalendarTimeline from "react-calendar-timeline";
import moment from "moment";
import { useState } from "react";



const Timeline = () => {
  const [items] = useState(JSON.parse(
    localStorage.getItem("items") || "[]"
  ))
  const groups = JSON.parse(
    localStorage.getItem("groups") || "[]"
  )
  

 
  console.log("Items: ",items);
  return (
    <div >
    <div className="relative z-0">
      <ReactCalendarTimeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
        lineHeight={90}
        itemHeightRatio={0.87}
        
      />
    </div>
  </div>
  );
};

export default Timeline;
