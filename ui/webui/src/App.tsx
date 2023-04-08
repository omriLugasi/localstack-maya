import {useEffect, useState} from 'react'
import './App.css'
import {Navbar} from "./navbar";
import {SqsManagement} from "./services/sqs/sqsManagement";

function App() {
  const [activeService, setActiveService] = useState<string | null>('SQS')
  const [region, setRegion] = useState<string>('us-east-1')

  useEffect(() => {
      window.region = 'us-east-1'
  })

  return (
    <>
        <Navbar
            services={['SQS', 'S3', 'SNS']}
            regions={['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1' ]}
            onServiceChange={(selectedValue => {setActiveService(selectedValue)})}
            onRegionChange={(selectedValue => {
                window.region = selectedValue
                setRegion(selectedValue as string)
            })}
        />
        {activeService === 'SQS' ? <SqsManagement region={region} /> : activeService}
    </>
  )
}

export default App
