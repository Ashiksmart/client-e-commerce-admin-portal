import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/material';
export default function Asynchronous(props) {
  const { filterParam, types } = props
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [type, settype] = useState({});
  useEffect(() => {
    settype(types)
  }, [types])

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }

    const fetchData = async () => {
      try {
        let search = await props.passApidata(inputValue, type.value)
        if (search.length) {
          setOptions(search);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [inputValue]);

  return (
    <>
      {Object.keys(type).length > 0 &&
        <>
          <Box className="crm_fld_lft" sx={{
            flexDirection: "row"
          }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={filterParam}
              onChange={(event, newValue) => {
                setOptions([])
                setInputValue("")
                settype(newValue)

              }}
              defaultValue={type}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Select Filter Param" />}
            />
            <Autocomplete
              id={"Search With " + type.label}
              sx={{ width: 300 }}
              options={options}
              onChange={(event, newValue) => {
                props.UserSelectedData(newValue)
              }}
              getOptionLabel={(option) => {

                return option[`${type.value}`] === undefined ? "" : option[`${type.value}`]
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Search With " + type.label}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  {option[`${type.value}`]}
                </li>
              )}
            />
          </Box>
        </>}
    </>

  );
}
