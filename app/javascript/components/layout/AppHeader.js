import { Button, Icon, Select } from "@shopify/polaris";
import { TextField } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import {
    NotificationMajor,
    SearchMajor
} from '@shopify/polaris-icons';
import "./nav_style.scss"
import Notifications from "./Notifications";
import { useHistory } from "react-router";

const AppHeader = (props) => {
    const history = useHistory();
    const [selectedShop, setSelectedShop] = useState(props?.domain);
    const [activeNotification, setActiveNotification] = useState(false);
    const handleSelectChange = useCallback((value) => {
        setSelectedShop(value)
        localStorage.setItem("selectedShop", value)
        changeShop(value)
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

    const changeShop = (domain) => {
        fetch(`/changeShop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shop_domain: domain
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.replace(`/?shopify_domain=${domain}`)
            });
    }

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
                        <div className="notification">
                            <Button
                                className="admin_notification_button"
                                onClick={() => history.push("/notifications")}
                            >
                                <Icon source={NotificationMajor} color="base" />
                            </Button>
                        </div>
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