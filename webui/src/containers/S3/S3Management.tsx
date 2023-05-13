import { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import useDebounce from "../../customHook/useDebounce";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {deleteBuckets, S3GetBuckets} from "../../api/S3";
import Button from "@mui/material/Button";
import type {Bucket} from 'aws-sdk/clients/s3'
import {CreateBucketDialog} from "./CreateBucket";
import Checkbox from "@mui/material/Checkbox";
import {AppContext} from "../../contexts/application";

interface IProps {}

export const S3Management = (props: IProps) => {
    const [searchDebounceValue, searchActualValue, setSearchValue] = useDebounce(250)
    const [ buckets, setBuckets ] = useState<Bucket[]>([])
    const [ selectedBuckets, setSelectedBuckets ] = useState<Bucket[]>([])
    const [ createBucketDialog, setCreateBucketDialog ] = useState<boolean>(false)
    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    const searchForBuckets = useCallback(async () => {
        try {
            const response = await S3GetBuckets({ search: searchActualValue })
            setBuckets(response.Items.filter((bucket: Bucket) => bucket.Name?.includes(searchActualValue)))
        } catch (e) {
            console.error(e)
        }
    }, [searchActualValue])

    useEffect(() => {
        searchForBuckets()
    }, [searchActualValue])

    const handleBucketSelection = useCallback(async (bucket: Bucket) => {
        if (selectedBuckets.some(selectedBucket => selectedBucket.Name === bucket.Name)) {
            setSelectedBuckets(
                selectedBuckets.filter(selectedBucket => selectedBucket.Name !== bucket.Name)
            )
        } else{
            setSelectedBuckets([ ...selectedBuckets, bucket])
        }
    }, [selectedBuckets])

    const handleDeleteSelectedBucket = useCallback(async () => {
        const [bucket] = selectedBuckets
        try {
            await deleteBuckets({ bucketName: bucket.Name as string })
            appContext.showToaster({
                type: 'success',
                message: `Bucket ${bucket.Name} deleted successfully`
            })
            setSelectedBuckets(
                selectedBuckets.filter(selectedBucket => selectedBucket.Name !== bucket.Name)
            )
            searchForBuckets()
        } catch (e) {
            // TODO: Better error handling
            appContext.showToaster({
                type: 'error',
                message: 'Cannot delete non empty bucket'
            })
        }
    }, [selectedBuckets])

    return (
        <div className='s3-page-padding-left'>
            <h2> S3 buckets </h2>
            <div className='sub-title-bar'>
                <span>Manage your S3 buckets.</span>
                <div className='sub-title-bar-actions'>
                    <Button
                        data-qa='s3-create-bucket'
                        variant="contained"
                        size='small'
                        onClick={() => {
                            setCreateBucketDialog(true)
                        }}

                    >Create bucket</Button>

                    {
                        selectedBuckets.length > 0 && <Button
                            data-qa='s3-delete-selected-bucket'
                            variant="contained"
                            size='small'
                            disabled={selectedBuckets.length > 1}
                            onClick={handleDeleteSelectedBucket}
                        >Delete bucket</Button>
                    }
                </div>
            </div>

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
            <TableContainer component={Paper} style={{ width: '92%'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                            <TableCell>Bucket name</TableCell>
                            <TableCell>Created at</TableCell>
                            <TableCell>Version</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buckets.map((bucket: Bucket, index: number) => index > 7 ? null : (
                            <TableRow
                                key={bucket.Name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell width='40'>
                                    <Checkbox
                                        inputProps={{
                                            'data-qa' : `bucket-checkbox-${bucket.Name}`
                                        }}
                                        onClick={() => handleBucketSelection(bucket)}
                                        size='small' />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                <span
                                    data-qa={`s3-bucket-column-name-${bucket.Name}`}
                                    className='link'
                                    onClick={() => navigate(`/S3/bucket/${bucket.Name}`)}>
                                    {bucket.Name}
                                </span>
                                </TableCell>
                                <TableCell>
                                    {bucket.CreationDate.toISOString()}
                                </TableCell>
                                <TableCell>
                                    No
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                buckets.length > 7 ? <p> Display 8 from { buckets.length } results. </p> : null
            }
            {
                createBucketDialog && <CreateBucketDialog onClose={() => setCreateBucketDialog(false)} />
            }
        </div>
    )
}
