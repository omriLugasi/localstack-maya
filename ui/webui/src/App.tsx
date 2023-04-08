import {useEffect, useState} from 'react'
import './App.css'
import {Navbar} from "./navbar";
import {SqsManagement} from "./services/sqs/sqsManagement";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SqsQueuePage} from "./api/sqsQueuePage";

;

function App() {
  const [region, setRegion] = useState<string>('us-east-1')

  useEffect(() => {
      window.region = 'us-east-1'
  }, [])

    const router = createBrowserRouter([
        {
            path: "/sns",
            element: <h1>SNS</h1>
        },
        {
            path: "/s3",
            element: <h1>S3</h1>
        },

        {
            path: "/sqs",
            element: <SqsManagement region={region} />,
        },

        {
            path: "/sqs/queue/:queueName",
            element: <SqsQueuePage region={region} />,
        },
        {
            path: "/",
            element: <SqsManagement region={region} />,
        },
    ])

  return (
    <>
        <Navbar
            services={['SQS', 'S3', 'SNS']}
            regions={['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1' ]}
            onServiceChange={(selectedValue => {router.navigate(`/${selectedValue}`)})}
            onRegionChange={(selectedValue => {
                window.region = selectedValue
                setRegion(selectedValue as string)
            })}
        />
        <RouterProvider router={router} />
    </>
  )
}

export default App
