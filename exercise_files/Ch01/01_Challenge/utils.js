/**
 * 
 * @param {Date} date 
 * @returns 
 */

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}