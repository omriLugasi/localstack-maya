import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {FormControl} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


interface IProps {
    onServiceChange: (selectedValue: string | null) => void,
    onRegionChange: (selectedValue: string | null) => void,
    services: string[]
    regions: string[]
}

export const Navbar = (props: IProps) => {

    return (
        <div className={'navbar'}>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">AWS Service</InputLabel>
                <Select
                    size={'small'}
                    labelId="demo-simple-select-standard-label"
                    onChange={(e) => {
                        props.onServiceChange(e.target.value)
                    }}
                    defaultValue={'SQS'}
                    label="Aws Service"
                >
                    {
                        props.services.map(serviceName => {
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

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Aws Region</InputLabel>
                <Select
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
