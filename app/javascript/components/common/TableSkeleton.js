import React, {useMemo} from 'react'
import {
    Card,
    Layout,
    Select,
    TextField,
    SkeletonDisplayText,
    Button
  } from '@shopify/polaris';


const TableSkeleton = ({rows,cols}) => {

    const row=useMemo(()=>(
        <tr>
        {
            [...Array(cols).keys()].map(val=>(
                <td><SkeletonDisplayText size="small" /></td>
            ))
        }
        </tr>
    ),[cols])

    return (
        [...Array(rows).keys()].map(val=>(row))
    )
}

export default TableSkeleton
