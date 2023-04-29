import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {s3} from "../../api/S3";

interface IProps {
}

export const S3FilePage = (props: IProps) => {
    const { bucketName } = useParams();

    let filePath = window.location.pathname.split('?')[0]
        .replace(`/S3/file/${bucketName}`, '')

    if (filePath.startsWith('/')) {
        filePath = filePath.substring(1, filePath.length)
    }

    useEffect(() => {
        const query = async () => {
            s3.listObjectVersions({
                Bucket: bucketName as string,
                Prefix: filePath
            }).promise().then(console.log)
        }

        query()
    }, [])

    return(
        <h1> Hello here ... {filePath} </h1>
    )
}