import {configureStore} from '@reduxjs/toolkit'
import uislice  from './ui_slice.js'
import field_slice from './field_slice.js'
import voteSlice from './vote_slice.js';
const store = configureStore({
    reducer: {
        ui: uislice.reducer,
        fields: field_slice.reducer,
        vote: voteSlice.reducer
    },
    
})

export default store;