import {
  Card,
  Layout,

  TextField
} from '@shopify/polaris';
import React, { useState } from 'react';

const CustomKeywords = () => {
  const orderOptions = [
    { label: "Order By Title", value: 'title' },
    { label: "Order By Name", value: 'name' }
]
const [searchValue, setSearchValue] = useState("");
const [order, setOrder] = useState("title");
    return (
      <Layout>
        <Card>
          <Card.Section>
            <div className="smarty-sms">
              <p className="customize-text">Message Custom Keywords</p>
              <p className="customize-text" style={{ fontWeight: 'normal' }}>Add your own responses to customer messages.</p>
              <form class="">
                <div className="message-form">
                  <div class="example">
                      <TextField
                          placeholder="Message’s Keyword"
                          value={searchValue}
                          // error={}
                          onChange={(value) => setSearchValue(value)}
                      />
                      <button className="btn btn-primary" type="submit">Search</button>
                  </div>
                </div>
              </form>

              <table className="message-table">
                  <tr>
                    <th>Keywords</th>
                    <th style={{width:'30%'}}>Responses</th>
                    <th >Status</th>
                    <th>Created at</th>
                    <th>Actions</th>
                  </tr>
                  <tr>
                <td>
                  <div className="keywords-btn">
                    <button>Thanks</button>
                    <button>thx</button>
                    <button>ty</button>
                    <button>appreciate</button>
                  </div>
                </td>
                <td>You're welcome! Remember to reply with 'Modify Order' if you need to modify your subscription(s).</td>
                
                <td><button className="active-status-btn">Active</button></td>
                <td>13 Apr 19:37</td>
                <td >
                  <div className="edit-btn">
                    <span >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.9697 8.85494C13.6535 8.85494 13.3972 9.11123 13.3972 9.42746V13.855H1.14528V1.60305H5.57277C5.889 1.60305 6.14529 1.34676 6.14529 1.03053C6.14529 0.714297 5.889 0.458008 5.57277 0.458008H0.572764C0.256533 0.458008 0.000244141 0.714297 0.000244141 1.03053V14.4275C0.000244141 14.7437 0.256563 15 0.572764 15H13.9697C14.2859 15 14.5422 14.7437 14.5422 14.4275V9.42746C14.5422 9.11126 14.2859 8.85494 13.9697 8.85494Z" fill="#007EFF" /> <path d="M14.8322 2.20975L12.7905 0.167754C12.6832 0.060293 12.5376 0 12.3857 0C12.2338 0 12.0884 0.060293 11.9809 0.167754L5.22518 6.92347C5.15572 6.99275 5.10553 7.07862 5.07881 7.1729L4.27728 10.0164C4.22118 10.2158 4.2771 10.43 4.42365 10.5766C4.53243 10.6853 4.67862 10.7443 4.82841 10.7443C4.88012 10.7443 4.93242 10.7372 4.98357 10.7229L7.82709 9.92139C7.92155 9.89467 8.00745 9.84428 8.0767 9.77502L14.8322 3.01931C15.0559 2.7958 15.0559 2.43319 14.8322 2.20975ZM7.37288 8.85973L5.65666 9.3433L6.14044 7.62747L12.3857 1.38226L13.6179 2.61451L7.37288 8.85973Z" fill="#007EFF" /> <path d="M6.05331 6.90348L5.24365 7.71313L7.28532 9.7548L8.09497 8.94515L6.05331 6.90348Z" fill="#007EFF" /> </svg>
                        Edit
                    </span>

                  </div>
                </td>
              </tr>
              </table>
          </div>

          </Card.Section>
        </Card>
      </Layout>
    )
}

export default CustomKeywords
