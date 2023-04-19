import {useParams} from "react-router-dom";
import {useEffect, useRef} from "react";
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

type BucketFileType = {}

interface IProps {
}

export const S3BucketPage = (props: IProps) => {
    const ref = useRef()
    const { bucketName } = useParams();

    useEffect(() => {
        const query = async() => {
            const response = await s3GetBucketFiles({
                bucketName: bucketName as string
            })
            console.log(response)
        }
        query()
    }, [])

    return (
        <>
            <h1>Bucket page { bucketName }</h1>
            <div className='sub-title-bar'>
                <span>Manage the S3 bucket ({bucketName}).</span>
                <div className='sub-title-bar-actions'>
                    <input
                        onChange={(e) => console.log(e)}
                        ref={ref}
                        type='file'
                        style={{ display: 'none' }}
                    />
                    <Button
                        onClick={() => {
                            ref.current.click()
                        }}
                        data-qa='sqs-delete-queue'
                        variant="contained"
                        size='small'
                    >Upload file</Button>
                </div>
            </div>
            <TableContainer component={Paper} style={{ width: '92%'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Checkbox size='small' />
                        </TableCell>
                        <TableCell>Index</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">Sent</TableCell>
                        <TableCell align="left">Receive Count</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[].map((row: BucketFileType, index: number) => (
                        <TableRow key={row}>
                            <TableCell>
                                <Checkbox
                                    data-qa={`message-checkbox-${index + 1}`}
                                    size='small' />
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </>
    )
}
