
function ticksToMilliseconds(offsetInTicks: number): number {
    const milliseconds = Math.floor(offsetInTicks * 0.0001); // Convert ticks to milliseconds and round down
    return milliseconds;
}
export { ticksToMilliseconds }  