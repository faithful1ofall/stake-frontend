import React, {useContext} from "react";
import DisplayContext from "../../context/DisplayContext";



export default function TimeLeftField() {
    const displayContext = useContext(DisplayContext);
    const {userDetails} = displayContext;


    function extractTime(part) {
      if (userDetails["daysLeft"] === undefined)
        return "";
        
      let daysLeft = userDetails["daysLeft"];
      if (part === "d")
        return Math.floor(daysLeft);
      if (part === "h")
        return Math.floor((daysLeft - Math.floor(daysLeft)) * 24);
      if (part === "m")
        return Math.floor((daysLeft - Math.floor(daysLeft) - Math.floor(daysLeft - Math.floor(daysLeft))) * 60);
      return undefined;
      }

    return (
        <>
            <div className="time-left-label">
                <div>
                Estimate End Time
                </div> 
                <div className="time"> 2022-06-30       
              </div>
            </div>
          </>
    )
}