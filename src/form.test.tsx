import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'
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

jest.useFakeTimers()

describe('Form', () => {
    beforeEach(() => {
        
        jest.resetAllMocks()
    })
    it('renders', async () => {
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
        const fakeFetch = jest.spyOn(Fetch, "fakeFetch")
        fakeFetch.mockImplementation(() => Promise.resolve({date: 'blblb', text: 'BBLB'}))
        render(<Form />)
        
        await waitFor(() => expect(Fetch.fakeFetch).toHaveBeenCalledTimes(1))
        // await waitFor(() => screen.getByLabelText(/enter a date:/i))
        
        //console.log(screen.getByLabelText(/enter a date:/i).value)
        //expect(screen.getByLabelText(/enter a date:/i)).toEqual('hello')
    })
})