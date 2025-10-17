import { vi } from 'vitest'
import {
  getCurrencyRates,
  getAvailableCurrencies,
  getLastSevenDays,
  isValidDateRange,
} from '../currencyApi'

// Mock fetch
global.fetch = vi.fn()

describe('Currency API', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('getCurrencyRates', () => {
    it('fetches currency rates successfully', async () => {
      const mockData = {
        gbp: {
          usd: 1.265,
          eur: 1.175,
          jpy: 185.5,
        }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await getCurrencyRates('gbp', '2024-10-17')

      expect(fetch).toHaveBeenCalledWith(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-10-17/v1/currencies/gbp.json'
      )
      expect(result).toEqual(mockData.gbp)
    })

    it('throws error on HTTP error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(getCurrencyRates('gbp', '2024-10-17')).rejects.toThrow('HTTP error! status: 404')
    })

    it('throws error on invalid data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      })

      await expect(getCurrencyRates('gbp', '2024-10-17')).rejects.toThrow('Invalid data received from API')
    })

    it('throws error on network failure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getCurrencyRates('gbp', '2024-10-17')).rejects.toThrow('Network error')
    })
  })

  describe('getAvailableCurrencies', () => {
    it('fetches available currencies successfully', async () => {
      const mockCurrencies = {
        usd: 'US Dollar',
        eur: 'Euro',
        gbp: 'British Pound Sterling',
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrencies,
      })

      const result = await getAvailableCurrencies()

      expect(fetch).toHaveBeenCalledWith(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
      )
      expect(result).toEqual(mockCurrencies)
    })

    it('throws error on HTTP error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(getAvailableCurrencies()).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('getLastSevenDays', () => {
    it('generates correct array of 7 days', () => {
      const result = getLastSevenDays('2024-10-17')

      expect(result).toHaveLength(7)
      expect(result[0]).toBe('2024-10-11') // 6 days before
      expect(result[6]).toBe('2024-10-17') // end date
    })

    it('handles month boundaries correctly', () => {
      const result = getLastSevenDays('2024-10-03')

      expect(result).toHaveLength(7)
      expect(result[0]).toBe('2024-09-27')
      expect(result[6]).toBe('2024-10-03')
    })

    it('handles year boundaries correctly', () => {
      const result = getLastSevenDays('2024-01-03')

      expect(result).toHaveLength(7)
      expect(result[0]).toBe('2023-12-28')
      expect(result[6]).toBe('2024-01-03')
    })
  })

  describe('isValidDateRange', () => {
    it('returns true for today', () => {
      const today = new Date().toISOString().split('T')[0]
      expect(isValidDateRange(today)).toBe(true)
    })

  it('returns true for 89 days ago', () => {
    const eightyNineDaysAgo = new Date()
    eightyNineDaysAgo.setDate(eightyNineDaysAgo.getDate() - 89)
    const dateString = eightyNineDaysAgo.toISOString().split('T')[0]
    
    expect(isValidDateRange(dateString)).toBe(true)
  })

    it('returns false for more than 90 days ago', () => {
      const hundredDaysAgo = new Date()
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100)
      const dateString = hundredDaysAgo.toISOString().split('T')[0]
      
      expect(isValidDateRange(dateString)).toBe(false)
    })

    it('returns false for future dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      const dateString = futureDate.toISOString().split('T')[0]
      
      expect(isValidDateRange(dateString)).toBe(false)
    })
  })
})
