import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        filterReducer(state = '', action) {
            switch (action.type) {
                case 'SET_FILTER':
                    return action.payload
                default:
                    return state
            }
        },
        filterChange(filter) {
            return {
                type: 'SET_FILTER',
                payload: filter,
            }
        }
    }
})

export const { filterReducer, filterChange } = filterSlice.actions
export default filterSlice.reducer