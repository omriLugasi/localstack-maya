import React from "react";
import { useNavigate } from 'react-router-dom'
import {Avatar} from "@mui/material";

const supportedServices = [
    { serviceName: 'SQS', serviceDescription: 'Simple Queue Service' },
    { serviceName: 'S3', serviceDescription: 'S3 database' },
    { serviceName: 'SNS', serviceDescription: 'Simple Notification Service' },
    { serviceName: 'Func', serviceDescription: 'Lambda' },
]

export const Home = () => {
    const navigate = useNavigate()
    return (
        <div className='home'>
            <h1> Welcome To LOCALSTACK - MAYA</h1>
            <p>
                Thank you for using localstack maya as part of your local environment.
                <br/>
                Hope that you will find this tool fit for your needs.
                <br/>
                You can help us develop more and more tools like that in our
                <a href='https://github.com/omriLugasi/localstack-maya'> open source project</a>.
            </p>
            <img src={'https://vitejs.dev/logo.svg'} className='logo' />

            <p>
                Click on one of the following and start you journey with us:
            </p>
            <div className='services'>
                {
                    supportedServices.map(item => {
                        return (
                            <Avatar
                                data-qa={item.serviceName + '-service'}
                                key={item.serviceName}
                                title={item.serviceDescription}
                                onClick={() => navigate('/' + item.serviceName)}
                                sx={{ bgcolor: '#222', width: 60, height: 60, cursor: 'pointer' }}
                            > {item.serviceName} </Avatar>
                        )
                    })
                }

                {/*<Avatar sx={{ bgcolor: '#222', width: 60, height: 60 }}> SNS </Avatar>*/}
                {/*<Avatar sx={{ bgcolor: '#222', width: 60, height: 60 }}> S3 </Avatar>*/}
                {/*<Avatar sx={{ bgcolor: '#222', width: 60, height: 60 }}> Func </Avatar>*/}
            </div>
        </div>
    )
}
