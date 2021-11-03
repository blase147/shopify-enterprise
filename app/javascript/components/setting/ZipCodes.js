import React,{ useCallback, useState } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
	Card,
	Layout,
	Toast,
	List,
	Button,
	TextField,
	Icon,
	FormLayout,
	DisplayText,
	TextStyle,
	Select
} from '@shopify/polaris';

const ZipCodes = ({handleBack, domain}) => {
	const [zipCodes, setZipCodes] = useState([]);
	const [city, setCity] = useState('');
	const [stateName, setStateName] = useState('AL');
	const [errorMsg, setErrorMsg] = useState('');
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [loading, setLoading] = useState(true);
	const [ZipCodeView, setZipCodeView] = useState(false);

	const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
	const handleCityChange = useCallback((newValue) => setCity(newValue), []);
	const handleSelectChange = useCallback((value) => setStateName(value), []);

	const handleGoRequest = () => {
		fetch(`/zip_codes?city=${city}&state=${stateName}`
		// , {
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Accept: "application/json",
		// 	},
		// 	credentials: "same-origin",
		// }
		)
			.then(response => response.json())
			.then(data => {
        if (data.status == true){
				  setZipCodes(data.zip_codes);
          setZipCodeView(true);
          console.log(zipCodes, '=====zipCodes===');
        } else {
          setErrorMsg(data.error);
          setZipCodeView(false);
        }
			})
			.catch(error => {
				console.error("Error Fetching data: ", error);
				setErrorMsg(error);
			})
			.finally(() => {
				setLoading(false);
			})
		// console.log(data, '======data=====');
		// console.log(zipCodes, '======zipCodes=====');
	}

	const options = [
		{
			label: "Alabama",
			value: "AL"
		},
		{
			label: "Alaska",
			value: "AK"
		},
		{
			label: "American Samoa",
			value: "AS"
		},
		{
			label: "Arizona",
			value: "AZ"
		},
		{
			label: "Arkansas",
			value: "AR"
		},
		{
			label: "California",
			value: "CA"
		},
		{
			label: "Colorado",
			value: "CO"
		},
		{
			label: "Connecticut",
			value: "CT"
		},
		{
			label: "Delaware",
			value: "DE"
		},
		{
			label: "District Of Columbia",
			value: "DC"
		},
		{
			label: "Federated States Of Micronesia",
			value: "FM"
		},
		{
			label: "Florida",
			value: "FL"
		},
		{
			label: "Georgia",
			value: "GA"
		},
		{
			label: "Guam",
			value: "GU"
		},
		{
			label: "Hawaii",
			value: "HI"
		},
		{
			label: "Idaho",
			value: "ID"
		},
		{
			label: "Illinois",
			value: "IL"
		},
		{
			label: "Indiana",
			value: "IN"
		},
		{
			label: "Iowa",
			value: "IA"
		},
		{
			label: "Kansas",
			value: "KS"
		},
		{
			label: "Kentucky",
			value: "KY"
		},
		{
			label: "Louisiana",
			value: "LA"
		},
		{
			label: "Maine",
			value: "ME"
		},
		{
			label: "Marshall Islands",
			value: "MH"
		},
		{
			label: "Maryland",
			value: "MD"
		},
		{
			label: "Massachusetts",
			value: "MA"
		},
		{
			label: "Michigan",
			value: "MI"
		},
		{
			label: "Minnesota",
			value: "MN"
		},
		{
			label: "Mississippi",
			value: "MS"
		},
		{
			label: "Missouri",
			value: "MO"
		},
		{
			label: "Montana",
			value: "MT"
		},
		{
			label: "Nebraska",
			value: "NE"
		},
		{
			label: "Nevada",
			value: "NV"
		},
		{
			label: "New Hampshire",
			value: "NH"
		},
		{
			label: "New Jersey",
			value: "NJ"
		},
		{
			label: "New Mexico",
			value: "NM"
		},
		{
			label: "New York",
			value: "NY"
		},
		{
			label: "North Carolina",
			value: "NC"
		},
		{
			label: "North Dakota",
			value: "ND"
		},
		{
			label: "Northern Mariana Islands",
			value: "MP"
		},
		{
			label: "Ohio",
			value: "OH"
		},
		{
			label: "Oklahoma",
			value: "OK"
		},
		{
			label: "Oregon",
			value: "OR"
		},
		{
			label: "Palau",
			value: "PW"
		},
		{
			label: "Pennsylvania",
			value: "PA"
		},
		{
			label: "Puerto Rico",
			value: "PR"
		},
		{
			label: "Rhode Island",
			value: "RI"
		},
		{
			label: "South Carolina",
			value: "SC"
		},
		{
			label: "South Dakota",
			value: "SD"
		},
		{
			label: "Tennessee",
			value: "TN"
		},
		{
			label: "Texas",
			value: "TX"
		},
		{
			label: "Utah",
			value: "UT"
		},
		{
			label: "Vermont",
			value: "VT"
		},
		{
			label: "Virgin Islands",
			value: "VI"
		},
		{
			label: "Virginia",
			value: "VA"
		},
		{
			label: "Washington",
			value: "WA"
		},
		{
			label: "West Virginia",
			value: "WV"
		},
		{
			label: "Wisconsin",
			value: "WI"
		},
		{
			label: "Wyoming",
			value: "WY"
		}
	];

	return(
		<>
			<Layout>
				<Layout.Section>
					<div className="back-button pointer" onClick={handleBack}>
						<Icon
							source={MobileBackArrowMajor}
							color="base" />
					</div>
				</Layout.Section>
				<Card>
					<Card.Section>
						<div className="billing">
							<FormLayout>
								<DisplayText size="small" element="h6">
									<TextStyle variation="subdued">
										Zip Codes
									</TextStyle>
								</DisplayText>
								<Select
									label="State Name"
									options={options}
									onChange={handleSelectChange}
									value={stateName}
								/>
								<TextField
									label="City"
									value={city}
									onChange={handleCityChange}
									autoComplete="off"
								/>
								<Button primary onClick={handleGoRequest}>
									Go!
								</Button>
                { errorMsg &&
                  <p style={{color: 'red'}}>{errorMsg}</p>
                }
							</FormLayout>
						</div>
					</Card.Section>
				</Card>
				{ ZipCodeView && (
					<Card sectioned>
            <h3>Added the following Zip Codes:</h3>
						<List type="bullet">
						{ zipCodes.map((code, index) => (
								<List.Item key={index}>{code}</List.Item>
						))}
						</List>
					</Card>
				)}
			</Layout>
			{saveSuccess && (
				<Toast
					content="Setting is saved"
					onDismiss={hideSaveSuccess}
				/>
			)}
		</>
	)
}

export default ZipCodes;
