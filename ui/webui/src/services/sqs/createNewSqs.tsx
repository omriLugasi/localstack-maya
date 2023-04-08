import {Dialog} from "@mui/material";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {useFieldNameHook} from "../../customHook/hookName";
import {createSqs} from "../../api/sqs";


interface IProps {
    onClose: () => void
    onCreatedSuccessfully: () => void
}

export const CreateNewSqs = (props: IProps) => {
    const [state, initialProps, setState] = useFieldNameHook({})

    const createSqsHandler = async () => {
        if (!state.queueName) {
            alert('Sqs name is required')
            return
        }
        if (state.queueName.includes(' ')) {
            alert('Sqs name cannot contains spaces')
            return
        }
        else if (state.queueName.includes('/')) {
            alert('Sqs name cannot contains /')
            return
        }
        else if (state.queueName.includes('\\')) {
            alert('Sqs name cannot contains \\')
            return
        }

        if (state.attributes) {
            try {
                JSON.parse(state.attributes)
            } catch (e) {
                return alert('attributes cannot be parsed into JSON format')
            }
        }

        if (state.tags) {
            try {
                JSON.parse(state.tags)
            } catch (e) {
                return alert('tags cannot be parsed into JSON format')
            }
        }

        try {
            await createSqs({
                queueName: state.queueName,
                attributes: JSON.parse(state.attributes || '{}'),
                tags: JSON.parse(state.tags || '{}')
            })
            props.onClose()
            props.onCreatedSuccessfully()
            alert(`${state.queueName} created successfully`)
        } catch(e: unknown) {
            console.log(e)
            alert('Oops something went wrong ' + e.response.data.message)
        }

    }

    return (
        <Dialog open onClose={props.onClose} >
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 20px' }}>
                <h1> Create new SQS</h1>
                <TextField
                    label="Sqs Name"
                    variant="standard"
                    { ...initialProps({ fieldName: 'queueName' }) }
                />
                <br />
                <TextField
                    label="Attributes (JSON)"
                    multiline
                    rows={4}
                    { ...initialProps({ fieldName: 'attributes' }) }
                />
                <br />
                <TextField
                    label="tags (JSON)"
                    multiline
                    rows={4}
                    { ...initialProps({ fieldName: 'tags' }) }
                />
                <br />
                <br />
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, margin: '10px 0' }}>
                    <Button variant="outlined" size={'small'} onClick={props.onClose}>Close</Button>
                    <Button
                        variant="contained"
                        size={'small'}
                        onClick={createSqsHandler}
                    >Create</Button>
                </div>
            </div>
        </Dialog>
    )

}
