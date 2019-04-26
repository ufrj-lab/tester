const configPrefix =  (prefix: string) => (title: string) => `${prefix}${title}`
const getTimeSemantic = (milliseconds: number) => {
    const time = Math.abs(milliseconds / 1000)
  
    const seconds = `${~~time % 60}s`
    if (time < 60) return seconds
  
    const minutes = `${~~((time % 3600)/60)}m`;
    if (time < 3600) return `${minutes}${seconds}`
  
    const hours = `${~~(time / 3600)}h`
    return `${hours}${minutes}${seconds}`
}

export {
    getTimeSemantic,
    configPrefix,
}