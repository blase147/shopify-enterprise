/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */
import {
  extend,
  render,
  useExtensionInput,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Layout,
  TextBlock,
  TextContainer,
  View,
} from '@shopify/post-purchase-ui-extensions-react';
/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
extend('Checkout::PostPurchase::ShouldRender', async (args) => {
  debugger;
  const storage = args.storage;
  const initialState = await getRenderData();
  const render = true;

  if (render) {
    // Saves initial state, provided to `Render` via `storage.initialData`
    await storage.update(initialState);
  }
  return {
    render,
  };
});
// Simulate results of network call, etc.
async function getRenderData() {
  return {
    couldBe: 'anything',
    redirect_url: 'https://hitched-staging.myshopify.com/a/chargezen/dashboard/build_a_box?customer=5879558340774&subscription_id=1964736678&active_subscriptions_count=2&selling_plan_id=631996582'
  };
}
/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render('Checkout::PostPurchase::Render', () => <App />);
// Top-level React component
export function App() {
  const { extensionPoint, storage } = useExtensionInput();
  const initialState = storage.initialData;
  debugger
  return (
    <BlockStack spacing="loose">
      <CalloutBanner title="Post-purchase template">
        Use this template as a starting point to build a great post-purchase
        extension.
      </CalloutBanner>
      <Layout
        maxInlineSize={0.95}
        media={[
          { viewportSize: 'small', sizes: [1, 30, 1] },
          { viewportSize: 'medium', sizes: [300, 30, 0.5] },
          { viewportSize: 'large', sizes: [400, 30, 0.33] },
        ]}
      >
        <View>
          <Image source="https://cdn.shopify.com/static/images/examples/img-placeholder-1120x1120.png" />
        </View>
        <View />
        <BlockStack spacing="xloose">
          <TextContainer>
            <Heading>Post-purchase extension</Heading>
            <TextBlock>
              Here you can cross-sell other products, request a product review
              based on a previous purchase, and much more.
            </TextBlock>
          </TextContainer>
          <Button
            submit
            onPress={() => {
              // eslint-disable-next-line no-console
              console.log(`Extension point ${extensionPoint}`, initialState);
            }}
          >
            Primary button
          </Button>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}
