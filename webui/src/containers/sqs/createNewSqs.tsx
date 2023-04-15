import {Dialog} from "@mui/material";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {createSqs} from "../../api/sqs";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/application";


interface IProps {
    onClose: () => void
    onCreatedSuccessfully: () => void
}

export const CreateNewSqs = (props: IProps) => {
    const [queueName, setQueueName] = useState<string>('')
    const [attributes, setAttributes] = useState<string>('')
    const [tags, setTags] = useState<string>('')

    const appContext = useContext(AppContext)

    const createSqsHandler = async () => {
        if (!queueName) {
            alert('Sqs name is required')
            return
        }
        if (queueName.includes(' ')) {
            alert('Sqs name cannot contains spaces')
            return
        }
        else if (queueName.includes('/')) {
            alert('Sqs name cannot contains /')
            return
        }
        else if (queueName.includes('\\')) {
            alert('Sqs name cannot contains \\')
            return
        }

        if (attributes) {
            try {
                JSON.parse(attributes)
            } catch (e) {
                return alert('attributes cannot be parsed into JSON format')
            }
        }

        if (tags) {
            try {
                JSON.parse(tags)
            } catch (e) {
                return alert('tags cannot be parsed into JSON format')
            }
        }

        try {
            await createSqs({
                queueName: queueName,
                attributes: JSON.parse(attributes || '{}'),
                tags: JSON.parse(tags || '{}'),
                region: appContext.region
            })
            props.onClose()
            props.onCreatedSuccessfully()
            alert(`${queueName} created successfully`)
        } catch(e) {
            console.log(e)
            alert('Oops something went wrong ' + e.response.data.message)
        }

    }

    return (
        <Dialog open onClose={props.onClose} >
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 20px' }}>
                <h1> Create new SQS</h1>
                <TextField
                    inputProps={{
                        'data-qa': 'sqs-name-input'
                    }}
                    label="Sqs Name"
                    variant="standard"
                    value={queueName}
                    onChange={e => setQueueName(e.target.value)}
                />
                <br />
                <TextField
                    label="Attributes (JSON)"
                    multiline
                    rows={4}
                    value={attributes}
                    onChange={e => setAttributes(e.target.value)}
                />
                <br />
                <TextField
                    label="tags (JSON)"
                    multiline
                    rows={4}
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                />
                <br />
                <br />
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, margin: '10px 0' }}>
                    <Button variant="outlined" size={'small'} onClick={props.onClose}>Close</Button>
                    <Button
                        data-qa='create-sqs-queue'
                        variant="contained"
                        size={'small'}
                        onClick={createSqsHandler}
                    >Create</Button>
                </div>
            </div>
        </Dialog>
    )

}
