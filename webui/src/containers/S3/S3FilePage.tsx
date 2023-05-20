import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import {deleteObject, listObjectVersions} from "../../api/S3";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { AppContext } from './../../contexts/application'

interface IProps {
}

export const S3FilePage = (props: IProps) => {
    const { bucketName } = useParams();
    const [searchParams] = useSearchParams();
    const [versions, setVersions] = useState<{
    IsLatest: boolean,
    Key: string,
    LastModified: Date,
    Size: number
    StorageClass: string
    VersionId: string
    }[]>([])
    const appContext = useContext(AppContext) as AppContext
    const navigate = useNavigate();


    const filePath = searchParams.get('path')

    useEffect(() => {
        const query = async () => {
            const response = await listObjectVersions({
                Bucket: bucketName as string,
                Prefix: filePath
            })
            setVersions(response.Versions)
        }

        query()
    }, [])


    const onFileDelete = async () => {
        try {
            deleteObject({
                bucketName: bucketName as string,
                objectPath: filePath as string
            })
            appContext.showToaster({
                type: 'success',
                message: 'File deleted successfully'
            })
            navigate(`/s3/bucket/${bucketName}`)
        } catch(e) {
            console.error(e)
            appContext.showToaster({
                type: 'error',
                message: e.message
            })
        }
    }

    return(
        <div className='s3-page-padding-left'>
            <h1>S3 File page</h1>
            <div className='sub-title-bar'>
                <span>S3 file <a href="" className='link'>s3://{filePath}</a></span>
                <div className='sub-title-bar-actions'>
                    <Button
                        data-qa='s3-delete-file-button'
                        variant="contained"
                        size='small'
                        onClick={onFileDelete}
                    >Delete file</Button>
                </div>
            </div>
            <TableContainer component={Paper} style={{ width: '92%', margin: '2% 0'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Latest</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell>Size</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {versions.map((versionObject, index: number) => index > 7 ? null : (
                            <TableRow
                                key={versionObject.VersionId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                <span
                                    data-qa={`s3-bucket-column-index-${index}`}
                                    className='link'
                                >
                                    {versionObject.VersionId === 'null' ? 'Not versioned' : versionObject.VersionId }
                                </span>
                                </TableCell>
                                <TableCell>
                                    <span
                                        data-qa={`s3-bucket-column-latest-index-${index}`}
                                    >
                                        { versionObject.IsLatest ? 'true' : 'false' }
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {versionObject.LastModified.toISOString()}
                                </TableCell>
                                <TableCell>
                                    {versionObject.Size}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
