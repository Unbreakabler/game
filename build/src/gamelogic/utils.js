const thousand = 1000;
const million = 1000000;
const billion = 1000000000;
const trillion = 1000000000000;
const quadrilion = 1000000000000000;
/**
 * Function to format a number for display on screen.
 * @param input Number to format
 * @param decimals How many decimals do you want
 */
function formatNumber(input, decimals) {
    if (!input)
        input = 0;
    if (input < 0)
        return "-" + formatNumber(-1 * input, decimals);
    if (input >= quadrilion)
        return input.toExponential(decimals).replace("+", "");
    if (input >= trillion)
        return (input / trillion).toFixed(decimals) + "T";
    if (input >= billion)
        return (input / billion).toFixed(decimals) + "B";
    if (input >= million)
        return (input / million).toFixed(decimals) + "M";
    if (input >= thousand)
        return (input / thousand).toFixed(decimals) + "K";
    return input.toFixed(decimals);
}

export { formatNumber };
//# sourceMappingURL=utils.js.map
