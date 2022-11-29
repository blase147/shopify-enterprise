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
        localStorage.setItem("selectedShop", value)
        window.location.replace(`/?shopify_domain=${value}`)
    }, []);
    const [allShops, setAllShops] = useState();
    useEffect(() => {
        const shopsArray = (localStorage.getItem("allShops") ? JSON.parse(localStorage.getItem("allShops")) : '')
        setAllShops(shopsArray)

    }, [localStorage.getItem("allShops")])

    const [value, setValue] = useState('');

    useEffect(() => {
        setSelectedShop(localStorage.getItem("selectedShop"))
    }, [localStorage.getItem("selectedShop")])

    const handleChange = useCallback((newValue) => setValue(newValue), []);
    return (
        <>
            <div className="main_header">
                <div className="header_main_div">
                    <div className="first_div">
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
                        <div className="userDetailMain">
                            <div className="user_details">
                                <div className="avatar">
                                    <h2>{localStorage.getItem("currentuser")}</h2>
                                </div>
                                <div className="left_section">
                                    <p className='changeStoreDiv'>
                                        <Select
                                            options={allShops}
                                            onChange={(e) => handleSelectChange(e)}
                                            value={selectedShop}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="header_serperator" />
        </>)
}
export default AppHeader;