import { ReactNode } from "react";

export interface IComponent{
    children?: ReactNode
    match?: any
}

export interface IComponentQuery extends IComponent {
    first?: number
}

export interface IComponentQueryWithTitle extends IComponentQuery {
    prefixTitle(title: string): string
    location?: any
}