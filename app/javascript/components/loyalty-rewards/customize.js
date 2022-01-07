import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  Select,
  Heading,
  FormLayout,
  Button,
  Icon,
  Modal,
  TextField,
  Layout,
  Page,
  Stack,
  Tabs,
  ColorPicker,
} from '@shopify/polaris';
import MainImage from "../../images/main-image.png";
import Icon1 from "../../images/icons/icon1.png";
import Icon2 from "../../images/icons/icon2.png";
import Icon3 from "../../images/icons/icon3.png";
import Icon4 from "../../images/icons/icon4.png";
import Icon5 from "../../images/icons/icon5.png";
import Icon6 from "../../images/icons/icon6.png";
import Icon7 from "../../images/icons/icon7.png";
import Icon8 from "../../images/icons/icon8.png";
import "./loyalty.css";

const Customize = () => {
    // const [color, setColor] = useState({
    //   hue: 120,
    //   brightness: 1,
    //   saturation: 1,
    // });
    
  return (
    <>
        <FormLayout>
            <Card 
                sectioned 
                primaryFooterAction={{content: 'Save and Continue'}}
                footerActionAlignment="left"
            >
                
                <div className='card-box'>
                    <h2 className='blue-title'>Customize</h2>
                    <Stack distribution="fill">
                        <TextField type="text" label="Name your loyalty program" placeholder='Subscribe and Save' autoComplete="off" helpText={<span>Internal name of the group, use to identify it in the admin</span>} />                        
                        <TextField type="text" label="Select loyalty location" placeholder='Customer portal' autoComplete="off" />
                    </Stack>

                    <div className='holder color-holder'>
                        <h3>COLORS</h3>                 
                        <Stack>
                            {/* <ColorPicker onChange={setColor} color={color}/> */}
                            <TextField label="Primary theme color" type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                            <TextField label="Secondary theme color" type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                        </Stack>
                    </div>
                    <div className='mt-3 color-holder'>
                        <Stack>
                            <TextField label="Primary text color" type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                            <TextField label="Secondary text color" type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                        </Stack>
                    </div>
                </div>
            </Card>
            <Card 
                sectioned 
                primaryFooterAction={{content: 'Save and Continue'}}
                footerActionAlignment="left"
            >
                
                <div className='card-box'>
                    <h2 className='blue-title'>Earn Points</h2>
                    <h3 className='m-0'>POINTS RULES</h3>
                    <p>Create ways your customer can earn points when they join, share, and engage with your brand.</p>
                    <div className='holder'>
                        <div className='cards-list'>
                            <Card sectioned>
                                <div className='card-header' id='not-activated'>
                                    <Heading element="h2">Refer a friend <br /><small>Refer a friend</small></Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="success-outline" outline size="slim">Activate</Button>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <p>Earn 500 points for every time you refer a friend who spends over $5.00</p>
                                    <p>$5.00</p>
                                </div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>Started on 10/25/21</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>0 Referrals Completed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                            <Card sectioned>
                                <div className='card-header' id='activated'>
                                    <Heading element="h2">Create account <br /><small>Create account</small></Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="warning-outline" outline size="slim">Deactivate</Button>
                                        <Button id="danger-outline" outline size="slim">Delete</Button>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <p>Earn 10 points when you create an account</p>
                                </div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>Started on 10/25/21</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>0 Referrals Completed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                            <Card sectioned>
                                <div className='card-header' id='not-activated'>
                                    <Heading element="h2">Happy birthday <br /><small>Happy birthday</small></Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim" >Edit</Button>
                                        <Button id="success-outline" outline size="slim">Activate</Button>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <p>Earn 5 points on your birthday</p>
                                    <p>$5.00</p>
                                </div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>Started on 10/25/21</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>0 Referrals Completed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                            <Card sectioned>
                                <div className='card-header' id='activated'>
                                    <Heading element="h2">Points for purchases <br /><small>Make a purchases</small></Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="warning-outline" outline size="slim">Deactivate</Button>
                                        <Button id="danger-outline" outline size="slim">Delete</Button>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <p>Earn 1 points for every $1.00 you spent in our store</p>
                                </div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>Started on 10/25/21</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p>0 Accounts Created</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>

            <Card 
                sectioned 
                primaryFooterAction={{content: 'Save and Continue'}}
                footerActionAlignment="left"
            >
                
                <div className='card-box'>
                    <h2 className='blue-title'>Redeem Points</h2>
                    <h3 className='m-0'>REWARD RULES</h3>
                    <p>Create rewards your customers can redeem with the points they've earned.</p>
                    <div className='holder'>
                        <div className='cards-list other-list'>
                            <Card sectioned>
                                <div className='card-header' id='not-activated'>
                                    <Heading element="h2">$5.00 Off for 500 points</Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="danger-outline" outline size="slim">Delete</Button>
                                    </div>
                                </div>
                                <div className='card-body'></div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>0 Coupon Redeemed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                            <Card sectioned>
                                <div className='card-header' id='not-activated'>
                                    <Heading element="h2">$10.00 Off for 1000 points</Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="danger-outline" outline size="slim">Delete</Button>
                                    </div>
                                </div>
                                <div className='card-body'></div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>0 Coupon Redeemed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                            <Card sectioned>
                                <div className='card-header' id='not-activated'>
                                    <Heading element="h2">$20.00 Off for 2000 points</Heading>
                                    <div className='button-holder'>
                                        <Button primary outline size="slim">Edit</Button>
                                        <Button id="danger-outline" outline size="slim">Delete</Button>
                                    </div>
                                </div>
                                <div className='card-body'></div>
                                <div className='card-footer'>
                                    <Stack>
                                        <Stack.Item fill>
                                            <p>0 Coupon Redeemed</p>
                                        </Stack.Item>
                                    </Stack>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>


            <Card 
                sectioned 
            >
                
                <div className='card-box'>
                    <h2 className='blue-title'>Preview</h2>
                    <div className='preview-items'>
                        <div className="left-section">
                            <h3 className='m-0'>PREVIEW</h3>
                            <p>Create rewards your customer can redeem with the points they've earned.</p>
                        </div>
                        <div className="right-section">
                            <Button primary>Preview</Button>
                        </div>
                    </div>
                </div>
            </Card>
            <div className='prepare-to-launch'>
                <div className='top-title'>
                    <div className='ico'>
                        <img src={Icon8} alt="icon" />
                    </div>
                    <h3>Prepare to Launch</h3>
                </div>
                <div className="cta">
                    <div className="left-section">
                        <h3>Welcome to <br /> Chargezen Rewards</h3>
                        <p>Earn points by simply receiving your Chargezen subscription boxes and then redeem them for 
                            exclusive gifts, discounts and other loyalty perks.
                        </p>
                    </div>
                    <div className="right-section">
                        <div className="image-holder">
                            <img src={MainImage} alt="Main Image" />
                        </div>
                    </div>
                </div>
                <h4>Exchange your points for Feel Rewards</h4>
                <div className="rewards-list">
                    <div className="reward-list">
                        <div className="ico">
                            <img src={Icon1} alt="icon" />
                        </div>
                        <h5>$5 off</h5>
                        <p className="text-muted">next subscription order</p>
                        <p>500 points</p>
                    </div>
                    <div className="reward-list">
                        <div className="ico">
                            <img src={Icon1} alt="icon" />
                        </div>
                        <h5>$10 off</h5>
                        <p className="text-muted">next subscription order</p>
                        <p>1000 points</p>
                    </div>
                    <div className="reward-list">
                        <div className="ico">
                            <img src={Icon1} alt="icon" />
                        </div>
                        <h5>$20 off</h5>
                        <p className="text-muted">next subscription order</p>
                        <p>2000 points</p>
                    </div>
                </div>
            </div>
            <div className="how-it-works">
                <h4>How it works</h4>
                <div className="box-holder">
                    <div className="box">
                        <div className="ico">
                            <img src={Icon2} alt="icon" />
                        </div>
                        <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
                    </div>
                    <div className="box">
                        <div className="ico">
                            <img src={Icon3} alt="icon" />
                        </div>
                        <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
                    </div>
                    <div className="box">
                        <div className="ico">
                            <img src={Icon4} alt="icon" />
                        </div>
                        <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
                    </div>
                </div>
            </div>
            <div className="more-points">
                <h4>More ways to earn points</h4>
                <div className="box-holder">
                    <div className="box">
                        <div className="ico">
                            <img src={Icon5} alt="icon" />
                        </div>
                        <h5>Make a purchase</h5>
                        <p>$5 for 500 points</p>
                    </div>
                    <div className="box">
                        <div className="ico">
                            <img src={Icon6} alt="icon" />
                        </div>
                        <h5>Create an account</h5>
                        <p>$10 for 1000 points</p>
                    </div>
                    <div className="box">
                        <div className="ico">
                            <img src={Icon7} alt="icon" />
                        </div>
                        <h5>Sign up to our mailing list</h5>
                        <p>$20 for 2000 points</p>
                    </div>
                </div>
            </div>
        </FormLayout>
    </>
  );
}
export default Customize;