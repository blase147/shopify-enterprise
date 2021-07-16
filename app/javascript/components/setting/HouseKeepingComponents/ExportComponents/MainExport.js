import { Layout, Stack } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import Export from './Export'
import ExportForm from './ExportForm'

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
          <Stack>
            <Stack.Item>
              <p className="pointer" onClick={handleBack}>
                {'< Back'}
              </p>
            </Stack.Item>
          </Stack>
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
