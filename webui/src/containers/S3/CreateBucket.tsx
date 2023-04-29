import {useContext, useState} from "react";
import Dialog from '@mui/material/Dialog'
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {createBucket} from "../../api/S3";
import {AppContext} from "../../contexts/application";

interface IProps {
    onClose: () => void
}

export const CreateBucketDialog = (props: IProps) => {
    const [bucketName, setBucketName] = useState<string>('')
    const [versioning, setVersioning] = useState<boolean>(false)
    const appContext = useContext(AppContext)

    const onSubmit = async () => {
        try {
            await createBucket({
                IsVersioned: versioning,
                versioningParams: {
                    Bucket: bucketName,
                    VersioningConfiguration: {
                        MFADelete: "Disabled",
                        Status: "Enabled"
                    }
                },
                createBucketParams: {
                    Bucket: bucketName
                }
            })
            appContext.showToaster({
                type: 'success',
                message: `Bucket ${bucketName} created successfully`
            })
            props.onClose()
        } catch(e) {
            console.error(e)
            if (e.statusCode === 409) {
                appContext.showToaster({
                    type: 'error',
                    message: `Bucket with name "${bucketName}" already exists`
                })
                return
            }
            appContext.showToaster({
                type: 'error',
                message: 'Something went wrong ...'
            })

        }
    }

    return (
        <Dialog open onClose={props.onClose} >
            <div className='s3-upload-file-dialog-container'>
                <h1> Create S3 bucket</h1>
                <TextField
                    inputProps={{
                        'data-qa': 'upload-s3-bucket-name-input'
                    }}
                    label="Bucket Name"
                    variant="standard"
                    value={bucketName}
                    onChange={e => setBucketName(e.target.value)}
                />
                <br />
                <FormControlLabel control={
                    <Checkbox value={versioning} onChange={() => setVersioning(!versioning)} />
                } label="Set as versioned bucket" />
                <br />
                <Divider />
                <div className='s3-upload-file-dialog-actions-container'>
                    <Button variant="outlined" size={'small'} onClick={props.onClose}>Close</Button>
                    <Button
                        data-qa='s3-create-bucket-submit-button'
                        variant="contained"
                        size={'small'}
                        disabled={!bucketName}
                        onClick={onSubmit}
                    >Create</Button>
                </div>
            </div>
        </Dialog>
    )
}
