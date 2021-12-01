import React from 'react'; 
import { Icon } from "@shopify/polaris";
import {  DeleteMinor } from "@shopify/polaris-icons";

const DeleteIcon = (props) => {
  return(
      <div
      style={{
        cursor: "pointer",
        display:"flex",
        justifyContent:"end",
        alignItems:"end"
      }}
      onClick={props.removeNode}
    >
      <DeleteMinor width="20px"/> 
    </div>
  )
}
export default DeleteIcon;