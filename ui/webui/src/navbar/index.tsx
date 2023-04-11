import React from "react";
import {FormControl} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


interface IProps {
    onRegionChange: (selectedValue: string | null) => void,
    regions: string[]
    navigateHome: () => void
}

export const Navbar = (props: IProps) => {

    return (
        <div className={'navbar'}>

            <div className={'navbar-logo-area'}>
                <img src={'https://vitejs.dev/logo.svg'} style={{ width: 40 }} onClick={props.navigateHome} />
                <span onClick={props.navigateHome}> Localstack - Maya</span>
            </div>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} color='secondary'>
                <InputLabel color='secondary'>Aws Region</InputLabel>
                <Select
                    color='secondary'
                    size={'small'}
                    labelId="demo-simple-select-standard-label"
                    onChange={(e) => {
                        props.onRegionChange(e.target.value)
                    }}
                    defaultValue={'us-east-1'}
                    label="Aws Region"
                >
                    {
                        props.regions.map(serviceName => {
                            return (
                                <MenuItem
                                    value={serviceName}
                                    key={serviceName}
                                >{ serviceName }</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>

            {/*<Autocomplete*/}
            {/*    disablePortal*/}
            {/*    size={'small'}*/}
            {/*    value={'us-east-1'}*/}
            {/*    options={props.regions}*/}
            {/*    sx={{ width: 300 }}*/}
            {/*    onChange={(arg, selectedValue) => {*/}
            {/*        props.onRegionChange(selectedValue)*/}
            {/*    }}*/}
            {/*    renderInput={(params) => <TextField {...params} label="Aws Region" />}*/}
            {/*/>*/}

        </div>
    )
}
