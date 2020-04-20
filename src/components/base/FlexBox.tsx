import React, { ReactElement } from "react"
import styles from './FlexBox.module.scss'
export const FlexBox = (props: FlexBoxModel) => {
    return <div className={styles.FlexBox}>
        {props.children}
    </div>
}

export const FlexBoxItem = (props: FlexBoxItemModel) => {
    return <div className={styles.FlexBoxItem} style={{width: props.width, flexGrow: props.flexGrow}}>
        {props.children}
    </div>
}

interface FlexBoxModel {
    children: ReactElement[] | ReactElement
}

interface FlexBoxItemModel {
    width: string | number | undefined,
    flexGrow: number | "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | undefined,
    children: JSX.Element
}