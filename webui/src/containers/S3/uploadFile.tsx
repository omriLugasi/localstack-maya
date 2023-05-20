import {useContext, useRef, useState} from "react";
import Dialog from '@mui/material/Dialog'
import TextField from "@mui/material/TextField";
import { MuiFileInput } from 'mui-file-input'
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {s3UploadFile} from "../../api/S3";
import {AppContext} from "../../contexts/application";

interface IProps {
    onClose: () => void
    onNewItemCreated: () => void
    bucketName: string
    prePath: string
}

export const UploadFile = (props: IProps) => {
    const [filePath, setFilePath] = useState<string>('')
    const inputRefFile = useRef()
    const appContext = useContext(AppContext)

    const onSubmit = async () => {
        if (!inputRefFile.current.files?.[0]) {
            alert('You must choose a file.')
            return
        }
        try {
            await s3UploadFile({
                bucketName: props.bucketName,
                file: inputRefFile.current.files[0],
                path: `${props.prePath ? `${props.prePath}/` : ''}${filePath}`
            })
            props.onClose()
            appContext.showToaster({
                type: 'success',
                message: `${filePath} successfully created`
            })
            props.onNewItemCreated()
        } catch(e) {
            console.error(e)
            appContext.showToaster({
                type: 'error',
                message: e.response.data.message
            })
        }
    }

    return (
        <Dialog open onClose={props.onClose} >
            <div className='s3-upload-file-dialog-container'>
                <h1> Upload file</h1>
                <TextField
                    inputProps={{
                        'data-qa': 'upload-s3-file-path-input'
                    }}
                    label="File path"
                    variant="standard"
                    value={filePath}
                    onChange={e => setFilePath(e.target.value)}
                />
                <br />
                <input type='file' ref={inputRefFile} />
                {/*<MuiFileInput*/}
                {/*    data-qa='upload-file-to-s3-file-upload'*/}
                {/*    placeholder="Insert a file"*/}
                {/*    value={file}*/}
                {/*    onChange={setFile}*/}
                {/*/>*/}
                <br />
                <br />
                <Divider />
                <div className='s3-upload-file-dialog-actions-container'>
                    <Button variant="outlined" size={'small'} onClick={props.onClose}>Close</Button>
                    <Button
                        data-qa='upload-file-to-s3-submit-button'
                        variant="contained"
                        size={'small'}
                        disabled={!filePath}
                        onClick={onSubmit}
                    >Create</Button>
                </div>
            </div>
        </Dialog>
    )
}
