import React, {useState} from 'react'
import {
  Card,
  DisplayText,
  FormLayout,
  Layout,
  Select,
  TextStyle,
  TextField
} from '@shopify/polaris';

const CustomMessage = () => {
    const orderOptions = [
        { label: "Order By Title", value: 'title' },
        { label: "Order By Name", value: 'name' }
      ]
    const [searchValue,setSearchValue]=useState("");
    const [order,setOrder]=useState("title");
    return (
        <Layout>
            <Card>
                <Card.Section>
                    <div className="smarty-sms">
                        <p className="customize-text">Custom Messages</p>
                        <p className="customize-text">Customize your SMS Messages</p>
                        <form class="">
                            <div className="message-form">
                                <div class="example">
                                    <TextField
                                        placeholder="Message’s Title"
                                        value={searchValue}
                                        // error={}
                                        onChange={(value) => setSearchValue(value)}
                                    />
                                    <button className="btn btn-primary" type="submit">Search</button>
                                </div>

                                {/* <input className="" placeholder="order by title"type="number"/> */}
                                <div class="Polaris-Select order-title">
                                    <Select
                                        options={orderOptions}
                                        value={order}
                                        // error={
                                        //   touched.showOrderHistory && errors.showOrderHistory
                                        // }
                                        onChange={(value) => setOrder(value)}
                                    />
                                </div>

                            </div>
                        </form>

                        <table className="message-table">
                            <tr>
                                <th>Name</th>
                                <th>Message’s Title</th>
                                <th style={{ width: '27%' }}>Actions</th>
                            </tr>
                        </table>
                    </div>

                </Card.Section>
            </Card>
        </Layout>
    )
}

export default CustomMessage
