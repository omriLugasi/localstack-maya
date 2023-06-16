import {Dialog} from "@mui/material";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {createSns} from "../../api/sns";
import {useContext, useState} from "react";
import {AppContext} from "../../contexts/application";


interface IProps {
    onClose: () => void
    onCreatedSuccessfully: () => void
}

export const CreateNewSns = (props: IProps) => {
    const [topicName, setTopicName] = useState<string>('')
    const [attributes, setAttributes] = useState<string>('')
    const [tags, setTags] = useState<string>('')

    const appContext = useContext(AppContext)

    const submitHandler = async () => {
        if (!topicName) {
            alert('Topic name is required')
            return
        }
        if (topicName.includes(' ')) {
            alert('Topic name cannot contains spaces')
            return
        }
        else if (topicName.includes('/')) {
            alert('Topic name cannot contains /')
            return
        }
        else if (topicName.includes('\\')) {
            alert('Topic name cannot contains \\')
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
            await createSns({
                topicName,
                attributes: JSON.parse(attributes || '{}'),
                tags: JSON.parse(tags || '[]'),
                region: appContext.region
            })
            props.onClose()
            props.onCreatedSuccessfully()
            alert(`${topicName} created successfully`)
        } catch(e) {
            console.error(e)
            alert('Oops something went wrong ' + e.message)
        }

    }

    return (
        <Dialog open onClose={props.onClose} >
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 20px' }}>
                <h1> Create new SNS Topic</h1>
                <TextField
                    inputProps={{
                        'data-qa': 'sqs-name-input'
                    }}
                    label="Topic Name"
                    variant="standard"
                    value={topicName}
                    onChange={e => setTopicName(e.target.value)}
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
                        onClick={submitHandler}
                    >Create</Button>
                </div>
            </div>
        </Dialog>
    )

}
