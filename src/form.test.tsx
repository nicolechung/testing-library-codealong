import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react'
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

jest.mock('./fake-fetch')

let fakeFetch = jest.spyOn(Fetch, "fakeFetch")

jest.useFakeTimers()


describe('Form', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        fakeFetch.mockRestore()
    })
    
    it('renders', async () => {
        const responseMock = {
            date: '2020-04-20',
            text: 'HALLO'
        }

        fakeFetch.mockImplementation(() =>Promise.resolve(responseMock))
        
        localStorageMock.getItem.mockReturnValue('POOP')
        await act(async () => {
            render(<Form />)
        })

        await screen.getByRole('heading', {
            name: /Hello/i
        })

        await screen.getByRole('heading', {
            name: /POOP/i
        })

        expect(localStorageMock.getItem).toHaveBeenCalled() 
        
    })
    
    it('fetches data from the api and displays the data', async () => {
        const responseMock = {
            date: '2020-04-20',
            text: 'HALLO'
        }
        
        fakeFetch.mockImplementation(() =>Promise.resolve(responseMock))
        localStorageMock.getItem.mockReturnValue('POOP')
        await act(async () => {
            render(<Form />)
        })
        expect(fakeFetch).toHaveBeenCalledTimes(1)
        expect((screen.getByLabelText(/enter a date:/i) as HTMLInputElement).value).toEqual(responseMock.date)
        expect((screen.getByRole('textbox', {
            name: /enter good text/i
          }) as HTMLInputElement).value).toEqual(responseMock.text)
    })

    it('displays an error with invalid data', async() => {
        const responseMock = {
            date: '2020-04-20',
            text: 'HALLO'
        }
        
        fakeFetch.mockImplementation(() =>Promise.resolve(responseMock))
        localStorageMock.getItem.mockReturnValue('POOP')
        await act(async () => {
            render(<Form />)
        })
        fireEvent.change(screen.getByLabelText(/enter a date:/i), { target: { value: '2020-01-01' } })
        fireEvent.change(screen.getByRole('textbox', {
            name: /enter good text/i
          }), { target: { value: '#invalid' } })
        
        act(() => {
            fireEvent.click(screen.getByRole('button', {
            name: /submit/i
          }))
        })
        expect(screen.getByText(/date is invalid/i)).toBeVisible()
        expect(screen.getByText(/text is invalid/i)).toBeVisible()
    })

    it('displays a success message with valid data on form submit', async() => {

    })
})