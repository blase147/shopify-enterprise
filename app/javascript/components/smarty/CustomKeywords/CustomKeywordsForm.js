import React ,{useEffect,useState,useCallback,useRef} from 'react';
import {Checkbox,DisplayText,ButtonGroup,TextField, Button, Stack, Card, Layout, Subheading} from '@shopify/polaris';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import {gql,useLazyQuery,useMutation} from '@apollo/client';
import { isEmpty } from 'lodash';

const CustomKeywordsForm = ({id,handleClose}) => {

    const fetchQuery=gql`
    query($id:String!){
        fetchCustomKeyword(id: $id) {
            id
            response
            keywords
            status
    }
    }
    `;

    const addQuery=gql`
    mutation ($input: AddCustomKeywordInput!) {
        addCustomKeyword(input: $input) {
            customKeyword {
                id
                response
                keywords
                status
            }
        }
    }
    `;

    const updateQuery=gql`
    mutation ($input: UpdateCustomKeywordInput!) {
        updateCustomKeyword(input: $input) {
            customKeyword {
                id
                response
                status
                keywords
            }
        }
    }
    `;
    const tagRef=useRef();
    const [errors,setErrors]=useState({})
    const [formData,setFormData]=useState({response:"",keywords:[],status:'inactive'});
    const [getSingleKeyword,{data}]=useLazyQuery(fetchQuery,{fetchPolicy:"cache-and-network"})
    const [addKeyword,{loading:addLoading}]=useMutation(addQuery);
    const [updateKeyword,{loading:updateLoading}]=useMutation(updateQuery);

    const validate=()=>{
        
        const {response}=formData;
        const errors={};
        if(!response)
        {
            errors.response="Please enter response"
        }
        if(tagRef?.current?.value?.length<=0){
            errors.tag="Please add some tags"
        }
         setErrors(errors);
        return !isEmpty(errors) ? true : false;
}

    useEffect(()=>{
        if(id){
            getSingleKeyword({
                variables:{
                    id:id
                }
            })
        }
    },[id])

    useEffect(()=>{
        if(data){
            const {response,keywords,status}=data?.fetchCustomKeyword;
            setFormData({response,keywords,status})
        }
    },[data])

    const handleSubmit=()=>{
        const {response,status}=formData;
        const keywords=tagRef.current.value?.map(val=>val.value);
        if(!validate()){
        if(id){
            updateKeyword({
                variables:{
                    input:{
                        params:{
                            id:id,
                            keywords:keywords,
                            response:response,
                            status:status
                        }
                    }
                }
            })
        }else{
            addKeyword({
                variables:{
                    input:{
                        params:{
                            response:response,
                            keywords:keywords,
                            status:status
                        }
                    }
                }
            })
        }
    }
    }
    return (
        <React.Fragment>
        <Layout>
        <Layout.Section>
        <DisplayText size="large">
        Edit Custom Keywords(s)
        </DisplayText>
        <Subheading>
        Update message custom keyword's data.
        </Subheading>
        </Layout.Section>
          <Layout.Section>
          <Card>
            <Card.Section >
              <Layout>
                <Layout.Section>
                  <DisplayText size="small" >
                  The custom keyword(s) are going to be used for matching customer's messages into automatic responses.
                   You can add as many keywords as you want, for each new keyword you should <strong>press Enter</strong> on the Keywords field below.
                    Please don't worry about lower and upper case, this will be automatically handled by us. For example,
                     you can add only <strong>hello</strong> and will it be enough for matching both <strong>Hello</strong> and <strong>HELLO</strong>.
                  </DisplayText>
                </Layout.Section>
                <Layout.Section >
                <Tags 
                tagifyRef={tagRef}
                settings={{
                        duplicates:false,
                        trim:true
                    }}
                    value={formData.keywords}
                 />
                 <span style={{color:"red"}}>{errors?.tag}</span>
                </Layout.Section>
                <Layout.Section >
                <TextField error={errors?.response} multiline={3} label="response" value={formData.response} onChange={val=>setFormData({...formData,response:val})} />
                </Layout.Section>
              </Layout>
              <Checkbox label="Activate response to custom keyword(s)" checked={formData.status=='active'} onChange={val=>setFormData({...formData,status:val?'active':'inactive'})} />
           
            </Card.Section>
            <Card.Section subdued  >
            <Stack distribution="trailing">
          <ButtonGroup>
            <Button onClick={handleClose}>Cancel</Button>
            <Button primary onClick={handleSubmit} loading={addLoading || updateLoading}>Save</Button>
            </ButtonGroup>
          </Stack>
            </Card.Section>
          </Card>
          </Layout.Section>
        </Layout>
      </React.Fragment>
    )
}

export default CustomKeywordsForm
