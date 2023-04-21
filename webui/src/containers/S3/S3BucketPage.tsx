import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
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

type BucketFileType = AWS.S3.Types.ListObjectsV2Output['Contents'][0]

interface IProps {
}

export const S3BucketPage = (props: IProps) => {
    const [files, setFiles] = useState<BucketFileType[]>([])
    const [showUploadFileDialog, setShowUploadFileDialog] = useState<boolean>(false)
    const { bucketName } = useParams();

    useEffect(() => {
        const query = async() => {
            const response = await s3GetBucketFiles({
                bucketName: bucketName as string
            })
            const newFilesObj = (response?.Contents || []).reduce((acc: Record<string, BucketFileType>, current: BucketFileType) => {
                if (current.Key.includes('/')) {
                    const folderName = current.Key.split('/')[0] + '/'
                    acc[folderName] = {
                        ...current,
                        Key: folderName
                    }
                } else{
                    acc[current.Key] = current
                }
                return acc
            }, {})
            setFiles(Object.values(newFilesObj))
        }
        query()
    }, [])

    return (
        <>
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
            <TableContainer component={Paper} style={{ width: '92%'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}>
                            <Checkbox size='small' />
                        </TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((row: BucketFileType, index: number) => (
                        <TableRow key={row.Key}>
                            <TableCell>
                                <Checkbox
                                    data-qa={`message-checkbox-${index + 1}`}
                                    size='small' />
                            </TableCell>
                            <TableCell>{row.Key}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>

            {
                showUploadFileDialog
                ? <UploadFile
                        bucketName={bucketName as string}
                        prePath={''}
                        onClose={() => setShowUploadFileDialog(false)} />
                : null
            }
        </>
    )
}
