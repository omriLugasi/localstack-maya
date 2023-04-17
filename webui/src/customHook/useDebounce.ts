import {useRef, useState} from "react";


const useDebounce = (wait: number): [string, string, (str: string) => void] => {
    const timer = useRef<number | null>()
    const [debounceValue, setDebounceValue] = useState<string>('')
    const [value, setActualValue] = useState<string>('')

    const setValue = (str: string) => {
        setDebounceValue(str)
        if (timer.current) {
            clearTimeout(timer.current as number)
        }
        timer.current = setTimeout(() => {
            setActualValue(str)
            timer.current = null
        }, wait)

    }

    return [ debounceValue, value, setValue]
}

export default useDebounce
