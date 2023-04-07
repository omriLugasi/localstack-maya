import { useState } from 'react'
import './App.css'
import {Navbar} from "./navbar";
import {SqsSearch} from "./services/sqs/sqsSearch";

function App() {
  const [activeService, setActiveService] = useState<string | null>('SQS')

  return (
    <>
        <Navbar
            services={['SQS', 'S3', 'SNS']}
            onServiceChange={(selectedValue => {setActiveService(selectedValue)})}
        />
        {activeService === 'SQS' ? <SqsSearch /> : activeService}
    </>
  )
}

export default App
