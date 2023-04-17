import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import useDebounce from "../../customHook/useDebounce";


interface IProps {}

export const S3Management = (props: IProps) => {
    const [searchDebounceValue, searchActualValue, setSearchValue] = useDebounce(250)

    return (
        <div>
            <h1> S3 buckets </h1>
            <FormControl sx={{ width: '450px' }}>
                <TextField
                    inputProps={{
                        'data-qa': 'search-s3-by-name'
                    }}
                    fullWidth
                    label="Search for S3 bucket name"
                    variant="standard"
                    value={searchDebounceValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </FormControl>
        </div>
    )
}
