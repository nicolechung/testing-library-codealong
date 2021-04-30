import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react'
import { Form } from './form'
import * as Fetch from './fake-fetch'

const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

Object.defineProperty(window, 'special', {
    value: 'Hello',
});

jest.mock('./fake-fetch', () => ({
    fakeFetch: jest.fn()
}))
let fakeFetch = jest.spyOn(Fetch, "fakeFetch")

jest.useFakeTimers()

describe('Form', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
         
    })
    
    it('renders', async () => {
        
        fakeFetch.mockImplementation(await act(() => Promise.resolve({date: 'blblb', text: 'BBLB'})))
        
        localStorageMock.getItem.mockReturnValue('POOP')
        render(<Form />)
        await screen.getByRole('heading', {
            name: /Hello/i
        })
        await screen.getByRole('heading', {
            name: /POOP/i
        })
        expect(localStorageMock.getItem).toHaveBeenCalled() 

    })
    
    it('fetches and displays data', async () => {
        fakeFetch.mockImplementation(() => Promise.resolve({date: 'blblb', text: 'BBLB'}))
        
        render(<Form />)
        
        await waitFor(() => expect(Fetch.fakeFetch).toHaveBeenCalledTimes(1))
        await screen.getByLabelText(/enter a date:/i)
        
        console.log(screen.getByLabelText(/enter a date:/i).value)
        //expect(screen.getByLabelText(/enter a date:/i)).toEqual('hello')
    })
})