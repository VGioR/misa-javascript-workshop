export default function rankFor(score) {
    if (score >= 25) {
        return "Legendary bopper";
    } else if (score >= 15) {
        return "Quick hands";
    } else if (score >= 5) {
        return "Nice warm-up";
    } else {
        return "MISAbot got away this time";
    }
}