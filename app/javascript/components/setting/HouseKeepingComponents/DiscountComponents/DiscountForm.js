import React from 'react'

const DiscountForm = ({handleCloseForm}) => {
    return (
        <div>
           <button onClick={handleCloseForm}>back</button><br/>Discount Form here
        </div>
    )
}

export default DiscountForm
