import React, { useRef, useState } from "react";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const BankDetail = ({ setFormField, formField }) => {
    const codeTextArea = useRef(null);
    const [showEditorCode, setShowEditorCode] = useState(false);
    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty()
    );
    const ShowEditorCode = () => (
        <div className="rdw-option-wrapper" onClick={toggleEditorCode}>
            {'</>'}
        </div>
    );

    const toggleEditorCode = () => {
        if (showEditorCode) {
            const contentBlock = htmlToDraft(
                formField?.bank_detail || ''
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
    return (
        <div className="bank_detail_main_div">
            <Editor
                editorState={editorState}
                defaultContentState={formField?.bank_detail}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName={`${showEditorCode ? 'editorHide' : 'editor'} draftEditorWrapper`}
                onEditorStateChange={(e) => {
                    setEditorState(e);
                    setFormField({ ...formField, bank_detail: draftToHtml(convertToRaw(e.getCurrentContent())) })
                }}
                toolbarCustomButtons={[<ShowEditorCode />]}
                multiline={15}
            />
            {
                showEditorCode && (
                    <textarea
                        ref={codeTextArea}
                        value={formField?.bank_detail}
                        style={{
                            width: '100%',
                            border: 'none',
                            height: '10rem',
                        }}
                        onChange={(e) => {
                            setFormField({ ...formField, bank_detail: e.target.value })
                        }}
                    />
                )
            }
        </div>
    )
}

export default BankDetail;