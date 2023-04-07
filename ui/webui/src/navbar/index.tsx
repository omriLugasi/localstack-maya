import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


interface IProps {
    onServiceChange: (selectedValue: string | null) => void,
    services: string[]
}

export const Navbar = (props: IProps) => {

    return (
        <div className={'navbar'}>

            <Autocomplete
                disablePortal
                size={'small'}
                id="combo-box-demo"
                options={props.services}
                sx={{ width: 300 }}
                onChange={(arg, selectedValue) => {
                    props.onServiceChange(selectedValue)
                }}
                renderInput={(params) => <TextField {...params} label="Aws service" />}
            />

        </div>
    )
}
