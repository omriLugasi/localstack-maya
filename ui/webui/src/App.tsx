import { useState } from 'react'
import './App.css'
import {Navbar} from "./navbar";
import {SqsManagement} from "./services/sqs/sqsManagement";

function App() {
  const [activeService, setActiveService] = useState<string | null>('SQS')

  return (
    <>
        <Navbar
            services={['SQS', 'S3', 'SNS']}
            onServiceChange={(selectedValue => {setActiveService(selectedValue)})}
        />
        {activeService === 'SQS' ? <SqsManagement /> : activeService}
    </>
  )
}

export default App
