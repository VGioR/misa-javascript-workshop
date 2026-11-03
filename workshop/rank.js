export default function rankFor(score) {
    if (score >= 25) {
        return "holy clicking";
    } else if (score >= 15) {
        return "type shi";
    } else if (score >= 5) {
        return "son";
    } else {
        return "oh nahhh";
    }
}