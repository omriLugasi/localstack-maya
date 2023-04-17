import {useContext, useState} from 'react'
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import {Navbar} from "./navbar";
import {SqsManagement} from "./containers/sqs/sqsManagement";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SqsQueuePage} from "./containers/sqs/sqsQueuePage";
import {S3Management} from "./containers/S3/S3Management";
import {Home} from "./containers/home";
import {AppContext, ContextType} from "./contexts/application";
import './App.css'
import {S3BucketPage} from "./containers/S3/S3BucketPage";



const ToasterWrapper = () => {
    const context = useContext(AppContext)

    return (
            <>
                {
                    context.toasters.map(item => (
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            open
                            autoHideDuration={4000}
                            onClose={() => context.removeToaster(item.id)}>
                            <Alert severity={item.type} sx={{ width: '100%' }}>
                                {item.message}
                            </Alert>
                        </Snackbar>
                    ))
                }
            </>
    )
}

function App() {
  const [state, setState] = useState<{
      toasters: ContextType['toasters'],
      region: ContextType['region']
  }>({
      toasters: [],
      region: 'us-east-1'
  })

   const showToaster =  (params: { type: string, message: string }) => {

       setState({...state, toasters: [...state.toasters, { ...params, id: new Date().getTime()}]})
   }

    const removeToaster =  (id: number) => {
        setState({...state, toasters: state.toasters.filter(toaster => toaster.id !== id)})
    }

    const router = createBrowserRouter([
        {
            path: "/sns",
            element: <h1>SNS</h1>
        },
        {
            path: "/s3",
            element: <S3Management />
        },
        {
            path: "/s3/bucket/:bucketName",
            element: <S3BucketPage />
        },

        {
            path: "/sqs",
            element: <SqsManagement />,
        },

        {
            path: "/sqs/queue/:queueName",
            element: <SqsQueuePage />,
        },
        {
            path: '*',
            element: <Home />,
        },
    ])

  return (
    <AppContext.Provider value={{
        ...state,
        showToaster,
        removeToaster
    }}>
        <Navbar
            regions={['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1' ]}
            onRegionChange={(selectedValue => {
                setState({
                    ...state,
                    region: selectedValue as string
                })
            })}
            navigateHome={() => router.navigate('/')}
        />
        <RouterProvider router={router} />
        <ToasterWrapper />
    </AppContext.Provider>
  )
}

export default App
