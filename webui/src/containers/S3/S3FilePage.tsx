import {useParams, useSearchParams } from "react-router-dom";
import {useEffect} from "react";
import {listObjectVersions} from "../../api/S3";
import Button from "@mui/material/Button";

interface IProps {
}

export const S3FilePage = (props: IProps) => {
    const { bucketName } = useParams();
    const [searchParams] = useSearchParams();


    const filePath = searchParams.get('path')

    useEffect(() => {
        const query = async () => {
            listObjectVersions({
                Bucket: bucketName as string,
                Prefix: filePath
            }).then(console.log)
        }

        query()
    }, [])

    return(
        <div>
            <h1> Hello here ... {filePath} </h1>
            <Button> Download </Button>
            <Button> Open on new tab </Button>
        </div>
    )
}
