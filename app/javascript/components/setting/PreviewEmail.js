import { Button, Card, Modal, TextContainer } from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import "./previewEmail.css"

function PreviewEmail({ previewActive, setPreviewActive, previewHtml }) {

    const handlePreviewChange = useCallback(() => setPreviewActive(!previewActive), [previewActive]);

    return (
        <div>
            <Modal
                open={previewActive}
                onClose={handlePreviewChange}
                title="Preview Email"
            >
                <Modal.Section>
                    <TextContainer>
                        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </div >
    );
}


export default PreviewEmail;