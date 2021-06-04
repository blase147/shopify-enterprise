import React,{useEffect,useState} from 'react'
import {Button, DisplayText, Layout,Card,Spinner} from '@shopify/polaris';
import './export.css'
import { gql, useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

const Export = ({handleCreateExport,exportData}) => {

  const fetchReportLogs = gql`
  query($startDate: String!, $endDate: String!) {
    fetchReportLog (startDate: $startDate, endDate: $endDate) {
        reportLogs{
            reportType
            createdAt
            startDate
            endDate
        }
    }
}
  `;

  const [getReportLogs, { loading, data:logsData }] = useLazyQuery(fetchReportLogs,{fetchPolicy:"network-only"});

  useEffect(()=>{
      getReportLogs({
        variables:{
          startDate:"",
          endDate:""
        }
      })
  },[])

    return (
        <Layout>
        <div className="wrapper">
          <div className="button-bar">
            <Button primary onClick={handleCreateExport}>Create Export</Button>
          </div>
          {
          (loading || isEmpty(logsData)) ?
          <>
        <Card>
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
        </Card>
          </>
          :
          <>
          {
           !isEmpty(logsData) ?
            <>
            <table id="logs-table">
                <tr>
                  <th>Report Type</th>
                  <th>Created At</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
                {
                  logsData?.fetchReportLog?.reportLogs.map(item=>(
                    <tr>
                      <td>{item.reportType}</td>
                      <td>{item.createdAt}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                    </tr>
                  ))
                }
            </table>
            </>:
              <>
                
                <div className="text-wrapper">
                  <p>Create fast and robust exports from wide range of your store's data.</p>
                  <p> Displaying the most recent available exports (less than 2 hours old).</p>
                </div>
                <div className="export-wrapper button-bar">
                  <strong>No Exports</strong>
                  <p>You haven't made any exports yet. Click the "create export" button below to get started.</p>
                  <Button primary onClick={handleCreateExport}>Create Export</Button>
                </div>
              </>
          }
          </>
        }
        </div>
    </Layout>
    )
}

export default Export