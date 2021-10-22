import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../layout/Layout';
import { ClipboardMinor } from '@shopify/polaris-icons';
import Footer from '../layout/Footer';
import CodeSnippet from '../common/CodeSnippet';
import ThemeLink from '../common/ThemeLink';

import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Stack,
  Page,
  Heading,
  TextContainer,
  Layout,
  FormLayout
} from '@shopify/polaris';

import {
  Form,
  ContextualSaveBar,
  Toast,
  Banner,
  List,
  Spinner,
  Frame
} from '@shopify/polaris';

import _, { isEmpty } from 'lodash';
import * as yup from 'yup';

import { gql, useMutation, useQuery,useLazyQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

const Installation = ({shopifyDomain, passwordProtected}) => {
  const confirmPasswordQuery=gql`
  query($password:String!)
    {
      confirmPassword(password:$password) {
              success
    }
  }
  `;
  // data form ##
  const [themes, setThemes] = useState(null);
  const GET_DATA = gql`
    query {
      fetchThemes {
        id
        name
        role
      }
    }
  `;
  let { id } = useParams();
  const { data, loading, error } = useQuery(GET_DATA, { fetchPolicy: "no-cache" });

  const ADD_INSTALLATION = gql`
    mutation($input: AddInstallationInput!) {
      addInstallation(input: $input) {
        theme
      }
    }
  `;
  const [addInstallation] = useMutation(ADD_INSTALLATION);

  useEffect(() => {
    if (data) {
      const themesData = data.fetchThemes.map((item) => (
        {
          label: `${item.name}(${item.role})`,
          value: item.id
        }
      ))

      setSelectedTheme(data.fetchThemes.filter((item) => item.role == 'main')[0].id)
      setThemes(themesData);
    }
  }, [data]);

  const handleInstallation = (widget) => {
    setLoadingAction(widget)

    addInstallation({ variables: { input: { params: { widget: widget, theme: selectedTheme } } } })
      .then((resp) => {
        setLoadingAction(null);
        setSaveSuccess(true);
      })
      .catch((error) => {
        setLoadingAction(null);
      });
  }
  const addExtension = () => {
    const url = `https://${shopifyDomain}/admin/themes/${selectedTheme}/editor?context=apps&template=product&activateAppId=f1ee8f54-2fff-44b7-86f2-22e5d6e9aa88/chargezen-main`
    window.open(url, '_blank').focus()
  }

  const content_4b = ` <select name="id" ...>...</select> `;
  const content_5 = ` {% assign property_size = ... %} `;

  const [selectedTheme, setSelectedTheme] = useState(0);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleSelectChangeThemes = useCallback(
    (value) => setSelectedTheme(value),
    []
  );
  const [selectedSellingPlan, setSelectedSellingPlan] = useState(0);

  const handleSelectChangeSellingPlan = useCallback(
    (value) => setSelectedSellingPlan(value),
    []
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
  const [passwordConfirmed, setPasswordConfirmed] = useState(!passwordProtected)
  const [password, setPassword] = useState("")
  const [passwordError,setPasswordError]=useState("")
  const [confirmPassword,{data:confirmPasswordRes,loading:passwordLoading}]=useLazyQuery(confirmPasswordQuery,{fetchPolicy:"network-only"})

  const verifyPassword =()=>{
    if(!isEmpty(password)){
      confirmPassword({
        variables:{
          password:password
        }
      })
    }
  }

  useEffect(()=>{
      if(confirmPasswordRes?.confirmPassword?.success)
      {
        setPasswordConfirmed(true);
      }else{
        setPasswordError(confirmPasswordRes?.errors[0]?.message)
      }
  },[confirmPasswordRes])

  return (
    <AppLayout typePage="Installation" tabIndex='4'>
      <Frame>
        { passwordConfirmed
          ? (
            <Page title="Installation instructions">
              {saveSuccess && (
                <Toast
                  content="Snippets has been installed successfully!"
                  onDismiss={hideSaveSuccess}
                />
              )}
              <Stack vertical>
                <Banner status="info">
                  <p>
                    Installing our snippets will require you to edit Liquid templates,
                    and may require help of a developer. If you have any questions,
                    please reach out to our team.
                  </p>
                </Banner>
                <Card.Section>
                  <TextContainer>
                    <Heading>1. Select your theme</Heading>

                    <p>Select theme to install snippets in:</p>
                    {loading && <Spinner accessibilityLabel="Spinner example" size="small" color="teal" />}
                    {themes && <Select
                      options={themes}
                      onChange={handleSelectChangeThemes}
                      value={selectedTheme}
                    ></Select>
                    }
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>2. Enable theme app extensions</Heading>

                    <p>Enable ChargeZen-main app extensions in the selected theme:</p>
                    <ButtonGroup>
                      <Button loading={loadingAction == 'install'} primary onClick={addExtension}>
                        Enable ChargeZen-main App extension
                      </Button>
                    </ButtonGroup>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>3. Enable plan selector theme app extension</Heading>

                    <p>
                      Our subscription plan selector has 3 different designs, enable one of 3 depending on the design you want for your product page. You can use different designs; but they will be on different product templates.
                    </p>

                    {/* <CodeSnippet code={`{% render 'chargezen-main' %}`} /> */}

                    <Button loading={loadingAction == 'add_to_theme'} primary onClick={addExtension}>
                      Enable plan selector
                    </Button>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>
                      4. Enable Build-a-box theme app extension
                    </Heading>

                    <p>
                      This enables the build-a-box feature that displays on the product page. YOu will have to create a theme template called "build_a_box" and assign it to the box subscription page.
                    </p>

                    {/* <CodeSnippet code={`{% render 'chargezen-plan-selector', product: product %}`} /> */}

                    <Button loading={loadingAction == 'add_to_product'} primary onClick={addExtension}>
                      Enable build-a-box
                    </Button>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>5. Add selling plan label to the cart</Heading>
                    <Banner>
                      <p>
                        Since November 2020, Shopify requires theme developers to
                        support selling plans in the cart out of the box. If you can
                        already see selling plans in your cart, you can skip this
                        step.
                      </p>
                    </Banner>
                    <Banner status="warning">
                      <p>
                        AJAX (drawer and popup) carts may be implemented in many
                        different ways by different themes. In our custom snippet, we
                        can only provide support for static (full-page) carts. To
                        display selling plans in an AJAX cart, contact your theme
                        developer.
                      </p>
                    </Banner>
                    <p>
                      Localize your cart template, usually it's either{' '}
                      <ThemeLink id={selectedTheme} path="sections/cart-template.liquid">
                        Sections/cart-template.liquid
                      </ThemeLink>{' '}
                      or{' '}
                      <ThemeLink id={selectedTheme} path="templates/cart.liquid">
                        Templates/cart.liquid
                      </ThemeLink>

                      . Put the following snippet wherever you want to display the
                      selected selling plan. If not sure, paste it BEFORE the{' '}
                      {content_5}
                      block:
                    </p>

                    {/* <CodeSnippet code={`{% render 'chargezen-subscriptions-cart-selling-plans', item: item %}`} /> */}

                    <Button loading={loadingAction == 'add_to_cart'} primary onClick={addExtension}>
                      Install Automatically
                    </Button>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>6. Add customer portal to the account page</Heading>

                    <p>
                      Enable the customer portal theme app extension
                    </p>

                    {/* <CodeSnippet code={`{% render 'chargezen-customer-portal-frame' %}`} /> */}

                    <Button loading={loadingAction == 'add_to_account'} primary onClick={addExtension}>
                      Enable customer portal
                    </Button>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <Heading>
                      7. Add link to the customer portal in the Order Summary  Page
                    </Heading>

                    <p>
                      In order to create a link to the customer portal, paste the following script in additional script section in checkout settings; or click the button below to install it automatically.  To access additional scripts, start from your Shopify admin, and go to Settings > Checkout. Under Order processing you find the Additional scripts section.
                    </p>

                    <CodeSnippet code={`<script>Shopify.Checkout.OrderStatus.addContentBox(<a href="https://{{shop.domain}}/account" style="text-decoration-line:underline;text-decoration-style: solid;">Manage your subscriptions via the customer portal</a>)</script>`} />

                    {/* <Button loading={loadingAction == 'add_to_order_status'} primary onClick={(e) => handleInstallation('add_to_order_status')}>
                      Install Automatically
                    </Button> */}
                  </TextContainer>
                </Card.Section>
              </Stack>
            </Page>
          ) : (
            <Page title="Password protected">
              <Layout>
                <Layout.Section>
                  <Card sectioned>
                    <FormLayout>
                      <TextField
                        value={password}
                        onChange={value => setPassword(value)}
                        label="Password"
                        type="password"
                        error={passwordError && passwordError}
                      />
                      <Button primary loading={passwordLoading} onClick={verifyPassword}>Confirm</Button>
                    </FormLayout>
                  </Card>
                </Layout.Section>
              </Layout>
            </Page>
          )
        }
      </Frame>
    </AppLayout>
  );
};
export default Installation;
