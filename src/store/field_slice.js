import React from "react"
import { createSlice, nanoid } from "@reduxjs/toolkit"
const field_slice = createSlice({
    name:"fields",
    initialState:{
        fields:[
            {id: nanoid(), name:"", type:"string"}
        ]
    },
    reducers:{
        addField: (state) =>{
            state.fields.push({id:nanoid(), name:"", type: "string"})
        },
        updateField: (state, action) => {
            const {id,key,value} = action.payload
            const field = state.fields.find(f=> f.id == id);
            if(field) field[key] = value;
        },
    },
})

export const field_slice_actions = field_slice.actions
export default field_slice;