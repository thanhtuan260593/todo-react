// src/server/item.ts

import {get, post, put, _delete} from "./helper";
import { ItemModel as Item } from "../models";

export async function createItem(title: string) {
  return post<Item>("/todo/create/item", JSON.stringify({ title }));
}

export async function getItems() {
  return get<Item[]>("/todo/items");
}

export async function updateItem(body:Item) {
  return put<Item>(`/todo/item/${body.id}/update`, JSON.stringify(body));
}

export async function toggleItem(id:Number) {
  return put<Item>(`/todo/item/${id}/toggle`);
}

export async function deleteItem(id:Number) {
  return _delete<boolean>(`/todo/item/${id}`);
}