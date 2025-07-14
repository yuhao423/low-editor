import type { CSSProperties, PropsWithChildren } from "react";

export interface CommonComponentProps extends PropsWithChildren{
    id: string;
    name: string;
    style?:CSSProperties
    [key: string]: any
}
