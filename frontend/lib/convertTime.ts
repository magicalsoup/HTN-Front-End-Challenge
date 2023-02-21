
// returns a string of the time in a 12 hour clock, eg 8pm
const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function convertUnixTimeStampToDate(unix_timestamp: number) { 
    const date = new Date(unix_timestamp);
    
    const day = daysOfTheWeek[date.getDay()];
    let suffix = "AM";
    let hours = date.getHours();

    if(hours >= 12) {
        hours -= 12;
        suffix = "PM";
    }

    const minutes = "0" + date.getMinutes();

    return `${day} ${hours}:${minutes.substr(-2)} ${suffix}`;
}