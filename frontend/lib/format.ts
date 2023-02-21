
// const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Janurary", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// returns a string of the unix time stamp in a 12 hour clock, eg 8pm
export function formatUnixTimeStamp(unix_timestamp: number) { 
    const date = new Date(unix_timestamp);

    const month = months[date.getMonth()];
    const day = date.getDate();
    // const dayOfWeek = daysOfTheWeek[date.getDay()];
    let suffix = "AM";
    let hours = date.getHours();

    if(hours >= 12) {
        hours -= 12;
        suffix = "PM";
    }

    const minutes = "0" + date.getMinutes();

    return `${month} ${day}, ${hours}:${minutes.substr(-2)} ${suffix}`;
}
