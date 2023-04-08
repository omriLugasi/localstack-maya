import {useState} from "react";


export const useFieldNameHook = (defaultValue: Record<string, string>): [Record<string, string>, (params: { fieldName: string }) => Record<string, unknown>, (e: any) => void] => {
    const [state, setState] = useState<Record<string, string>>(defaultValue)

    return [
        state,
        (params: { fieldName: string }) => ({
            name: params.fieldName,
            value:  state[params.fieldName] || '',
            onChange: (e: any) => {
                const { name, value } = e.target
                setState({
                    ...state,
                    [name]: value
                })
            }
        }),
        (e: any) => {
          const { name, value } = e.target
          setState({
              ...state,
              [name]: value
          })
        }
    ]
}
