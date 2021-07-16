import { Icon, Layout, Stack } from '@shopify/polaris'
import { isEmpty } from 'lodash'
import React, { useCallback, useState } from 'react'
import Export from './Export'
import ExportForm from './ExportForm';
import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';

const MainExport = ({handleBack}) => {

  const [showForm,setShowForm]=useState(false)
  const [exportData,setExportData]=useState(null);

  const handleShowForm=useCallback(
    () => {
     setShowForm(true)
    },
    [setShowForm]
  )
  const handleCloseForm=useCallback(
    (data,filters) => {
     setShowForm(false);
     if(!isEmpty(data) && !isEmpty(filters)){
      setExportData({data:data,filters:filters})
     }
    },
    [setShowForm]
  )

  return (
    <>
      <Layout>
      <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon
            source={MobileBackArrowMajor}
            color="base" />
        </div>
      </Layout.Section>
      </Layout>
      {showForm ? (
        <ExportForm handleCloseForm={handleCloseForm} />
      ) : (
        <Export exportData={exportData} handleCreateExport={handleShowForm} />
      )}
    </>
  );
}

export default MainExport
