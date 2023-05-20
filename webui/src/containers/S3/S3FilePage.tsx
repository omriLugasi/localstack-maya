import {useParams, useSearchParams } from "react-router-dom";
import {useEffect, useState} from "react";
import {listObjectVersions} from "../../api/S3";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Bucket} from "aws-sdk/clients/s3";
import TableContainer from "@mui/material/TableContainer";

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

    return(
        <div className='s3-page-padding-left'>
            <h1>S3 File page</h1>
            <div className='sub-title-bar'>
                <span>S3 file <a href="" className='link'>s3://{filePath}</a></span>
                <div className='sub-title-bar-actions'>
                    <Button
                        data-qa='s3-upload-file-button'
                        variant="contained"
                        size='small'
                    >Download file</Button>
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
