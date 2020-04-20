import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ItemModel } from '../models';
import { Checkbox, Button, Callout, EditableText, Card, Elevation } from '@blueprintjs/core';
import { FlexBox, FlexBoxItem } from "./base/FlexBox";
import { createItem, getItems, toggleItem, deleteItem, updateItem } from '../services/items';


class ItemModelWithEvents implements ItemModel {
    id: Number | undefined;
    title: string = "";
    isDone: boolean = false;
    onAdd?: ((model: ItemModel) => void);
    onCancel?: (() => void);
    onDelete?: (id: Number) => void;
    onError?: (message: string) => void;
}

export const Item = (props: ItemModelWithEvents) => {
    const [state, setState] = useState<ItemModel>(props);
    const ref = useRef<EditableText>(null);
    const handleChange = () => {
        props.id && toggleItem(props.id)
            .then(setState)
            .catch(e => props.onError && props.onError(JSON.stringify(e)))
    }
    const handleDelete = () => {
        props.onDelete && props.id && props.onDelete(props.id);
    }
    const handleSave = (value: string) => {
        const update: ItemModel = { title: value, id: props.id, isDone: state.isDone }
        props.id && value && updateItem(update)
        return props.id == null && props.onAdd && props.onAdd(update)
    }

    const handleCancel = () => {
        if (props.id == null)
            props.onCancel && props.onCancel()
        //props.onCancel && props.onCancel(props.id)
    }

    useEffect(() => {
        props.id == null && ref && ref.current && ref.current.toggleEditing()
    }, [props.id])

    return <div style={{ borderTop: "1px solid black" }}><FlexBox>
        <FlexBoxItem width={200} flexGrow={1}>
            <div>
                <Checkbox checked={state.isDone} onChange={handleChange} inline />
                <EditableText ref={ref} selectAllOnFocus defaultValue={state.title} onConfirm={handleSave} onCancel={handleCancel} />
            </div>
        </FlexBoxItem>
        <FlexBoxItem width={100} flexGrow="unset">
            <div style={{float: "right"}}>
                {props.id && <Button icon="trash" intent="danger" onClick={handleDelete} />}
            </div>
        </FlexBoxItem>
    </FlexBox>
    </div>
}

export const TodoList = () => {
    const [data, setData] = useState<ItemModel[]>();
    const [error, setError] = useState<any>();
    const [newItem, setNewItem] = useState<ItemModel>();
    const handleLoad = useCallback(async () => {
        getItems()
            .then(setData)
            .then(() => setNewItem(undefined))
            .catch(setError)
    }, []);
    const handleAddNew = useCallback(async () => {
        const newItem: ItemModel = {
            id: undefined,
            title: "",
            isDone: false
        }
        setNewItem(newItem);
    }, []);
    const handleSaveNew = (model: ItemModel) => {
        if (newItem && model.title)
            createItem(model.title)
                .then()
                .then(handleLoad)
                .catch(setError);
        else
            setNewItem(undefined)
    }
    const handleCancelNew = () => {
        setNewItem(undefined);
    }
    const handleDelete = (id: Number) => {
        deleteItem(id)
            .then(handleLoad)
            .catch(setError)
    }
    useEffect(() => {
        handleLoad();
    }, [handleLoad])

    if (error) {
        return <Callout title={"Error"}>
            {JSON.stringify(error)}
        </Callout>
    }

    return <div style={{ width: "600px" }}>
        <Card interactive={true} elevation={Elevation.TWO}>
            <FlexBox>
                <FlexBoxItem width={200} flexGrow={1}>
                    <h4>To-do list</h4>
                </FlexBoxItem>
                <FlexBoxItem width={200} flexGrow="unset">
                    <div style={{ float: "right" }}>
                        <Button icon="add" onClick={handleAddNew} />
                        <Button icon="refresh" onClick={handleLoad} />
                    </div>
                </FlexBoxItem>
            </FlexBox>

            {data && data.map(u => <Item {...u}
                key={u.id?.toString()}
                onDelete={handleDelete}
            />)}
            {newItem && <Item {...newItem}
                key={undefined}
                onError={setError}
                onAdd={handleSaveNew}
                onCancel={handleCancelNew} />
            }
        </Card>

    </div>
}