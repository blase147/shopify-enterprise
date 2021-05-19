import React from 'react'
import {Button, DisplayText, Layout} from '@shopify/polaris';
import './export.css'
const Export = ({handleCreateExport}) => {
    return (
        <Layout sectioned>
        <div className="wrapper">
        <div className="button-bar">
        <Button primary onClick={handleCreateExport}>Create Export</Button>
        </div>
        <div className="text-wrapper">
        <p>Create fast and robust exports from wide range of your store's data.</p>
        <p> Displaying the most recent available exports (less than 2 hours old).</p>
        </div>
        <div className="export-wrapper">
          <strong>No Exports</strong>
          <p>You haven't made any exports yet. Click the "create export" button below to get started.</p>
          <Button primary onClick={handleCreateExport}>Create Export</Button>
        </div>
        
        </div>
    </Layout>
    )
}

export default Export