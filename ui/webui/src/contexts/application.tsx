import React from "react";


export const AppContext: React.Context<{
    toasters: { type: string, message: string, id: string }[],
    showToaster: (params: { type: string, message: string }) => void
    removeToaster: (id: string) => void
}> = React.createContext({});
