import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../layout/Layout';
import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Stack,
  Heading,
  TextStyle,
  FormLayout,
  Layout,
  TextContainer,
  Icon,
} from '@shopify/polaris';
import Switch from 'react-switch';
import { CircleLeftMajor } from '@shopify/polaris-icons';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { data } from 'jquery';
import PreviewEmail from './PreviewEmail';
import { gql } from '@apollo/client';

const emailNotificationsDetails = (props) => {
  const codeTextArea = useRef(null);
  const [valueFromName, setValueFromName] = useState();
  const [showEditorCode, setShowEditorCode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewActive, setPreviewActive] = useState(false);
  const handleChangeFormName = useCallback(
    (newValue) => setValueFromName(newValue),
    []
  );
  const [selectedSettingEnabled, setSelectedSettingEnabled] = useState(false);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const handleSelectChangeSettingEnabled = useCallback(
    (value) => setSelectedSettingEnabled(value),
    []
  );

  const html_text = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <title><!-- Insert your title here --></title>
  </head>
  <body>
      <!-- Insert your content here -->
  </body>
  </html>`;

  const {
    values,
    touched,
    errors,
    setFieldValue,
    index,
    setSelectedIndex,
    handleSubmit,
    setUpdateSetting
  } = props;

  useEffect(() => {
    setUpdateSetting(gql`
      mutation ($input: UpdateSettingInput!) {
        updateSetting(input: $input) {
          setting {
            emailNotifications {
              name
              status
              fromName
              fromEmail
              emailSubject
              emailMessage
              slug
              description
            }
          }
        }
      }
    `)
  }, []);

  const submit = async () => {
    await handleSubmit();
    setSelectedIndex(null);
  };
  useEffect(() => {
    const contentBlock = htmlToDraft(
      values.emailNotifications[index]?.emailMessage || ''
    );
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  const toggleEditorCode = () => {
    if (showEditorCode) {
      const contentBlock = htmlToDraft(
        values.emailNotifications[index]?.emailMessage || ''
      );
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
    setShowEditorCode(!showEditorCode);
  };

  const ShowEditorCode = () => (
    <div className="rdw-option-wrapper" onClick={toggleEditorCode}>
      {'</>'}
    </div>
  );

  const uploadCallback = (file, callback) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      console.log(reader);
      reader.onloadend = async () => {
        const form_data = new FormData();
        form_data.append("file", file);
        let res = await uploadFile(form_data);
        console.log("image_url", res)
        // setValue("thumbnail", res);
        resolve({ data: { link: res } });
      };
      reader.readAsDataURL(file);
    });
  };
  const config = {
    image: { uploadCallback: uploadCallback, defaultSize: { height: 'auto', width: '100%' } }
  }

  const uploadFile = async (formData) => {
    let imageURL;
    await fetch("/email_images/upload_email_image", {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        imageURL = data?.image_url
        console.log("dataimg", imageURL, data.image_url)
      })
    return imageURL

  }

  function customChunkRenderer(nodeName, node) {
    const allowedNodes = [
      "div",
      "table",
      "tbody",
      "tr",
      "th",
      "td",
      "thead",
      "style"
    ];

    if (allowedNodes.includes(nodeName)) {
      return {
        type: nodeName.toString().toUpperCase(),
        mutability: "MUTABLE",
        data: {
          // Pass whatever you want here (like id, or classList, etc.)
          innerText: node.innerText,
          innerHTML: node.innerHTML
        }
      };
    }
    return null;
  }

  function entityMapper(entity) {
    console.log("entity.data.style", entity);

    if (entity.type === "DIV") {
      return `<div style=${entity.data.style}>${entity.data.innerHTML}</div>`;
    }
    if (entity.type === "TABLE") {
      return `<table style=${entity.data.style}>${entity.data.innerHTML}</table>`;
    }
    if (entity.type === "TBODY") {
      return `<tbody style=${entity.data.style}>${entity.data.innerHTML}</tbody>`;
    }
    if (entity.type === "TR") {
      return `<tr style=${entity.data.style}>${entity.data.innerHTML}</tr>`;
    }
    if (entity.type === "TH") {
      return `<th style=${entity.data.style}>${entity.data.innerHTML}</th>`;
    }
    if (entity.type === "TD") {
      return `<td style=${entity.data.style}>${entity.data.innerHTML}</td>`;
    }
    if (entity.type === "STYLE") {
      return `<style>${entity.data.innerHTML}</style>`;
    }
    return "";
  }

  function entityMapperToComponent(entity) {
    console.log("style", entity?.data.style);

    if (entity.type === "DIV") {
      return () => (
        <div dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "TABLE") {
      return () => (
        <table dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "TBODY") {
      return (
        <tbody dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "TR") {
      return () => (
        <tr dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "TH") {
      return () => (
        <th dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "TD") {
      return () => (
        <td dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />
      );
    }
    if (entity.type === "STYLE") {
      return () => <style>{entity.data.innerHTML}</style>;
    }

    return "";
  }

  function customBlockRenderFunc(block, config) {
    console.log("block", block);
    console.log("config", config);
    if (block.getType() === "atomic") {
      const contentState = config.getEditorState().getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      console.log("contentState", entity);

      return {
        component: entityMapperToComponent(entity)
      };
    }
    return undefined;
  }

  return (
    <div className="noti-detail">
      <div className="container-left">
        <PreviewEmail previewActive={previewActive} setPreviewActive={setPreviewActive} previewHtml={previewHtml} />
        <Card.Section>
          <Stack vertical>
            <Stack.Item>
              <div
                className="back-btn-container"
                onClick={() => setSelectedIndex(null)}
              >
                <Icon source={CircleLeftMajor} color="base" />
                <p>Go Back</p>
              </div>
            </Stack.Item>
            <Stack.Item>
              <Heading>{values.emailNotifications[index]?.name}</Heading>
            </Stack.Item>
            <Stack.Item>
              <TextStyle variation="subdued">
                {values.emailNotifications[index]?.description}
              </TextStyle>
            </Stack.Item>
            <Stack.Item>
              <Heading h4>Email Content</Heading>
            </Stack.Item>
            <Stack.Item>
              <FormLayout>
                <TextField
                  label="From Name"
                  value={
                    values.emailNotifications[index]?.fromName
                      ? values.emailNotifications[index]?.fromName
                      : ''
                  }
                  onChange={(e) =>
                    setFieldValue(`emailNotifications[${index}].fromName`, e)
                  }
                  name="from_name"
                />
                <TextField
                  label="From Email"
                  value={
                    values.emailNotifications[index]?.fromEmail
                      ? values.emailNotifications[index]?.fromEmail
                      : null
                  }
                  onChange={(e) =>
                    setFieldValue(`emailNotifications[${index}].fromEmail`, e)
                  }
                  inputMode="email"
                  name="from_email"
                />
                <TextField
                  label="Email Subject"
                  value={
                    values.emailNotifications[index]?.emailSubject
                      ? values.emailNotifications[index]?.emailSubject
                      : null
                  }
                  onChange={(e) =>
                    setFieldValue(
                      `emailNotifications[${index}].emailSubject`,
                      e
                    )
                  }
                  name="email_subject"
                />

                <label>Email Message</label>
                <Editor
                  toolbar={config}
                  editorState={editorState}
                  defaultContentState={
                    values.emailNotifications[index]?.emailMessage
                  }
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="draftEditorWrapper"
                  editorClassName={showEditorCode ? 'editorHide' : 'editor'}
                  customBlockRenderFunc={customBlockRenderFunc}
                  onEditorStateChange={(e) => {
                    setEditorState(e);
                    setFieldValue(
                      `emailNotifications[${index}].emailMessage`,
                      draftToHtml(convertToRaw(e.getCurrentContent()))
                    );
                  }}
                  toolbarCustomButtons={[<ShowEditorCode />]}
                  multiline={15}
                />
                {showEditorCode && (
                  <textarea
                    ref={codeTextArea}
                    value={values.emailNotifications[index]?.emailMessage}
                    style={{
                      width: '100%',
                      border: 'none',
                      height: '10rem',
                    }}
                    onChange={(e) => {
                      setFieldValue(
                        `emailNotifications[${index}].emailMessage`,
                        e.target.value
                      );
                    }}
                  />
                )}

                {/* <TextField
                  label="Email Message"
                  placeholder={html_text}
                  value={values.emailNotifications[index]?.emailMessage}
                  onChange={(e) =>
                    setFieldValue(
                      `emailNotifications[${index}].emailMessage`,
                      e
                    )
                  }
                  multiline={15}
                  name="email_message"
                /> */}
              </FormLayout>
            </Stack.Item>
            <Stack.Item>
              <ButtonGroup>
                <Button primary onClick={() => setSelectedIndex(null)}>
                  Cancel
                </Button>
                <Button onClick={() => submit()}>Save Changes</Button>
              </ButtonGroup>
            </Stack.Item>
          </Stack>
        </Card.Section>
      </div>
      <div className="container-right">
        <Card.Section>
          <TextContainer>
            <Heading h4>Status</Heading>
            <Stack distribution="equalSpacing">
              {/* <Button primary>Enabled</Button> */}
              {values.emailNotifications[index]?.status ? (
                <Button primary onClick={() => { }}>
                  Enabled
                </Button>
              ) : (
                <Button onClick={() => { }}>Disabled</Button>
              )}
              <Switch
                // onChange={setFieldValue(
                //   `emailNotifications[${values.emailNotifications[index]}].status`,
                //   !values.emailNotifications[index]?.status
                // )}
                checked={values.emailNotifications[index]?.status}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              />
            </Stack>
            <br />
            <TextStyle variation="subdued">
              This notification is enabled and will be sent to customers when
              conditions apply.
            </TextStyle>
          </TextContainer>
        </Card.Section>

        {process.env.APP_TYPE == 'public' && (
          <Card.Section>
            <TextContainer>
              <Heading h4>Need help with ChargeZen variables?</Heading>
              <br />
              <TextStyle variation="subdued">
                We’ve compiled a list of all available CharegeZen variables
                along with additional information and help. You can check out
                the guide here.
              </TextStyle>
            </TextContainer>
          </Card.Section>
        )}

        <Card.Section>
          <TextContainer>
            <Heading h4>Actions</Heading>
            <Button fullWidth>Send a test email</Button>
            <Button fullWidth
              onClick={() => {
                setPreviewHtml(values.emailNotifications[index]?.emailMessage)
                setPreviewActive(true)
              }
              }
            >
              Preview
            </Button>
          </TextContainer>
        </Card.Section>
      </div>
    </div>
  );
};
export default emailNotificationsDetails;
