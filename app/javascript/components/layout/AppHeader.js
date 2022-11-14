import { Icon, Select } from "@shopify/polaris";
import { TextField } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import {
    NotificationMajor,
    SearchMajor
} from '@shopify/polaris-icons';
import "./nav_style.scss"

const AppHeader = (props) => {
    const [selectedShop, setSelectedShop] = useState(props?.domain);
    const handleSelectChange = useCallback((value) => {
        setSelectedShop(value)
        window.location.replace(`/?shopify_domain=${value}`)
    }, []);
    const [allShops, setAllShops] = useState();
    useEffect(() => {
        const shopsArray = (localStorage.getItem("allShops") ? JSON.parse(localStorage.getItem("allShops")) : '')
        setAllShops(shopsArray)
    }, [localStorage.getItem("allShops")])

    const [value, setValue] = useState('');

    const handleChange = useCallback((newValue) => setValue(newValue), []);
    return (
        <div className="main_header">
            <h2>{localStorage.getItem("currentuser")}</h2>
            <div className="header_main_div">
                <div className="first_div">
                    <div className="user_details">
                        <div className="avatar">
                            <></>
                        </div>
                        <div className="left_section">
                            <p className='changeStoreDiv'>
                                <Select
                                    options={allShops}
                                    onChange={() => handleSelectChange()}
                                    value={selectedShop}
                                />
                            </p>
                        </div>
                    </div>
                    <div className="search_div">
                        <TextField
                            value={value}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Search..."
                        />
                        <div className="search_icon"><Icon source={SearchMajor} color="base" /></div>
                    </div>
                </div>
                <div className="second_div">
                    <div className="status"><span className="online_symbol" />Online</div>
                    <div className="notification"><Icon source={NotificationMajor} color="base" /></div>
                </div>
            </div>
        </div>)
}
export default AppHeader;