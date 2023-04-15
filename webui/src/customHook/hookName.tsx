import {useState} from "react";


export const useFieldNameHook = <T,>(defaultValue: T): [T, (params: { fieldName: string }) => Record<string, unknown>, (e: any) => void] => {
    const [state, setState] = useState<T>(defaultValue as T)

    return [
        state,
        (params: { fieldName: string }) => ({
            name: params.fieldName,
            value:  (state as Record<string, string>)[params.fieldName] || '',
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
