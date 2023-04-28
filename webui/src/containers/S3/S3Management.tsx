import { useState, useEffect } from 'react'
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
import {createBucket, S3GetBuckets} from "../../api/S3";
import Button from "@mui/material/Button";

type BucketType = { Name: string, CreationDate: string }

interface IProps {}

export const S3Management = (props: IProps) => {
    const [searchDebounceValue, searchActualValue, setSearchValue] = useDebounce(250)
    const [ buckets, setBuckets ] = useState<BucketType[]>([])
    const navigate = useNavigate()

    const searchForBuckets = async () => {
        try {
            const response = await S3GetBuckets({ search: searchActualValue })
            setBuckets(response.Items.filter((bucket: BucketType) => bucket.Name.includes(searchActualValue)))
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        searchForBuckets()
    }, [searchActualValue])

    return (
        <div className='s3-page-padding-left'>
            <h2> S3 buckets </h2>
            <div className='sub-title-bar'>
                <span>Manage your S3 buckets.</span>
                <div className='sub-title-bar-actions'>
                    <Button
                        data-qa='s3-create-queue'
                        variant="contained"
                        size='small'
                        onClick={() => createBucket({
                            IsVersioned: true,
                            versioningParams: {
                                Bucket: 'xyz2',
                                VersioningConfiguration: {
                                    MFADelete: "Disabled",
                                    Status: "Enabled"
                                },
                                CreateBucketConfiguration: {
                                    LocationConstraint: 'us-east-1'
                                }
                            },
                            createBucketParams: {
                                Bucket: 'xyz2',
                            }
                        })}

                    >Create bucket</Button>
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
                            <TableCell>Bucket name</TableCell>
                            <TableCell>Created at</TableCell>
                            <TableCell>Version</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buckets.map((bucket: BucketType, index: number) => index > 7 ? null : (
                            <TableRow
                                key={bucket.Name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                <span
                                    data-qa={`s3-bucket-column-name-${bucket.Name}`}
                                    className='link'
                                    onClick={() => navigate(`/S3/bucket/${bucket.Name}`)}>
                                    {bucket.Name}
                                </span>
                                </TableCell>
                                <TableCell>
                                    {bucket.CreationDate}
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
        </div>
    )
}
