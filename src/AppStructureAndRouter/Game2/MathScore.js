function MathScore(score, strik) {
    let strikmultiply = Math.floor(strik / 4);
    let multiply;
    switch (strikmultiply) {
        case 0:
            multiply = 1;
            score += 10 * multiply;
            break;
        case 1:
            multiply = 2;
            score += 10 * multiply;
            break;
        case 2:
            multiply = 4;
            score += 10 * multiply;
            break;
        default:
            multiply = 8;
            score += 10 * multiply;
    }

    return { "score": score, "oneScore": multiply * 10, "strik": strik };
}


export default MathScore