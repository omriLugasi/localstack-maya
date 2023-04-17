import {useParams} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../../contexts/application";

interface IProps {
}

export const S3BucketPage = (props: IProps) => {
    const { bucketName } = useParams();
    const appContext = useContext(AppContext)
    return (
        <h1>Bucket page { bucketName }</h1>
    )
}
