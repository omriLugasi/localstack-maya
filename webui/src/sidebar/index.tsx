import classes from './index.module.scss'
import React from "react";

interface IProps {
    navigate: (str: string) => void
}

export const Sidebar = (props: IProps) => {
    return (
        <div className={classes.sidebar}>
            <img src={'https://vitejs.dev/logo.svg'} style={{ width: 40 }}
             onClick={() => { props.navigate('/')}}
            />
            <span onClick={() => { props.navigate('/SNS')}} >SNS</span>
            <span onClick={() => { props.navigate('/SQS')}} >SQS</span>
            <span onClick={() => { props.navigate('/S3')}} >S3</span>
            <span onClick={() => { props.navigate('/Func')}} >Lambda</span>
        </div>
    )
}
