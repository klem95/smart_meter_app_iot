export const convertTime = async (date: Date, end:boolean): Promise<Date> => {
    if(end)
        date.setHours(24 - 2)
    else
        date.setHours(date.getHours() - 2)

    return date
}