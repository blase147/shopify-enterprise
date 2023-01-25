import { Banner, Button, CalloutCard, Card, Frame, Layout, List, Page, Toast } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import "./style.css"
import previewImage from "../../images/previewImage.svg"
import SelectRewardTypeModal from "./SelectRewardTypeModal";
import ReferralsForm from "./ReferralsForm";

const Referrals = () => {
    const [modalActive, setmodalActive] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
    const [formData, setFormData] = useState(
        { id: '', reward_type: null, reward_value: "1", applies_to_collection: null, minimum_purchased_amount: null, discount_code_prefix: null, reward_expiry: null, reward_for: '' }
    );
    const handleModalChange = useCallback(() => setmodalActive(!modalActive), [modalActive]);

    useEffect(() => {
        formData?.reward_type && (
            setEditForm(true)
        )
    }, [formData])

    return (
        <>
            <Frame>
                {saveSuccess && (
                    <Toast
                        content="Referral Reward is saved successfully"
                        onDismiss={hideSaveSuccess}
                    />
                )}
                {formErrors.length > 0 && (
                    <>
                        <Banner
                            title="Referral Reward could not be saved"
                            status="critical"
                        >
                            <List type="bullet">
                                {formErrors.map((message, index) => (
                                    <List.Item key={index}>{message.message}</List.Item>
                                ))}
                            </List>
                        </Banner>
                        <br />
                    </>
                )}
                {
                    editForm ?
                        <ReferralsForm
                            setFormData={setFormData}
                            formData={formData}
                            setEditForm={setEditForm}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            saveSuccess={saveSuccess}
                            setSaveSuccess={setSaveSuccess}
                        />
                        :
                        <>
                            <SelectRewardTypeModal modalActive={modalActive} handleModalChange={handleModalChange} setFormData={setFormData} formData={formData} />
                            <Page>
                                <Layout>
                                    <Layout.AnnotatedSection
                                        id="refferal rewards"
                                        title={<div>Referral rewards</div>}
                                        description={<>
                                            <p className="description1">
                                                Reward your existing customers for referring their friends and encouraging them to try out your brand.
                                            </p>
                                            <p className="description2">
                                                The existing customer gets their reward once the friend makes their first order. Learn more about referrals from a customer perspective.
                                            </p>
                                        </>}
                                    >
                                        <Card
                                            title={<div className="bold_uppercase_heading">REFERRING CUSTOMER REWARD</div>}
                                        >
                                            <Card.Section>
                                                <div className="flex justify-between">
                                                    <div class="add-reward-details">
                                                        <div class="add-reward-text">
                                                            Add a reward for customers who refer their friends.
                                                        </div>
                                                    </div>
                                                    <div class="add-reward-cta">
                                                        <Button primary onClick={() => handleModalChange()}>Add reward</Button>
                                                    </div>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                        <Card
                                            title={<div className="bold_uppercase_heading">REFERRED FRIEND REWARD</div>}
                                        >
                                            <Card.Section>
                                                <div className="flex justify-between">
                                                    <div class="add-reward-details">
                                                        <div class="add-reward-text">
                                                            Add a reward for referred friends.
                                                        </div>
                                                    </div>
                                                    <div class="add-reward-cta">
                                                        <Button primary onClick={() => handleModalChange()}>Add reward</Button>
                                                    </div>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                    </Layout.AnnotatedSection>

                                    <Layout.AnnotatedSection
                                        id="refferal rewards"
                                        title={<div className="bold_uppercase_heading">Referral Nudge</div>}
                                        description={<>
                                            <p className="description1">
                                                Let guests refer their friends after placing an order. Learn more about guest referrals.
                                            </p>
                                        </>}
                                    >
                                        <Card
                                            title={<div className="bold_uppercase_heading">Guest referral Nudge</div>}
                                        >
                                            <Card.Section>
                                                <div className="flex justify-between">
                                                    <div class="add-reward-details">
                                                        <div class="add-reward-text">
                                                            This message appears on the order confirmation page and shows guests their referral link.
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                    </Layout.AnnotatedSection>

                                    <Layout.AnnotatedSection
                                        id="refferal rewards"
                                        title={<div>Social sharing</div>}
                                        description={<>
                                            <p className="description1">
                                                Let customers share their referral links on social platforms directly from the Smile Panel. Learn more about sharing options.
                                            </p>
                                        </>}
                                    >
                                        <Card
                                            title={<div className="bold_uppercase_heading">Social settings</div>}
                                        >
                                            <Card.Section>
                                                <div className="flex justify-between">
                                                    <div class="add-reward-details">
                                                        <div class="add-reward-text">
                                                            Customers can share their referrals directly from the Smile Panel via <b>Facebook</b>, <b>Twitter</b>, and <b>Email</b>.
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                        <CalloutCard
                                            title="Customize referral link preview"
                                            illustration={previewImage}
                                            primaryAction={{
                                                content: 'Upgrade',
                                            }}
                                        >
                                            <p>Customize the way your store's website appears in shared tweets and posts by defining your store's referral metadata. Learn more.</p>
                                        </CalloutCard>
                                    </Layout.AnnotatedSection>

                                    <Layout.AnnotatedSection
                                        id="refferal rewards"
                                        title={<div>Social sharing</div>}
                                        description={<>
                                            <p className="description1">
                                                Let customers share their referral links on social platforms directly from the Smile Panel. Learn more about sharing options.
                                            </p>
                                        </>}
                                    >
                                        <Card
                                            title={<div className="bold_uppercase_heading">Social settings</div>}
                                        >
                                            <Card.Section>
                                                <div className="flex justify-between">
                                                    <div class="add-reward-details">
                                                        <div class="add-reward-text">
                                                            Customers can share their referrals directly from the Smile Panel via <b>Facebook</b>, <b>Twitter</b>, and <b>Email</b>.
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Section>
                                        </Card>
                                        <CalloutCard
                                            title="Customize referral link preview"
                                            illustration={previewImage}
                                            primaryAction={{
                                                content: 'Upgrade',
                                            }}
                                        >
                                            <p>Customize the way your store's website appears in shared tweets and posts by defining your store's referral metadata. Learn more.</p>
                                        </CalloutCard>
                                    </Layout.AnnotatedSection>
                                </Layout>
                            </Page>
                        </>
                }
            </Frame>

        </>
    )
}

export default Referrals;