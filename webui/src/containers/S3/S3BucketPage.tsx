import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import {s3GetBucketFiles} from "../../api/S3";
import Button from "@mui/material/Button";
import type AWS from 'aws-sdk'
import {UploadFile} from "./uploadFile";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import useDebounce from "../../customHook/useDebounce";

type BucketFileType = AWS.S3.Types.ListObjectsV2Output['Contents'][0]

interface IProps {
}

export const S3BucketPage = (props: IProps) => {
    const [files, setFiles] = useState<BucketFileType[]>([])
    const [showUploadFileDialog, setShowUploadFileDialog] = useState<boolean>(false)
    const { bucketName } = useParams();
    const navigate = useNavigate();
    const [searchDebounceValue, actualSearchValue, setSearchValue] = useDebounce(300)
    const folderPath = window.location.pathname.split('?')[0]
        .replace(`/S3/bucket/${bucketName}`, '')

    useEffect(() => {
        const query = async() => {
            const response = await s3GetBucketFiles({
                bucketName: bucketName as string,
                prefix: folderPath ? `${folderPath}/` : '' + actualSearchValue
            })
            const newFilesObj = (response?.Contents || []).reduce((acc: Record<string, BucketFileType>, current: BucketFileType) => {
                current.Key = current.Key.replace(folderPath ? `${folderPath}/` : '', '')
                let item = current
                if (current.Key.includes('/')) {
                    const folderName = current.Key.split('/')[0] + '/'
                    item = {
                        ...current,
                        Key: folderName
                    }
                }
                acc[item.Key] = item
                return acc
            }, {})
            setFiles(Object.values(newFilesObj))
        }
        query()
    }, [actualSearchValue])

    return (
        <div className='s3-page-padding-left'>
            <h1>Bucket page { bucketName }</h1>
            <div className='sub-title-bar'>
                <span>Manage the S3 bucket ({bucketName}).</span>
                <div className='sub-title-bar-actions'>
                    <Button
                        onClick={() => {
                            setShowUploadFileDialog(true)
                        }}
                        data-qa='s3-upload-file-button'
                        variant="contained"
                        size='small'
                    >Upload file</Button>
                </div>
            </div>
            <FormControl sx={{ width: '450px' }}>
                <TextField
                    inputProps={{
                        'data-qa': 'search-s3-file-by-name'
                    }}
                    fullWidth
                    label="Search filename by prefix"
                    variant="standard"
                    value={searchDebounceValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </FormControl>
            <TableContainer component={Paper} style={{ width: '92%'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ padding: 0 }} width={20}>
                            <Checkbox size='small' />
                        </TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((row: BucketFileType, index: number) => index > 7 ? null : (
                        <TableRow key={row.Key}>
                            <TableCell style={{ padding: 0 }} width={20}>
                                <Checkbox
                                    data-qa={`s3-file-checkbox-${index + 1}`}
                                    size='small' />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <span
                                    data-qa={`s3-file-column-name-${row.Key}`}
                                    className='link'
                                    onClick={() => navigate(`/S3/bucket/${bucketName}/${row.Key}`)}>
                                    {row.Key}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            {
                files.length > 7 ? <p> Display 8 from { files.length } results. </p> : null
            }

            {
                showUploadFileDialog
                ? <UploadFile
                        bucketName={bucketName as string}
                        prePath={''}
                        onClose={() => setShowUploadFileDialog(false)} />
                : null
            }
        </div>
    )
}
