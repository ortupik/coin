////////////////////////////////////////////////////////////////////////////
// city_state.js ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

var countries = Object();
countries['North America'] = 'Canada|United States';

////////////////////////////////////////////////////////////////////////////

var city_states = Object();


//North America
city_states['Canada'] = 'Ottawa|Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland and Labrador|Northwest Territories|Nova Scotia|Nunavut|Ontario|Prince Edward Island|Quebec|Saskatchewan|Yukon Territory';
city_states['United States'] = 'Washington DC|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Georgia|Kentucky|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusets|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming';


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function setRegions()
{
	for (region in countries)
            $("#regionSelect").append('<option value="' + region + '">' + region + '</option>');
}

function set_country(oRegionSel, oCountrySel, oCity_StateSel)
{
	var countryArr;
	oCountrySel.length = 0;
	oCity_StateSel.length = 0;
	var region = oRegionSel.options[oRegionSel.selectedIndex].text;
	if (countries[region])
	{
		oCountrySel.disabled = false;
		oCity_StateSel.disabled = true;
		
		countryArr = countries[region].split('|');
		for (var i = 0; i < countryArr.length; i++)
			oCountrySel.options[i + 1] = new Option(countryArr[i], countryArr[i]);
		
	}
	else oCountrySel.disabled = true;
}

function set_city_state(oCountrySel, oCity_StateSel)
{
   
	var city_stateArr;
	oCity_StateSel.length = 0;
	var country = oCountrySel.options[oCountrySel.selectedIndex].text;
	if (city_states[country])
	{
		oCity_StateSel.disabled = false;
		
		city_stateArr = city_states[country].split('|');
		for (var i = 0; i < city_stateArr.length; i++)
			oCity_StateSel.options[i+1] = new Option(city_stateArr[i],city_stateArr[i]);
		
	}
	else oCity_StateSel.disabled = true;
}

function print_city_state(oCountrySel, oCity_StateSel)
{
	var country = oCountrySel.options[oCountrySel.selectedIndex].text;
	var city_state = oCity_StateSel.options[oCity_StateSel.selectedIndex].text;
		
}