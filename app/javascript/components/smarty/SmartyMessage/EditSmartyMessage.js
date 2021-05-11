import {
  Button,
  Card,
  Layout,
  Toast,
  TextField,
  Frame
} from '@shopify/polaris';
import React, { useState,useEffect,useRef,useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import { gql, useLazyQuery, useMutation } from '@apollo/client';

const EditSmartyMessage = ({id,handleClose}) => {

  const getSmartySmsQuery = gql`
  query($id:String!){
    fetchSmartyMessage(id: $id) {
       id
       title
       description
       body
       updatedAt
    }
    fetchSmartyVariables {
      id
      name
}
}`;
  const updateSmsSettings=gql`
  mutation ($input: UpdateSmartyMessageInput!) {
    updateSmartyMessage(input: $input) {
        smartyMessage {
            id
            title
            description
            body
            custom
        }
    }
}
  `

    const [saveSuccess, setSaveSuccess] = useState(false);
    const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
    const [formData,setFormData]=useState({title:"",description:"",body:""})
    const [variables,setVariables]=useState([])

    const [getSmartySms, { data }] = useLazyQuery(getSmartySmsQuery,{fetchPolicy:"no-cache"});
    const [updateSetting,{loading}]=useMutation(updateSmsSettings)
    useEffect(()=>{
      if(id){
        getSmartySms({
          variables:{id:id}
        });
      }
    },[])

    useEffect(()=>{
      if(data){
        const variables=data?.fetchSmartyVariables?.map(variable=>(variable.name));
        const {title,description,body}=data?.fetchSmartyMessage;
        setFormData({title,description,body})
        setVariables(variables);
      }
    },[data])

    const tagRef=useRef();

  const handleSubmit = () => {
    let val = tagRef.current.DOM.originalInput.value;
    let updatedval = val.split(" ").map(value => {
      if (value[4] === 'v') {
        let newL = value.substr(value.indexOf(':"') + 2);
        let newR = newL.substr(0, newL.indexOf('"'))
        return `{{${newR}}}`;
      }
      return value;
    }).join(" ")

    updateSetting({
      variables:{
        input: {
          params: {
              id:id,
              description:formData.description,
              title:formData.title,
              body:updatedval
          }
      }
      }
    }).then(res => {
      if (!res.data.errors) {
        setSaveSuccess(true);
      }
    })
  }
    return (
        <Layout>
        <Card>
          <Card.Section>
            <div className="smarty-sms">
              <p className="customize-text">Message Custom Keywords</p>
              <p className="customize-text" style={{ fontWeight: 'normal' }}>Edit the SMS message body to your own style.</p>
              <form class="">
                <div className="message-form">
                  <div class="edit-example" >
                    <div className="title-input">
                      <p>Title *</p>
                      <TextField
                          placeholder="Account Settings - Options"
                          value={formData.title}
                          readOnly={true}
                          // error={}
                          // onChange={(value) => setFormData({...formData,title}value)}
                      />
                      <div className="tick-icon">
                        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.640625 7.25964C0.677855 7.22695 1.06656 7.42788 1.1067 7.44556C1.50145 7.61915 1.88364 7.82019 2.25012 8.04752C3.19914 8.62831 3.99493 9.42829 4.57071 10.3803C5.03923 11.1605 5.39396 12.6103 6.52644 12.6103C7.06895 12.6103 7.68558 12.6279 8.0979 12.214C8.6019 11.7076 8.61097 10.9684 8.76676 10.3146C9.5387 7.23091 11.0129 4.36746 13.074 1.9474C13.2006 1.79603 13.3292 1.64618 13.4595 1.49796C13.7242 1.20047 14.005 0.917757 14.3006 0.650982C14.3408 0.614566 14.4103 0.53999 14.4933 0.454826C14.5693 0.377342 14.5909 0.26158 14.548 0.161873C14.5052 0.062167 14.4063 -0.00182194 14.2977 3.95519e-05C12.5943 0.0541393 8.5414 0.945797 6.25885 7.79471C6.25885 7.79471 2.78088 5.38686 0.640625 7.25964Z" fill="#57B744"/>
                        </svg>
                      </div>

                    </div>
                    <div className="discription-input">
                      <p>Description</p>
                      <TextField
                          // placeholder="Message’s Keyword"
                          value={formData.description}
                          // error={}
                          onChange={(value) => setFormData({...formData,description:value})}
                      />
                    </div>
                  </div>
                </div>
              </form>
          </div>

          </Card.Section>
        </Card>
        
        <Card>
          <Card.Section>
            <p className="variable-text">Variables</p>
            <div className="variable-section">
              <div className="variables">
                <p>A set of custom variables is provided to make your message more personal and informative for your customers. 
                  To use variables is quite simple, you need to select from the available variables set and include it to your 
                  message body using double brackets: <span style={{color:"red"}}>{'{{variable_goes_here}}'} </span>.
                </p>

                <div className="available-variables">
                  <p className="">Available variables</p>
                  {
                    data && data?.fetchSmartyVariables?.map(variable=>(
                      <button>{variable.name}</button>
                    ))
                  }
                </div>
              </div>
              <div className="var-auto-complition">
                <Tags
                  tagifyRef={tagRef}
                  InputMode="textarea"
                  settings={{
                    mixTagsInterpolator: ["{{", "}}"],
                    mode: "mix",
                    pattern: /@/,
                    dropdown: {
                      enabled: true,
                      fuzzySearch: true,
                      position:"text"
                    },
                     enforceWhitelist: true,
                  }}
                  whitelist={variables}
                  value={formData.body}
                  placeholder="add variables"
                />
                <p>Type @ to have the variables auto-completion.</p>

              </div>
            </div>
          </Card.Section>
          <Button onClick={handleClose}>Cancel</Button>
          <Button primary loading={loading} onClick={handleSubmit} >Update</Button>
        </Card>
        <Frame>
          {saveSuccess && (
            <Toast
              content="Setting is saved"
              onDismiss={hideSaveSuccess}
            />
          )}
        </Frame>
      </Layout>
    )
}

export default EditSmartyMessage
