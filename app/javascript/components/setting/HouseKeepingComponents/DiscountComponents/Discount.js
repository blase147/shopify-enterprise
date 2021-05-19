import React from 'react'
import {Button, Layout,Autocomplete,TextField,Icon, DisplayText, Tag} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import './discount.css'
const Discount = ({handleDiscountCodeForm}) => {

    const textField = (
        <Autocomplete.TextField
          // onChange={updateText}
          value=""
          prefix={<Icon source={SearchMinor} color="base" />}
          placeholder="Search Discount Code"
        />
      );

    return (
        <Layout sectioned>
        <div className="wrapper">
          <div className="button-bar">
            <p>Create discount coupon codes for your customers to apply to their order.</p>
            <Button onClick={handleDiscountCodeForm} primary>Create Discount Code</Button>
          </div>
          <div className="search-bar">
            <Autocomplete
              options={[]}
              textField={textField}
            />
          </div>
          <div className="table-bar">
            <table>
                <tbody>
                <tr>
                    <td>Code Detail</td>
                    <td>Started</td>
                    <td>End</td>
                    <td>Applications</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="title-section">
                      <h5>
                        <strong>
                        CHANCE2020
                        </strong>
                      </h5>
                      <div className="tag-section">
                      <span className="active">Active</span>
                      <span className="in-active">InActive</span>
                      <span className="expired">Expired</span>
                      </div>
                      </div>
                      <div className="text-section">
                      16.66 off recurring orders and all products · applies to 4 charges · new subscribers only
                      </div>
                    </td>
                    <td>Jun 20, 2021</td>
                    <td>Jun 20, 2021</td>
                    <td>12 of oo</td>
                    <td><Button primary>Settings</Button></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="title-section">
                      <h5>
                        <strong>
                        CHANCE2020
                        </strong>
                      </h5>
                      <div className="tag-section">
                      <span className="active">Active</span>
                      <span className="in-active">InActive</span>
                      <span className="expired">Expired</span>
                      </div>
                      </div>
                      <div className="text-section">
                      16.66 off recurring orders and all products · applies to 4 charges · new subscribers only
                      </div>
                    </td>
                    <td>Jun 20, 2021</td>
                    <td>Jun 20, 2021</td>
                    <td>12 of oo</td>
                    <td><Button primary>Settings</Button></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="title-section">
                      <h5>
                        <strong>
                        CHANCE2020
                        </strong>
                      </h5>
                      <div className="tag-section">
                      <span className="active">Active</span>
                      <span className="in-active">InActive</span>
                      <span className="expired">Expired</span>
                      </div>
                      </div>
                      <div className="text-section">
                      16.66 off recurring orders and all products · applies to 4 charges · new subscribers only
                      </div>
                    </td>
                    <td>Jun 20, 2021</td>
                    <td>Jun 20, 2021</td>
                    <td>12 of oo</td>
                    <td><Button primary>Settings</Button></td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
      </Layout>
    )
}

export default Discount