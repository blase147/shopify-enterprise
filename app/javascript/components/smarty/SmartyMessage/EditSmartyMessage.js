import React from 'react'

const EditSmartyMessage = ({id,handleClose}) => {
    return (
        <div>
            Edit Smarty SMS of id {id}
            <br/>
            <button onClick={()=>handleClose()} >Back</button>
        </div>
    )
}

export default EditSmartyMessage
