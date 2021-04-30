import React from 'react';
import { render, screen } from '@testing-library/react'
import { Form } from './form'

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
    
    it('fetches and displays data', () => {
        render(<Form />)
    })
})