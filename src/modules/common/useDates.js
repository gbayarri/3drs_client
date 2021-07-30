export default function useDates() {

    const pad = (n) => n < 10 ? "0" + n : n

    const dateString = (dateobj) => {
        var dateobj = new Date(dateobj.replace(/\s/, 'T'))
        return pad(dateobj.getDate())+"/"+pad(dateobj.getMonth()+1)+"/"+dateobj.getFullYear()
    }

    const timeString = (dateobj) => {
        var dateobj = new Date(dateobj.replace(/\s/, 'T'))
        return pad(dateobj.getHours())+":"+pad(dateobj.getMinutes())+":"+pad(dateobj.getSeconds())
    }

    return { dateString, timeString }

}