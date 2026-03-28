
export function PricingMeter({ currentPrice, suggestedRange }: { currentPrice: number, suggestedRange?: { min: number, max: number } }) {
    if (!suggestedRange || !currentPrice) return null;

    const { min, max } = suggestedRange;
    const isGood = currentPrice >= min && currentPrice <= max;
    const isToLow = currentPrice < min;
    const isToHigh = currentPrice > max;

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Pricing Reality Check</span>
                {isGood && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Great Price!</span>}
                {isToLow && <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Likely to sell fast</span>}
                {isToHigh && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Hard to Sell</span>}
            </div>

            {/* Visual Meter Bar */}
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex relative">
                {/* Green Zone (Market Value) */}
                <div
                    className="h-full bg-green-500 absolute opacity-50"
                    style={{
                        left: '30%',
                        width: '40%'
                    }}
                />
                {/* Current Price Indicator */}
                <div
                    className="h-full w-2 bg-black absolute transition-all duration-500"
                    style={{
                        left: isToLow ? '15%' : isToHigh ? '85%' : '50%'
                    }}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Undervalued</span>
                <span>Market Value (${min}-${max})</span>
                <span>Overpriced</span>
            </div>
        </div>
    );
}
