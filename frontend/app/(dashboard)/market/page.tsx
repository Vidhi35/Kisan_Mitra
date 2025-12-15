import { getMarketRates } from "@/lib/actions/market"

export default async function MarketScreen() {
  const ratesResult = await getMarketRates({}, 20)
  const rates = ratesResult.data || []

  return (
    <div className="px-4 md:px-10 flex flex-1 justify-center py-8">
      <div className="flex flex-col max-w-[1200px] flex-1 gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black">Market Insights</h1>
          <p className="text-text-muted dark:text-gray-400 text-base">Real-time prices from markets across India</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e22]">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-bold">Commodity</th>
                <th className="px-6 py-4 font-bold">Market</th>
                <th className="px-6 py-4 font-bold text-right">Price/Qtl</th>
                <th className="px-6 py-4 font-bold text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rates.length > 0 ? (
                rates.map((rate) => (
                  <tr key={rate.id}>
                    <td className="px-6 py-4 font-medium text-text-main dark:text-white">{rate.crop_name}</td>
                    <td className="px-6 py-4">{rate.market_location}</td>
                    <td className="px-6 py-4 text-right font-bold text-text-main dark:text-white">
                      ₹{rate.price_per_quintal.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-bold ${
                        rate.price_change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {rate.price_change >= 0 ? "+" : ""}
                      {rate.price_change}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No market data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
