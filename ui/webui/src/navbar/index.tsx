import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


interface IProps {
    onServiceChange: (selectedValue: string | null) => void,
    onRegionChange: (selectedValue: string | null) => void,
    services: string[]
    regions: string[]
}

export const Navbar = (props: IProps) => {

    return (
        <div className={'navbar'}>

            <Autocomplete
                disablePortal
                size={'small'}
                options={props.services}
                sx={{ width: 300 }}
                onChange={(arg, selectedValue) => {
                    props.onServiceChange(selectedValue)
                }}
                renderInput={(params) => <TextField {...params} label="Aws service" />}
            />

            <Autocomplete
                disablePortal
                size={'small'}
                options={props.regions}
                sx={{ width: 300 }}
                onChange={(arg, selectedValue) => {
                    props.onRegionChange(selectedValue)
                }}
                renderInput={(params) => <TextField {...params} label="Aws Region" />}
            />

        </div>
    )
}
