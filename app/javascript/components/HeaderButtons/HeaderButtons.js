import React from "react";
import { Button, ButtonGroup } from "@shopify/polaris";

const HeaderButtons = ({ headerButtons, setHeaderButton, headerButton }) => {
    return (
        <ButtonGroup>
            {
                headerButtons?.map((obj) => {
                    return (
                        <Button
                            onClick={() => {
                                setHeaderButton(obj?.val)
                            }}
                            primary={headerButton === obj?.val ? true : false}
                        >
                            {obj?.name}
                        </Button>
                    )
                })
            }
        </ButtonGroup>
    )
}

export default HeaderButtons;