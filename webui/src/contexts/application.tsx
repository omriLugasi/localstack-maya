import React from "react";


export type ContextType = {
    toasters: { type: string, message: string, id: number }[],
    showToaster: (params: { type: string, message: string }) => void
    removeToaster: (id: number) => void,
    region: string
}

export const AppContext: React.Context<ContextType> = React.createContext({} as ContextType);
